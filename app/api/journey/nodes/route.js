import { connectMongoDB } from "@lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import NodeList from "@models/nodeList";
import Journey from "@models/journey";
import List from "@models/list";
import { NextResponse } from "next/server";

/**
 * GET /api/journey/nodes?rank=2
 * Returns all nodes for a given rank with unlock status and progress
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const rank = parseInt(searchParams.get("rank"), 10);

    if (!rank || rank < 1 || rank > 8) {
      return NextResponse.json(
        { error: "Invalid rank parameter (1-8)" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Get all NodeLists for this rank
    const nodeLists = await NodeList.find({ rank })
      .sort({ node: 1 })
      .populate("listId");

    if (!nodeLists || nodeLists.length === 0) {
      return NextResponse.json(
        { success: true, nodes: [] },
        { status: 200 }
      );
    }

    // Group by node
    const nodeMap = {};
    nodeLists.forEach((nl) => {
      if (!nodeMap[nl.node]) {
        nodeMap[nl.node] = [];
      }
      nodeMap[nl.node].push(nl);
    });

    // If user is logged in, get their progress
    let userJourney = null;
    let currentNodeId = null;
    let unlockedNodes = ["1-1"];
    if (session?.user?.email) {
      userJourney = await Journey.findOne({
        userEmail: session.user.email,
      });
      unlockedNodes = userJourney?.unlockedNodes?.length ? userJourney.unlockedNodes : ["1-1"];
      currentNodeId = userJourney?.currentNodeId || unlockedNodes[unlockedNodes.length - 1] || "1-1";
    }

    // Format response
    const nodes = Object.entries(nodeMap)
      .sort(([a], [b]) => a - b)
      .map(([nodeNum, nodeLists]) => {
        const nodeId = `${rank}-${nodeNum}`; // e.g., "2-3"
        const isCurrent = currentNodeId === nodeId;
        // A node is "completed" only if it has been mastered (all its lists mastered).
        // "Unlocked" just means the user can practice it, not that they've finished it.
        let masteredCount = 0;
        let totalCount = nodeLists.length;
        if (userJourney?.practiceHistory) {
          nodeLists.forEach((nl) => {
            const listIdStr = nl.listId._id.toString();
            const hist = userJourney.practiceHistory.get(listIdStr);
            if (hist?.mastered) masteredCount += 1;
          });
        }
        const isFullyMastered = totalCount > 0 && masteredCount >= totalCount;
        const isUnlocked = unlockedNodes.includes(nodeId) || nodeId === "1-1";
        const isCompleted = isUnlocked && !isCurrent && isFullyMastered;
        const storedNodeProgress = userJourney?.nodeWordProgress?.get(nodeId);
        const masteryProgress = Math.floor((masteredCount / (totalCount || 1)) * 100);
        const progress = isCompleted
          ? 100
          : Math.max(storedNodeProgress?.percent || 0, masteryProgress);

        return {
          nodeId,
          rankId: rank,
          node: parseInt(nodeNum),
          title: nodeLists[0]?.listId?.title || `Node ${nodeNum}`,
          isUnlocked,
          isCurrent,
          isCompleted,
          progress,
          listCount: totalCount,
          listTitles: nodeLists
            .map((item) => item.listId?.title)
            .filter(Boolean)
            .slice(0, 5),
        };
      });

    return NextResponse.json(
      { success: true, nodes, currentNodeId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch nodes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch nodes" },
      { status: 500 }
    );
  }
}
