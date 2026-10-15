import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";
import Journey from "@/models/journey";
import List from "@/models/list";
import NodeList from "@/models/nodeList";
import User from "@/models/user";

/**
 * Helper to ensure a user's system "Tough Nuts" list exists and add words to it
 */
async function appendToughNuts(userEmail, mistakeWords) {
  if (!mistakeWords || mistakeWords.length === 0) return;

  try {
    let toughNutsList = await List.findOne({
      createdBy: userEmail,
      isToughNuts: true,
    });

    if (!toughNutsList) {
      toughNutsList = await List.create({
        title: "Tough Nuts",
        description: "Words you struggled with — they will return until mastered.",
        createdBy: userEmail,
        words: [],
        tags: ["system", "tough-nuts"],
        isSystemList: true,
        isToughNuts: true,
      });
    }

    const existingWords = new Set(
      (toughNutsList.words || []).map((item) => (item.word || "").toLowerCase())
    );

    const additions = [];
    for (const w of mistakeWords) {
      const normalized = typeof w === "string" ? w.toLowerCase().trim() : w?.word?.toLowerCase().trim();
      if (normalized && !existingWords.has(normalized)) {
        existingWords.add(normalized);
        additions.push({ word: normalized, wordData: typeof w === "object" ? w.hint || "" : "" });
      }
    }

    if (additions.length > 0) {
      await List.updateOne(
        { _id: toughNutsList._id },
        { $push: { words: { $each: additions } } }
      );
    }
  } catch (err) {
    console.warn("[session-complete] Tough nuts append error (non-fatal):", err?.message);
  }
}

/**
 * POST /api/learn/session-complete
 *
 * Universal learning session completion contract.
 * Polymorphic handler for:
 *   - context: "journey" (curriculum node)
 *   - context: "endless" (endless run session)
 *   - context: "daily" (daily challenge)
 *   - context: "list" (vocabulary list practice / quiz)
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      context = "journey",        // "journey" | "endless" | "daily" | "list"
      contextId,                  // e.g., "2-3" for journey, list ObjectId for list
      wordsCompleted = 0,
      totalWords = 0,
      xpGained = 0,
      coinsGained = 0,
      mistakes = [],              // Array of word strings
      durationSeconds = 0,
      // Optional mode-specific fields
      highestEndlessRun = 0,
      highestEndlessXP = 0,
      dailyWord = null,
      dateKey = null,
    } = body;

    const userEmail = session.user.email;
    await connectMongoDB();

    // 1. Ingest Tough Nuts if mistakes occurred
    if (Array.isArray(mistakes) && mistakes.length > 0) {
      await appendToughNuts(userEmail, mistakes);
    }

    // 2. Fetch or create GameProfile
    let profile = await GameProfile.findOne({ userEmail });
    if (!profile) {
      profile = new GameProfile({
        userEmail,
        name: session.user.name || "Player",
        isGhost: false,
        xp: 0,
        journeyXP: 0,
        endlessXP: 0,
        papaPoints: 100,
        totalWordsSolved: 0,
        journey: {
          currentNodeId: "1-1",
          unlockedNodes: ["1-1"],
        },
      });
    }

    // Security caps on single session gains
    const MAX_XP_PER_SESSION = 5000;
    const MAX_COINS_PER_SESSION = 1000;
    const safeXPGain = Math.max(0, Math.min(MAX_XP_PER_SESSION, xpGained || 0));
    const safeCoinsGain = Math.max(0, Math.min(MAX_COINS_PER_SESSION, coinsGained || 0));
    const safeWordsSolved = Math.max(0, wordsCompleted || 0);

    // Apply currency and word count increments
    profile.papaPoints = (profile.papaPoints || 0) + safeCoinsGain;
    profile.totalWordsSolved = (profile.totalWordsSolved || 0) + safeWordsSolved;

    let responsePayload = {
      success: true,
      context,
      xpGained: safeXPGain,
      coinsGained: safeCoinsGain,
      wordsCompleted: safeWordsSolved,
    };

    // 3. Handle Mode-Specific Mechanics
    if (context === "journey") {
      profile.journeyXP = (profile.journeyXP || 0) + safeXPGain;
      profile.xp = (profile.journeyXP || 0) + (profile.endlessXP || 0);

      const nodeId = contextId; // "rank-node", e.g. "2-3"
      if (nodeId && safeWordsSolved > 0) {
        const [rankStr, nodeStr] = nodeId.split("-");
        const rank = parseInt(rankStr, 10);
        const node = parseInt(nodeStr, 10);

        if (rank >= 1 && rank <= 8 && node >= 1 && node <= 5) {
          const safeTotalWords = Math.max(safeWordsSolved, totalWords || safeWordsSolved);
          const percent = Math.min(100, Math.floor((safeWordsSolved / safeTotalWords) * 100));
          const nodeCompleted = percent >= 75 || safeWordsSolved >= safeTotalWords;

          if (!profile.journey) profile.journey = {};
          if (!profile.journey.unlockedNodes) profile.journey.unlockedNodes = ["1-1"];
          if (!profile.journey.nodeWordProgress) profile.journey.nodeWordProgress = new Map();

          profile.journey.nodeWordProgress.set(nodeId, {
            wordsCompleted: safeWordsSolved,
            totalWords: safeTotalWords,
            percent,
            completed: nodeCompleted,
            lastPracticed: new Date(),
          });

          let nextNodeId = null;
          if (nodeCompleted) {
            if (node < 5) {
              nextNodeId = `${rank}-${node + 1}`;
            } else if (rank < 8) {
              nextNodeId = `${rank + 1}-1`;
            }
            if (nextNodeId && !profile.journey.unlockedNodes.includes(nextNodeId)) {
              profile.journey.unlockedNodes.push(nextNodeId);
            }
            profile.journey.currentNodeId = nextNodeId || nodeId;
          }

          responsePayload.nodeProgress = { percent, completed: nodeCompleted };
          responsePayload.nextNodeId = nextNodeId;

          // Increment wordsMastered if node was cleared successfully
          if (nodeCompleted) {
            profile.wordsMastered = (profile.wordsMastered || 0) + safeWordsSolved;
          }
        }
      }
    } else if (context === "endless") {
      profile.endlessXP = (profile.endlessXP || 0) + safeXPGain;
      profile.xp = (profile.journeyXP || 0) + (profile.endlessXP || 0);

      profile.highestEndlessRun = Math.max(
        profile.highestEndlessRun || 0,
        highestEndlessRun || safeWordsSolved
      );
      profile.highestEndlessXP = Math.max(
        profile.highestEndlessXP || 0,
        highestEndlessXP || safeXPGain
      );
    } else if (context === "daily") {
      profile.journeyXP = (profile.journeyXP || 0) + safeXPGain;
      profile.xp = (profile.journeyXP || 0) + (profile.endlessXP || 0);

      if (dateKey) {
        profile.lastDailyDate = dateKey;
        profile.dailyStreak = (profile.dailyStreak || 0) + 1;
      }
    } else if (context === "list") {
      profile.journeyXP = (profile.journeyXP || 0) + safeXPGain;
      profile.xp = (profile.journeyXP || 0) + (profile.endlessXP || 0);

      const listId = contextId;
      if (listId) {
        try {
          await List.findByIdAndUpdate(listId, {
            $inc: { practiceCount: 1 },
          });
        } catch (listErr) {
          console.warn("[session-complete] Incrementing list practice count failed:", listErr?.message);
        }
      }

      // If user practiced words in a list with no or few mistakes, count towards wordsMastered
      if (safeWordsSolved > 0 && (!mistakes || mistakes.length === 0)) {
        profile.wordsMastered = (profile.wordsMastered || 0) + safeWordsSolved;
      }

      // Award a Streak Shield for completing a Tough Nuts review session
      const isToughNutsReview = contextId === "tough-nuts" || body.isToughNutsReview;
      if (isToughNutsReview && safeWordsSolved >= 5) {
        if ((profile.journey.streakShields || 0) < 2) {
          profile.journey.streakShields = (profile.journey.streakShields || 0) + 1;
          responsePayload.shieldAwarded = true;
        }
      }
    }

    // Recalculate global XP
    profile.xp = (profile.journeyXP || 0) + (profile.endlessXP || 0);
    await profile.save();

    // Mirror to User model for auth session sync
    if (profile.xp > 0) {
      try {
        await User.updateOne({ email: userEmail }, { $set: { xp: profile.xp } });
      } catch (userErr) {
        // Non-fatal
      }
    }

    responsePayload.profile = {
      xp: profile.xp,
      papaPoints: profile.papaPoints,
      totalWordsSolved: profile.totalWordsSolved,
      journeyXP: profile.journeyXP,
      endlessXP: profile.endlessXP,
      dailyStreak: profile.dailyStreak,
      streakShields: profile.journey?.streakShields || 0,
      weekendFreeze: profile.weekendFreeze || false,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("Universal session completion error:", error);
    return NextResponse.json(
      { error: "Failed to record session completion" },
      { status: 500 }
    );
  }
}
