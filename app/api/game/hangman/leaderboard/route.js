import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@lib/mongodb";
import GameProfile from "@/models/gameprofile";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await connectMongoDB();

    // 1. Fetch Top 10
    const topRuns = await GameProfile.find({ highestEndlessRun: { $gt: 0 } })
      .sort({ highestEndlessRun: -1 })
      .limit(10)
      .select("name highestEndlessRun xp -_id");

    let userStats = null;

    // 2. If user is logged in, find their relative rank
    if (session?.user?.email) {
      const userProfile = await GameProfile.findOne({ userEmail: session.user.email });
      
      if (userProfile && userProfile.highestEndlessRun > 0) {
        // Count how many people have a higher score than this user
        const rank = await GameProfile.countDocuments({
          highestEndlessRun: { $gt: userProfile.highestEndlessRun }
        });

        userStats = {
          name: userProfile.name || "You",
          highestEndlessRun: userProfile.highestEndlessRun,
          rank: rank + 1, // +1 because if 0 people are higher, you are #1
          isTop10: (rank + 1) <= 10
        };
      }
    }

    return NextResponse.json({ 
      success: true, 
      leaderboard: topRuns,
      userStats 
    });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}