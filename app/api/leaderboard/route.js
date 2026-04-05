import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";
import { calculateLevel } from "../../games/hangman/lib/progression";

/**
 * Leaderboard — 3 tabs:
 *
 *  global   — Sorted by xp (= journeyXP + endlessXP, computed server-side).
 *  endless  — Sorted by highestEndlessXP (best single run).
 *  journey  — Sorted by journeyXP (cumulative Journey mode XP).
 */
export async function GET(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "global";

    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email || null;

    let leaderboard = [];
    const selectFields = "name xp endlessXP highestEndlessXP journeyXP totalWordsSolved userEmail";
    const getCurrentRank = (xp = 0) => {
      const rank = calculateLevel(xp || 0);
      return {
        rankName: rank.name || "Infant",
        rankLevel: rank.level || 1,
        rankColor: rank.color || "#75c32c",
      };
    };

    if (tab === "global") {
      leaderboard = await GameProfile.find({
        isGhost: false,
        xp: { $gt: 0 },
      })
        .sort({ xp: -1, totalWordsSolved: -1 })
        .limit(50)
        .select(selectFields)
        .lean();
    } else if (tab === "endless") {
      leaderboard = await GameProfile.find({
        isGhost: false,
        highestEndlessXP: { $gt: 0 },
      })
        .sort({ highestEndlessXP: -1, totalWordsSolved: -1 })
        .limit(50)
        .select(selectFields)
        .lean();
    } else if (tab === "journey") {
      leaderboard = await GameProfile.find({
        isGhost: false,
        journeyXP: { $gt: 0 },
      })
        .sort({ journeyXP: -1, totalWordsSolved: -1 })
        .limit(50)
        .select(selectFields)
        .lean();
    }

    // Current user outside top 50
    const currentUserInTop50 = currentUserEmail
      ? leaderboard.some((p) => p.userEmail === currentUserEmail)
      : false;

    let currentUserEntry = null;

    if (currentUserEmail && !currentUserInTop50) {
      const userProfile = await GameProfile.findOne({ userEmail: currentUserEmail })
        .select(selectFields)
        .lean();

      if (userProfile) {
        let rank;
        if (tab === "global") {
          rank =
            (await GameProfile.countDocuments({
              isGhost: false,
              xp: { $gt: userProfile.xp || 0 },
            })) + 1;
        } else if (tab === "endless") {
          rank =
            (await GameProfile.countDocuments({
              isGhost: false,
              highestEndlessXP: { $gt: userProfile.highestEndlessXP || 0 },
            })) + 1;
        } else if (tab === "journey") {
          rank =
            (await GameProfile.countDocuments({
              isGhost: false,
              journeyXP: { $gt: userProfile.journeyXP || 0 },
            })) + 1;
        }

        currentUserEntry = {
          name: userProfile.name || "You",
          rank,
          xp: userProfile.xp || 0,
          endlessXP: userProfile.endlessXP || 0,
          highestEndlessXP: userProfile.highestEndlessXP || 0,
          journeyXP: userProfile.journeyXP || 0,
          totalWordsSolved: userProfile.totalWordsSolved || 0,
          isCurrentUser: true,
          currentRank: getCurrentRank(userProfile.xp || 0),
        };
      }
    }

    const formattedLeaderboard = leaderboard.map((entry, index) => {
      const isCurrentUser = entry.userEmail === currentUserEmail;
      return {
        name: entry.name || "Anonymous Player",
        rank: index + 1,
        xp: entry.xp || 0,
        endlessXP: entry.endlessXP || 0,
        highestEndlessXP: entry.highestEndlessXP || 0,
        journeyXP: entry.journeyXP || 0,
        totalWordsSolved: entry.totalWordsSolved || 0,
        isCurrentUser,
        currentRank: getCurrentRank(entry.xp || 0),
      };
    });

    return NextResponse.json({
      success: true,
      tab,
      leaderboard: formattedLeaderboard,
      currentUserEntry,
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}