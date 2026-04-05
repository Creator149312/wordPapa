import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import Journey from "@/models/journey";
import GameProfile from "@/models/gameprofile";
import { RANKS } from "@/app/games/hangman/constants";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { missionId } = await request.json();
    await connectMongoDB();

    const journey = await Journey.findOne({ userEmail: session.user.email });

    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    // Check if mission can be completed
    if (!journey.activeMission || journey.activeMission.nodeId !== missionId) {
      return NextResponse.json({ error: "Invalid mission" }, { status: 400 });
    }

    if (!journey.isMissionComplete()) {
      return NextResponse.json({ error: "Mission requirements not met" }, { status: 400 });
    }

    // Complete the mission
    const xpEarned = calculateXP(journey.activeMission);
    const completedMission = {
      nodeId: journey.activeMission.nodeId,
      missionType: journey.activeMission.missionType,
      completedAt: new Date(),
      xpEarned,
    };

    // Update global XP in GameProfile (centralized)
    const gameProfile = await GameProfile.findOne({ userEmail: session.user.email });
    if (gameProfile) {
      gameProfile.xp = (gameProfile.xp || 0) + xpEarned;
      await gameProfile.save();
    }

    journey.missionsCompleted.push(completedMission);
    journey.currentNode = Math.min(journey.currentNode + 1, 10);
    journey.totalMissionsCompleted += 1;
    journey.xp = (journey.xp || 0) + xpEarned;

    const updatedRank = getRankFromXP(journey.xp);
    journey.rankLevel = updatedRank.level;
    journey.rankName = updatedRank.name;
    journey.rankArenaId = updatedRank.arenaId;
    journey.rankColor = updatedRank.color;
    journey.rankStageName = updatedRank.stageName;

    journey.characterStage = journey.getCharacterStage();
    journey.lastActivityDate = new Date();

    // Clear active mission and start next one if available
    if (journey.currentNode < 10) {
      const nextNode = journey.currentNode + 1;
      const missionRequirements = getMissionRequirements(nextNode);

      journey.activeMission = {
        nodeId: nextNode,
        missionType: "learning",
        requirements: missionRequirements,
        progress: { labActions: 0, synonymsLearned: 0, arenaWins: 0, toolsUsed: [] },
        startedAt: new Date()
      };
    } else {
      journey.activeMission = null;
    }

    // Unlock features based on progress
    journey.unlockedFeatures = getUnlockedFeatures(journey.currentNode);

    await journey.save();

    return NextResponse.json({
      success: true,
      newNode: journey.currentNode,
      characterStage: journey.characterStage,
      xp: journey.xp,
      rankLevel: journey.rankLevel,
      rankName: journey.rankName,
      rankArenaId: journey.rankArenaId,
      rankStageName: journey.rankStageName,
      xpEarned,
      unlockedFeatures: journey.unlockedFeatures
    });

  } catch (error) {
    console.error("Error completing mission:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function calculateXP(mission) {
  const baseXP = 100;
  const labBonus = mission.progress.labActions * 10;
  const synonymBonus = mission.progress.synonymsLearned * 15;
  const arenaBonus = mission.progress.arenaWins * 25;
  const toolBonus = mission.progress.toolsUsed.length * 20;

  return baseXP + labBonus + synonymBonus + arenaBonus + toolBonus;
}

function getMissionRequirements(nodeId) {
  const requirements = {
    1: { labActions: 5, synonymsLearned: 3, arenaWins: 0, toolsUsed: ["dictionary", "thesaurus"] },
    2: { labActions: 8, synonymsLearned: 5, arenaWins: 1, toolsUsed: ["adjectives", "rhyming"] },
    3: { labActions: 10, synonymsLearned: 7, arenaWins: 2, toolsUsed: ["nouns", "syllables"] },
    4: { labActions: 12, synonymsLearned: 8, arenaWins: 3, toolsUsed: ["word-finder", "sentences"] },
    5: { labActions: 15, synonymsLearned: 10, arenaWins: 5, toolsUsed: ["dictionary", "thesaurus", "arena"] },
    6: { labActions: 18, synonymsLearned: 12, arenaWins: 7, toolsUsed: ["dictionary", "thesaurus", "arena", "phrasal-verbs"] },
    7: { labActions: 20, synonymsLearned: 15, arenaWins: 8, toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"] },
    8: { labActions: 22, synonymsLearned: 18, arenaWins: 10, toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"] },
    9: { labActions: 25, synonymsLearned: 20, arenaWins: 12, toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"] },
    10: { labActions: 30, synonymsLearned: 25, arenaWins: 15, toolsUsed: ["dictionary", "thesaurus", "arena", "all-tools"] }
  };

  return requirements[nodeId] || requirements[1];
}

function getUnlockedFeatures(node) {
  const features = [];

  if (node >= 2) features.push("advanced-dictionary");
  if (node >= 3) features.push("custom-lists");
  if (node >= 4) features.push("progress-tracking");
  if (node >= 5) features.push("arena-multiplayer");
  if (node >= 6) features.push("advanced-games");
  if (node >= 7) features.push("word-analytics");
  if (node >= 8) features.push("premium-themes");
  if (node >= 9) features.push("mentor-mode");
  if (node >= 10) features.push("wordpapa-master");

  return features;
}

function getRankFromXP(xp) {
  const currentXP = Math.max(0, xp || 0);
  const sortedRanks = [...RANKS].sort((a, b) => b.minXP - a.minXP);
  return sortedRanks.find((rank) => currentXP >= rank.minXP) || RANKS[0];
}