import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";

export async function GET() {
  try {
    await connectMongoDB();

    // 1. GLOBAL LEADERBOARD: Career Progression
    // Ranks players by total lifetime XP.
    // Secondary sort by totalWordsSolved to reward the most active players in case of a tie.
    const globalLeaderboard = await GameProfile.find({ isGhost: false })
      .sort({ xp: -1, totalWordsSolved: -1 })
      .limit(10)
      .select("name xp totalWordsSolved")
      .lean();

    // 2. ENDLESS LEADERBOARD: The "Hall of Fame"
    // Ranks players by their single highest XP session (highestEndlessXP).
    // Secondary sort by highestEndlessRun (longest word streak).
    const endlessLeaderboard = await GameProfile.find({
      isGhost: false,
      highestEndlessXP: { $gt: 0 },
    })
      .sort({ highestEndlessXP: -1, highestEndlessRun: -1 })
      .limit(10)
      .select("name highestEndlessXP highestEndlessRun")
      .lean();

    // Helper to ensure everyone has a name on the board
    const formatEntry = (entry) => ({
      ...entry,
      name: entry.name || "Anonymous Player",
    });

    return NextResponse.json({
      success: true,
      global: globalLeaderboard.map(formatEntry),
      endless: endlessLeaderboard.map(formatEntry),
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboards" },
      { status: 500 },
    );
  }
}
