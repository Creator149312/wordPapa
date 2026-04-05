import { connectMongoDB } from "@lib/mongodb";
import NodeList from "@models/nodeList";
import List from "@models/list";
import { NextResponse } from "next/server";

/**
 * GET: Fetch lists for a specific node (or all)
 * Query params: rank, node (optional - if not provided, returns all assignments)
 */
export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const rank = searchParams.get("rank");
    const node = searchParams.get("node");

    console.log("[NodeList GET] Query params:", { rank, node });

    let query = {};
    if (rank) query.rank = parseInt(rank, 10);
    if (node) query.node = parseInt(node, 10);

    const assignments = await NodeList.find(query)
      .populate("listId", "title description words createdBy createdAt")
      .sort({ rank: 1, node: 1, order: 1 });

    console.log("[NodeList GET] Found assignments:", assignments.length);

    return NextResponse.json({ assignments }, { status: 200 });
  } catch (error) {
    console.error("[NodeList GET] Error:", error);
    return NextResponse.json(
      { error: "Error fetching assignments" },
      { status: 500 }
    );
  }
}

/**
 * POST: Create new node-list assignment
 */
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("[NodeList POST] Request body:", body);
    
    const { rank, node, listId } = body;

    // Validate inputs
    if (!rank || !node || !listId) {
      console.log("[NodeList POST] Missing required fields:", { rank, node, listId });
      return NextResponse.json(
        { error: "rank, node, and listId are required" },
        { status: 400 }
      );
    }

    if (rank < 1 || rank > 8 || node < 1 || node > 5) {
      console.log("[NodeList POST] Invalid rank/node values:", { rank, node });
      return NextResponse.json(
        { error: "rank must be 1-8, node must be 1-5" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if list exists
    const list = await List.findById(listId);
    if (!list) {
      console.log("[NodeList POST] List not found with ID:", listId);
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    console.log("[NodeList POST] List found:", list.title);

    // Create assignment
    const assignment = await NodeList.create({
      rank,
      node,
      listId,
      order: 0,
    });

    console.log("[NodeList POST] Assignment created:", assignment._id);

    return NextResponse.json(
      { message: "Assignment created", assignment },
      { status: 201 }
    );
  } catch (error) {
    console.error("[NodeList POST] Error:", error);
    if (error.code === 11000) {
      // Duplicate key error
      return NextResponse.json(
        { error: "This list is already assigned to this node" },
        { status: 409 }
      );
    }
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Error creating assignment" },
      { status: 500 }
    );
  }
}

/**
 * PUT: Update assignment (e.g., change order)
 */
export async function PUT(request) {
  try {
    const { assignmentId, order } = await request.json();

    if (!assignmentId) {
      return NextResponse.json(
        { error: "assignmentId is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const updated = await NodeList.findByIdAndUpdate(
      assignmentId,
      { order: order || 0 },
      { new: true }
    ).populate("listId", "title description");

    if (!updated) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Assignment updated", assignment: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Error updating assignment" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove node-list assignment
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get("assignmentId");

    console.log("[NodeList DELETE] Request to delete:", assignmentId);

    if (!assignmentId) {
      return NextResponse.json(
        { error: "assignmentId is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const deleted = await NodeList.findByIdAndDelete(assignmentId);

    if (!deleted) {
      console.log("[NodeList DELETE] Assignment not found:", assignmentId);
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    console.log("[NodeList DELETE] Assignment deleted successfully");

    return NextResponse.json(
      { message: "Assignment deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[NodeList DELETE] Error:", error);
    return NextResponse.json(
      { error: "Error deleting assignment" },
      { status: 500 }
    );
  }
}
