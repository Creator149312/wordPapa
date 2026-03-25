import { getServerSession } from "next-auth/next";
import GameProfile from "@models/gameprofile";
import Journey from "@models/journey";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import dbConnect from "@lib/mongodb";

// XP calculation for list practice
const calculateListPracticeXP = (questionsCount, isQuizMode = false) => {
  const baseXP = 50; // Base XP per practice session
  const bonus = Math.floor(questionsCount * 2); // 2 XP per question
  const modeBonus = isQuizMode ? 25 : 0; // Quiz mode bonus
  return baseXP + bonus + modeBonus;
};

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listId, listTitle, questionsCount, isQuizMode = false } = await req.json();

    if (!listId || questionsCount <= 0) {
      return Response.json(
        { error: "Invalid listId or questionsCount" },
        { status: 400 }
      );
    }

    const gameProfile = await GameProfile.findOne({ userEmail: session.user.email });
    if (!gameProfile) {
      return Response.json({ error: "Game profile not found" }, { status: 404 });
    }

    // Calculate XP earned
    const xpEarned = calculateListPracticeXP(questionsCount, isQuizMode);

    // Update global XP in GameProfile (centralized)
    gameProfile.xp = (gameProfile.xp || 0) + xpEarned;
    await gameProfile.save();

    // Update or create journey
    let journey = await Journey.findOne({ userEmail: session.user.email });
    if (!journey) {
      journey = new Journey({
        userEmail: session.user.email,
        xp: 0,
      });
    }

    const previousXP = journey.xp || 0;
    journey.xp = (journey.xp || 0) + xpEarned;

    // Calculate rank before and after
    const RANKS = require("@app/games/hangman/constants").RANKS;
    const getRankFromXP = (xp) => {
      const currentXP = Math.max(0, xp || 0);
      const sortedRanks = [...RANKS].sort((a, b) => b.minXP - a.minXP);
      return sortedRanks.find((rank) => currentXP >= rank.minXP) || RANKS[0];
    };

    const previousRank = getRankFromXP(previousXP);
    const newRank = getRankFromXP(journey.xp);

    // Update rank fields
    journey.rankLevel = newRank.level;
    journey.rankName = newRank.name;
    journey.rankArenaId = newRank.arenaId || null;
    journey.rankColor = newRank.color || "#75c32c";
    journey.rankStageName = newRank.stageName || "Learner";

    await journey.save();

    // Check if user ranked up
    const rankedUp = previousRank.level !== newRank.level;

    return Response.json({
      success: true,
      xpEarned,
      totalXP: journey.xp,
      globalXP: gameProfile.xp,
      previousRank: {
        level: previousRank.level,
        name: previousRank.name,
        color: previousRank.color,
      },
      newRank: {
        level: newRank.level,
        name: newRank.name,
        color: newRank.color,
        stageName: newRank.stageName,
      },
      rankedUp,
      message: rankedUp
        ? `Congratulations! You've reached ${newRank.name}!`
        : `Great job! You earned ${xpEarned} XP!`,
    });
  } catch (error) {
    console.error("Error in list practice XP endpoint:", error);
    return Response.json(
      { error: "Failed to award XP" },
      { status: 500 }
    );
  }
}
