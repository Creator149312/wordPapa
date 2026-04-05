import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import NodeList from "@/models/nodeList";
import List from "@/models/list";

/**
 * GET: Check which lists are not assigned to any node
 */
export async function GET(request) {
  try {
    await connectMongoDB();

    // Get all lists
    const allLists = await List.find({}).select("_id title").lean();

    // Get all assigned lists
    const assignedListIds = await NodeList.find({}).select("listId").lean();
    const assignedIdSet = new Set(assignedListIds.map(a => a.listId.toString()));

    // Find unassigned lists
    const unassignedLists = allLists.filter(list => !assignedIdSet.has(list._id.toString()));

    console.log(`[UnassignedLists] Total lists: ${allLists.length}, Assigned: ${assignedListIds.length}, Unassigned: ${unassignedLists.length}`);

    return NextResponse.json({
      total: allLists.length,
      assigned: assignedListIds.length,
      unassigned: unassignedLists.length,
      unassignedLists: unassignedLists.slice(0, 50), // First 50 unassigned lists
    });
  } catch (error) {
    console.error("[UnassignedLists] Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST: Auto-assign unassigned lists to nodes (primarily Rank 1, Node 1 for testing)
 * Body: { rank: 1, node: 1, listIds: [...] } - specific lists to assign
 * OR just POST with no body to auto-assign all unassigned lists to Rank 1 Node 1
 */
export async function POST(request) {
  try {
    await connectMongoDB();

    const body = await request.json().catch(() => ({}));
    const { rank = 1, node = 1, listIds } = body;

    console.log("[AutoAssignLists] Assigning lists to Rank", rank, 'Node', node);

    // Get all lists to assign
    let listsToAssign;
    if (listIds && Array.isArray(listIds) && listIds.length > 0) {
      // Assign specific lists
      listsToAssign = await List.find({ _id: { $in: listIds } }).select("_id title").lean();
      console.log("[AutoAssignLists] Assigning specific", listsToAssign.length, "lists");
    } else {
      // Get unassigned lists
      const allLists = await List.find({}).select("_id title").lean();
      const assignedListIds = await NodeList.find({}).select("listId").lean();
      const assignedIdSet = new Set(assignedListIds.map(a => a.listId.toString()));
      listsToAssign = allLists.filter(list => !assignedIdSet.has(list._id.toString()));
      console.log("[AutoAssignLists] Found", listsToAssign.length, "unassigned lists to assign");
    }

    if (listsToAssign.length === 0) {
      return NextResponse.json({
        message: "No lists to assign",
        assigned: 0,
      });
    }

    // Create assignments
    const assignments = listsToAssign.map((list, index) => ({
      rank,
      node,
      listId: list._id,
      order: index,
    }));

    const created = await NodeList.insertMany(assignments);
    console.log("[AutoAssignLists] Created", created.length, "assignments");

    return NextResponse.json({
      message: `Assigned ${created.length} lists`,
      assigned: created.length,
      rank,
      node,
      success: true,
    });
  } catch (error) {
    console.error("[AutoAssignLists] Error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
