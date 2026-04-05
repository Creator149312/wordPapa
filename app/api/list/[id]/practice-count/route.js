import { connectMongoDB } from "@lib/mongodb";
import Journey from "@models/journey";
import { NextResponse } from "next/server";

/**
 * GET /api/list/[id]/practice-count
 * Returns the number of unique learners who have practiced this list
 * 
 * Response: { count: number }
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "List ID is required", count: 0 },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Count Journey documents where practiceHistory Map contains this listId
    const count = await Journey.countDocuments({
      "practiceHistory.sub": { $exists: true }, // Ensure practiceHistory is not empty
      [`practiceHistory.${id}`]: { $exists: true } // Check if this specific listId exists in the map
    });

    return NextResponse.json(
      { count: Math.max(0, count) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching practice count:", error);
    
    // Return 0 on error instead of failing the request
    return NextResponse.json(
      { count: 0, error: error.message },
      { status: 200 } // Still return 200 so UI doesn't break
    );
  }
}
