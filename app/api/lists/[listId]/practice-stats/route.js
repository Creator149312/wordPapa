import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@lib/mongodb";
import Journey from "@models/journey";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listId } = params;

    if (!listId) {
      return Response.json({ error: "List ID required" }, { status: 400 });
    }

    const journey = await Journey.findOne({ userEmail: session.user.email });

    if (!journey) {
      return Response.json({ practiceStats: null });
    }

    const practiceStats = journey.practiceHistory?.get(listId) || null;

    return Response.json({
      practiceStats,
      lastPracticed: practiceStats?.lastPracticed || null,
    });
  } catch (error) {
    console.error("Error fetching practice stats:", error);
    return Response.json(
      { error: "Failed to fetch practice stats" },
      { status: 500 }
    );
  }
}