import { connectMongoDB } from "@lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import NodeList from "@models/nodeList";
import Journey from "@models/journey";
import List from "@models/list";
import { NextResponse } from "next/server";

/**
 * POST /api/journey/node-progress
 * After a user wins in Classic Journey mode, updates node progress
 * 
 * Body: { nodeId: "2-3", scoredXP: 100 }
 * 
 * Returns: { success, nodeProgress: { percent, completed }, nextNode }
 */
export async function POST(request) {
  try {
    const syncDebugEnabled = request.headers.get("x-journey-sync-debug") === "1";
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nodeId, wordsCompleted = 0, totalWords = 0 } = await request.json();
    if (syncDebugEnabled) {
      console.log("[JourneySync][server] node-progress.request", {
        userEmail: session.user.email,
        nodeId,
        wordsCompleted,
        totalWords,
      });
    }
    if (!nodeId) {
      return NextResponse.json({ error: "nodeId required" }, { status: 400 });
    }

    // Guard: must have solved at least 1 word to record progress
    if (wordsCompleted < 1) {
      return NextResponse.json(
        { error: "No words completed — progress not recorded" },
        { status: 400 }
      );
    }

    // Compute completion score: if totalWords was provided use word-based %, otherwise full score.
    // Cap at 100 to handle tough-nut injection making wordsCompleted slightly exceed totalWords.
    const safeTotalWords = Math.max(0, totalWords || 0);
    const safeWordsCompleted = safeTotalWords > 0
      ? Math.min(wordsCompleted, safeTotalWords)
      : wordsCompleted;
    const completionScore = safeTotalWords > 0
      ? Math.min(100, Math.floor((safeWordsCompleted / safeTotalWords) * 100))
      : 100;

    const completionFromWords = safeTotalWords > 0 && safeWordsCompleted >= safeTotalWords;

    // Parse nodeId format "rank-node"
    const [rankStr, nodeStr] = nodeId.split("-");
    const rank = parseInt(rankStr, 10);
    const node = parseInt(nodeStr, 10);

    await connectMongoDB();

    // 1. Find all lists assigned to this node
    const nodeLists = await NodeList.find({ rank, node }).populate("listId");
    if (!nodeLists || nodeLists.length === 0) {
      return NextResponse.json(
        { error: "Node not found" },
        { status: 404 }
      );
    }

    // 2. Get user's journey
    let journey = await Journey.findOne({ userEmail: session.user.email });
    if (!journey) {
      journey = new Journey({
        userEmail: session.user.email,
        xp: 0,
        unlockedNodes: ["1-1"], // Start with first node
        currentNodeId: "1-1",
      });
    }

    if (!Array.isArray(journey.unlockedNodes) || journey.unlockedNodes.length === 0) {
      journey.unlockedNodes = ["1-1"];
    }

    // Guard: only allow progress recording for unlocked nodes
    if (!journey.unlockedNodes.includes(nodeId)) {
      return NextResponse.json(
        { error: "Node not unlocked", nodeId },
        { status: 403 }
      );
    }

    if (!journey.currentNodeId) {
      journey.currentNodeId = journey.unlockedNodes[journey.unlockedNodes.length - 1] || "1-1";
    }

    const existingNodeWordProgress = journey.nodeWordProgress?.get(nodeId) || {
      wordsCompleted: 0,
      totalWords: safeTotalWords,
      percent: 0,
      completed: false,
      lastPracticed: new Date(),
    };

    const mergedTotalWords = Math.max(existingNodeWordProgress.totalWords || 0, safeTotalWords);
    const mergedWordsCompleted = Math.max(
      existingNodeWordProgress.wordsCompleted || 0,
      mergedTotalWords > 0
        ? Math.min(safeWordsCompleted, mergedTotalWords)
        : safeWordsCompleted,
    );
    const mergedPercent = mergedTotalWords > 0
      ? Math.min(100, Math.floor((mergedWordsCompleted / mergedTotalWords) * 100))
      : completionScore;

    journey.nodeWordProgress.set(nodeId, {
      wordsCompleted: mergedWordsCompleted,
      totalWords: mergedTotalWords,
      percent: mergedPercent,
      completed: existingNodeWordProgress.completed || completionFromWords,
      lastPracticed: new Date(),
    });

    // 3. Pick the first node's list and mark as attempted
    // (In Option A, we always practice the first list)
    const selectedNodeList = nodeLists[0];
    const listIdStr = selectedNodeList.listId._id.toString();

    // Update practice history for this list
    const currentHist = journey.practiceHistory.get(listIdStr) || {
      attempts: 0,
      bestScore: 0,
      mastered: false,
      lastPracticed: new Date(),
    };

    currentHist.attempts += 1;
    // bestScore never decreases — if they previously scored higher, keep it.
    // mastered is sticky: once mastered it stays mastered even if they quit early next time.
    currentHist.bestScore = Math.max(currentHist.bestScore || 0, completionScore);
    currentHist.lastScore = completionScore;
    currentHist.mastered = currentHist.mastered || completionFromWords || (safeTotalWords === 0);
    currentHist.lastPracticed = new Date();

    journey.practiceHistory.set(listIdStr, currentHist);

    // 4. Calculate node completion %
    // Node is complete when all its lists are mastered
    let masteredListCount = 0;
    nodeLists.forEach((nl) => {
      const lIdStr = nl.listId._id.toString();
      const hist = journey.practiceHistory.get(lIdStr);
      if (hist?.mastered) {
        masteredListCount += 1;
      }
    });

    const masteredPercent = Math.floor(
      (masteredListCount / nodeLists.length) * 100
    );
    const storedNodeWordProgress = journey.nodeWordProgress.get(nodeId);
    const nodeProgress = Math.max(masteredPercent, storedNodeWordProgress?.percent || 0);
    const nodeCompleted = nodeProgress === 100;

    // 5. If node completed, unlock next node and check rank completion
    let nextNodeId = null;
    let rankCompleted = false;
    let rankBonusXP = 0;
    let rankBonusCoins = 0;
    let arenaCompleted = false;
    let arenaBonusXP = 0;
    let arenaBonusCoins = 0;

    if (nodeCompleted) {
      const nextNodeNumber = node + 1;

      if (nextNodeNumber <= 5) {
        // Same rank, next node
        nextNodeId = `${rank}-${nextNodeNumber}`;
        if (!journey.unlockedNodes) journey.unlockedNodes = [];
        if (!journey.unlockedNodes.includes(nextNodeId)) {
          journey.unlockedNodes.push(nextNodeId);
        }
      } else if (rank < 8) {
        // Completed all 5 nodes in this rank — check if entire rank is done
        // then unlock first node of next rank
        nextNodeId = `${rank + 1}-1`;
        if (!journey.unlockedNodes) journey.unlockedNodes = [];
        if (!journey.unlockedNodes.includes(nextNodeId)) {
          journey.unlockedNodes.push(nextNodeId);
        }

        // Verify all 5 nodes of current rank are completed in practiceHistory
        // by checking if every node (1-5) has at least one mastered list
        const allRankNodeLists = await NodeList.find({ rank }).populate("listId");
        const nodesMastered = new Set();
        for (const nl of allRankNodeLists) {
          const lIdStr = nl.listId?._id?.toString();
          if (lIdStr && journey.practiceHistory.get(lIdStr)?.mastered) {
            nodesMastered.add(nl.node);
          }
        }
        if (nodesMastered.size >= 5) {
          rankCompleted = true;
          rankBonusXP = 500 * rank;       // Rank 1 = 500, Rank 8 = 4000
          rankBonusCoins = 100 * rank;    // Rank 1 = 100, Rank 8 = 800
          arenaCompleted = true;
          arenaBonusXP = rankBonusXP;
          arenaBonusCoins = rankBonusCoins;
        }
      }

      // Move the active cursor to the newly unlocked node, or keep the completed node if final.
      journey.currentNodeId = nextNodeId || nodeId;
      journey.nodeWordProgress.set(nodeId, {
        wordsCompleted: mergedTotalWords || mergedWordsCompleted,
        totalWords: mergedTotalWords,
        percent: 100,
        completed: true,
        lastPracticed: new Date(),
      });
    }

    await journey.save();

    if (syncDebugEnabled) {
      console.log("[JourneySync][server] node-progress.success", {
        userEmail: session.user.email,
        nodeId,
        nodeProgress,
        nodeCompleted,
        nextNodeId,
        arenaCompleted,
        arenaBonusXP,
        arenaBonusCoins,
      });
    }

    return NextResponse.json(
      {
        success: true,
        nodeProgress: {
          percent: nodeProgress,
          completed: nodeCompleted,
        },
        nextNodeId,
        arenaCompleted,
        arenaBonusXP,
        arenaBonusCoins,
        rankCompleted,
        rankBonusXP,
        rankBonusCoins,
        message: rankCompleted
          ? `🏆 Arena ${rank} Complete! +${rankBonusXP} XP bonus!`
          : nodeCompleted
          ? `🎉 Node ${nodeId} Complete! Unlocked ${nextNodeId}`
          : `${nodeProgress}% progress on Node ${nodeId}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Node progress error:", error);
    return NextResponse.json(
      { error: "Failed to update node progress" },
      { status: 500 }
    );
  }
}
