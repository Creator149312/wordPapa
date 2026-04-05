import { connectMongoDB } from "@lib/mongodb";
import NodeList from "@models/nodeList";
import List from "@models/list";
import { NextResponse } from "next/server";

/**
 * GET: Fetch lists for a specific journey node
 * Query params: rank, node (required)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rank = searchParams.get("rank");
    const node = searchParams.get("node");

    if (!rank || !node) {
      return NextResponse.json(
        { error: "rank and node parameters are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const assignments = await NodeList.find({
      rank: parseInt(rank, 10),
      node: parseInt(node, 10),
    })
      .populate({
        path: "listId",
        select: "title description words createdBy createdAt",
      })
      .sort({ order: 1 });

    // Transform to return just the lists with word counts
    const lists = assignments.map((assignment) => ({
      assignmentId: assignment._id,
      listId: assignment.listId._id,
      title: assignment.listId.title,
      description: assignment.listId.description,
      wordCount: assignment.listId.words?.length || 0,
      words: assignment.listId.words || [],
      createdBy: assignment.listId.createdBy,
      createdAt: assignment.listId.createdAt,
    }));

    return NextResponse.json({ lists }, { status: 200 });
  } catch (error) {
    console.error("[NodeLists] API Error:", error);
    return NextResponse.json(
      { error: "Error fetching node lists", details: error.message },
      { status: 500 }
    );
  }
}
