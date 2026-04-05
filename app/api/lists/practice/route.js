import { getServerSession } from "next-auth/next";
import GameProfile from "@models/gameprofile";
import Journey from "@models/journey";
import List from "@models/list";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@lib/mongodb";

// XP calculation based on improvement over previous best score
// First attempt: XP = score percentage (e.g., 80% → 80 XP)
// Improvement: XP = (newBest - oldBest) * 2  (e.g., 60% → 80%: 40 XP)
// No improvement: 0 XP
const calculateImprovementXP = (scorePercentage, previousBestScore) => {
  if (previousBestScore === 0) {
    // First attempt — award XP equal to the score percentage
    return Math.round(scorePercentage);
  }
  if (scorePercentage > previousBestScore) {
    return Math.round((scorePercentage - previousBestScore) * 2);
  }
  return 0;
};

export async function POST(req) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listId, listTitle, questionsCount, correctAnswers, isQuizMode = false } = await req.json();

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

    // Track practice history for mastery and XP calculation
    let journey = await Journey.findOne({ userEmail: session.user.email });
    if (!journey) {
      journey = new Journey({ userEmail: session.user.email, xp: 0 });
    }

    if (!journey.practiceHistory) {
      journey.practiceHistory = new Map();
    }

    const scorePercentage = correctAnswers !== null ? Math.round((correctAnswers / questionsCount) * 100) : 100;
    const currentHistory = journey.practiceHistory.get(listId) || {
      attempts: 0,
      bestScore: 0,
      lastScore: 0,
      mastered: false,
      lastPracticed: new Date(),
    };

    // Calculate XP based on improvement over previous best
    const xpEarned = calculateImprovementXP(scorePercentage, currentHistory.bestScore);

    // Update practice history
    const previousBestScore = currentHistory.bestScore;
    currentHistory.attempts += 1;
    currentHistory.lastScore = scorePercentage;
    currentHistory.bestScore = Math.max(currentHistory.bestScore, scorePercentage);
    currentHistory.lastPracticed = new Date();
    // Mastery: achieved when best score reaches 80% on any attempt.
    currentHistory.mastered = currentHistory.mastered || currentHistory.bestScore >= 80;

    journey.practiceHistory.set(listId, currentHistory);

    // Increment practiceCount on first practice by this user (unique learner count)
    if (currentHistory.attempts === 1) {
      List.findByIdAndUpdate(listId, { $inc: { practiceCount: 1 } }).catch(() => {});
    }
    journey.lastActivityDate = new Date();

    // Update streak logic — compare calendar days (UTC)
    const todayDay = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const lastDay = journey.lastPracticeDay || null;
    if (lastDay === todayDay) {
      // Already practiced today — streak and shields unchanged
    } else if (lastDay) {
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const yesterdayDay = yesterday.toISOString().slice(0, 10);
      if (lastDay === yesterdayDay) {
        // Consecutive day — increment streak
        journey.streak = (journey.streak || 0) + 1;
      } else {
        // Missed at least one day.
        // Check if user has a streak shield to absorb the break.
        // Shields are earned every 7-day milestone (see below) and capped at 2.
        if ((journey.streakShields || 0) > 0) {
          journey.streakShields -= 1; // Consume one shield — streak is preserved
          // Do NOT increment streak; the shield only forgives the missed day
        } else {
          journey.streak = 1; // No shield — streak resets to 1 (today's practice)
        }
      }
    } else {
      journey.streak = 1; // First ever practice
    }
    journey.lastPracticeDay = todayDay;

    // Award a streak shield every time the streak hits a multiple of 7.
    // Only award if the streak just reached that milestone this session
    // (i.e., lastDay !== todayDay so the increment actually happened),
    // and cap at 2 shields so they stay meaningful.
    const currentStreak = journey.streak || 0;
    if (
      lastDay !== todayDay &&           // Streak actually moved this session
      currentStreak > 0 &&
      currentStreak % 7 === 0 &&        // Hit a 7-day milestone
      (journey.streakShields || 0) < 2  // Haven't reached the cap
    ) {
      journey.streakShields = (journey.streakShields || 0) + 1;
    }

    // Only update XP if user improved
    const previousXP = journey.xp || 0;
    if (xpEarned > 0) {
      gameProfile.xp = (gameProfile.xp || 0) + xpEarned;
      await gameProfile.save();

      journey.xp = (journey.xp || 0) + xpEarned;
    }

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
        : xpEarned > 0
          ? `Great job! You earned ${xpEarned} XP!`
          : `Good practice! Beat your best score of ${currentHistory.bestScore}% to earn XP.`,
      correctAnswers: correctAnswers || null, // Return for UI transparency
      streak: journey.streak || 0,
      streakShields: journey.streakShields || 0,
      practiceStats: {
        attempts: currentHistory.attempts,
        bestScore: currentHistory.bestScore,
        lastScore: currentHistory.lastScore,
        mastered: currentHistory.mastered,
      },
    });
  } catch (error) {
    console.error("Error in list practice XP endpoint:", error);
    return Response.json(
      { error: "Failed to award XP" },
      { status: 500 }
    );
  }
}
