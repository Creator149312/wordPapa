import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "@/lib/mongodb";
import JourneyProgress from "@/models/journeyProgress";
import NodeList from "@/models/nodeList";
import List from "@/models/list";
import User from "@/models/user";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all NodeList assignments
    const allAssignments = await NodeList.find({}).lean();
    console.log("[Debug] Total NodeList assignments:", allAssignments.length);

    // Get all lists
    const allLists = await List.find({}).select("_id title").lean();
    console.log("[Debug] Total lists in database:", allLists.length);

    // Get node assignments by node
    const assignmentsByNode = {};
    for (const assignment of allAssignments) {
      const key = `Rank${assignment.rank}Node${assignment.node}`;
      if (!assignmentsByNode[key]) {
        assignmentsByNode[key] = [];
      }
      assignmentsByNode[key].push({
        listId: assignment.listId.toString(),
        order: assignment.order
      });
    }

    console.log("[Debug] Assignments by node:", Object.keys(assignmentsByNode));

    // Get user's journey progress
    const progressData = await JourneyProgress.findOne({ userId: user._id });
    console.log("[Debug] User has progress document:", !!progressData);

    if (!progressData) {
      return NextResponse.json({
        status: "No progress document",
        assignmentsByNode,
        totalAssignments: allAssignments.length,
        totalLists: allLists.length,
      });
    }

    // Get node progress details
    const nodeProgressDetails = [];
    for (const rank of progressData.progress) {
      for (const node of rank.nodes) {
        const key = `Rank${rank.rankId}Node${node.nodeId}`;
        const assignments = assignmentsByNode[key] || [];
        
        nodeProgressDetails.push({
          rank: rank.rankId,
          node: node.nodeId,
          nodePercent: node.nodePercent,
          listCount: node.lists?.length || 0,
          assignedLists: assignments.length,
          lists: node.lists?.map(l => ({
            listId: l.listId,
            percent: l.percent
          })) || [],
          expectedAssignments: assignments,
        });
      }
    }

    // Filter to show only nodes with progress
    const nodesWithProgress = nodeProgressDetails.filter(n => n.nodePercent > 0 || n.listCount > 0 || n.assignedLists > 0);

    return NextResponse.json({
      totalNodes: nodeProgressDetails.length,
      nodesWithProgress: nodesWithProgress.length,
      details: nodesWithProgress.slice(0, 10), // First 10 nodes with progress
      allNodeProgressSummary: nodeProgressDetails.map(n => ({
        name: `Rank${n.rank} Node${n.node}`,
        nodePercent: n.nodePercent,
        listsTracked: n.listCount,
        listsAssigned: n.assignedLists,
      })),
    });
  } catch (error) {
    console.error("[Debug] Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
