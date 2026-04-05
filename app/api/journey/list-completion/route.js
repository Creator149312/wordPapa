import { connectMongoDB } from "@lib/mongodb";
import User from "@models/user";
import Journey from "@models/journey";
import JourneyProgress from "@models/journeyProgress";
import NodeList from "@models/nodeList";
import List from "@models/list";
import { NextResponse } from "next/server";

/**
 * POST: Record list completion and update node/rank progress
 * Body: { userId, listId, wordsLearned } OR { email, listId, wordsLearned }
 */
export async function POST(request) {
  try {
    const { userId, email, listId, wordsLearned } = await request.json();

    console.log("[ListCompletion] Recording completion:", { userId, email, listId, wordsLearned });

    await connectMongoDB();

    // Find user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch bestScore from Journey practiceHistory (actual practice performance)
    const journey = await Journey.findOne({ userEmail: email || user.email });
    let listProgress = 0;
    
    if (journey && journey.practiceHistory) {
      const practiceStats = journey.practiceHistory.get(listId.toString());
      if (practiceStats) {
        listProgress = practiceStats.bestScore || 0;
        console.log("[ListCompletion] Using bestScore from practice history:", { listId, bestScore: listProgress, attempts: practiceStats.attempts });
      }
    }
    
    // Fallback to word count if no practice history
    if (listProgress === 0) {
      const list = await List.findById(listId);
      if (!list) {
        return NextResponse.json({ error: "List not found" }, { status: 404 });
      }
      const totalWords = list.words?.length || 0;
      const wordsCompletedCount = wordsLearned || totalWords;
      listProgress = Math.round((wordsCompletedCount / totalWords) * 100);
      console.log("[ListCompletion] Using word count fallback:", { totalWords, wordsCompletedCount, listProgress });
    }

    // Find which node this list belongs to
    const nodeListAssignment = await NodeList.findOne({ listId });
    
    if (!nodeListAssignment) {
      console.log("[ListCompletion] List not assigned to any node - will track list progress but not assign to node");
      // Don't return error - we'll still track list progress, just without node assignment yet
      // Return early without node progress calculation
      return NextResponse.json(
        { 
          error: "List not assigned to any node", 
          message: "List completed but cannot calculate node progress - list needs to be assigned to a node",
          listProgress 
        },
        { status: 200 } // Return 200 to indicate partial success
      );
    }

    const { rank, node } = nodeListAssignment;
    console.log("[ListCompletion] Found assignment:", { rank, node });

    // Get or create journey progress
    let journeyProgress = await JourneyProgress.findOne({ userId: user._id });
    if (!journeyProgress) {
      journeyProgress = await JourneyProgress.create({ userId: user._id, progress: [] });
    }

    // Find or create rank progress
    let rankProgress = journeyProgress.progress.find(r => r.rankId === rank);
    if (!rankProgress) {
      rankProgress = { rankId: rank, nodes: [] };
      journeyProgress.progress.push(rankProgress);
    }

    // Find or create node progress
    let nodeProgress = rankProgress.nodes.find(n => n.nodeId === node);
    if (!nodeProgress) {
      nodeProgress = { nodeId: node, lists: [], nodePercent: 0 };
      rankProgress.nodes.push(nodeProgress);
    }

    // Find or create list progress and update it
    let listProgressEntry = nodeProgress.lists.find(l => l.listId === listId.toString());
    if (!listProgressEntry) {
      listProgressEntry = { listId: listId.toString(), percent: 0 };
      nodeProgress.lists.push(listProgressEntry);
    }

    listProgressEntry.percent = Math.max(listProgressEntry.percent, listProgress);

    console.log("[ListCompletion] Updated list progress entry:", {
      listId: listId.toString(),
      percent: listProgressEntry.percent,
    });

    // Ensure all lists assigned to this node are in the progress tracking
    const nodeListsFromDB = await NodeList.find({ rank, node });
    console.log("[ListCompletion] Found", nodeListsFromDB.length, "lists assigned to this node");

    // Initialize missing lists with 0% progress
    for (const assignment of nodeListsFromDB) {
      const assignmentListId = assignment.listId.toString();
      const existingEntry = nodeProgress.lists.find(l => l.listId === assignmentListId);
      
      if (!existingEntry) {
        console.log("[ListCompletion] Initializing list with 0% progress:", assignmentListId);
        nodeProgress.lists.push({
          listId: assignmentListId,
          percent: 0,
        });
      }
    }

    // Calculate node progress as average of tracked lists
    // Priority: Use all assigned lists if they exist, otherwise use currently tracked lists
    let listsToAverage = [];
    
    if (nodeListsFromDB.length > 0) {
      // We have assigned lists - average all assigned lists
      listsToAverage = nodeListsFromDB.map(assignment => assignment.listId.toString());
    } else if (nodeProgress.lists.length > 0) {
      // No assigned lists, but we have tracked lists - average those
      listsToAverage = nodeProgress.lists.map(l => l.listId);
    }

    if (listsToAverage.length > 0) {
      let totalNodeProgress = 0;
      
      for (const listId of listsToAverage) {
        const listEntry = nodeProgress.lists.find(l => l.listId === listId);
        const listProgressValue = listEntry ? listEntry.percent : 0;
        
        console.log("[ListCompletion] Aggregating list progress:", {
          listId,
          percent: listProgressValue,
        });
        
        totalNodeProgress += listProgressValue;
      }
      
      nodeProgress.nodePercent = Math.round(totalNodeProgress / listsToAverage.length);
    }

    console.log("[ListCompletion] Final node progress:", {
      nodeId: node,
      nodePercent: nodeProgress.nodePercent,
      assignedLists: nodeListsFromDB.length,
      trackedLists: nodeProgress.lists.length,
      listsUsedForAverage: listsToAverage.length,
      breakdown: nodeProgress.lists.map(l => ({ listId: l.listId, percent: l.percent })),
    });

    // Save progress
    console.log("[ListCompletion] Saving journey progress to database...");
    const savedProgress = await journeyProgress.save();
    console.log("[ListCompletion] Saved successfully. Document ID:", savedProgress._id);
    
    // Verify it was saved
    const verifyProgress = await JourneyProgress.findById(savedProgress._id);
    console.log("[ListCompletion] Verification - Progress from DB:", {
      userId: verifyProgress.userId,
      ranksCount: verifyProgress.progress?.length || 0,
      firstRank: verifyProgress.progress?.[0],
    });

    return NextResponse.json(
      {
        message: "Progress updated",
        progress: {
          listProgress: listProgressEntry.percent,
          nodeProgress: nodeProgress.nodePercent,
          rank,
          node,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ListCompletion] Error:", error);
    return NextResponse.json(
      { error: "Error recording completion", details: error.message },
      { status: 500 }
    );
  }
}
