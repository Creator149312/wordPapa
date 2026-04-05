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

    const { guestData } = await request.json();
    if (!guestData) {
      return NextResponse.json({ error: "No guest data provided" }, { status: 400 });
    }

    await connectMongoDB();

    // Check if user already has a journey
    let journey = await Journey.findOne({ userEmail: session.user.email });

    if (journey) {
      // Merge guest progress with existing journey
      if (guestData.currentNode > journey.currentNode) {
        journey.currentNode = guestData.currentNode;
        journey.characterStage = guestData.characterStage;
      }

      // Merge completed missions (avoid duplicates)
      const existingMissionIds = new Set(journey.missionsCompleted.map(m => m.nodeId));
      const newMissions = guestData.missionsCompleted.filter(m => !existingMissionIds.has(m.nodeId));
      journey.missionsCompleted.push(...newMissions);

      // Update totals
      journey.totalMissionsCompleted = Math.max(journey.totalMissionsCompleted, guestData.totalMissionsCompleted);

      // Update XP and rank if guest has higher XP
      journey.xp = Math.max(journey.xp || 0, guestData.xp || 0);
      const rank = getRankFromXP(journey.xp);
      journey.rankLevel = rank.level;
      journey.rankName = rank.name;
      journey.rankArenaId = rank.arenaId;
      journey.rankColor = rank.color;
      journey.rankStageName = rank.stageName;

      // Update active mission if guest has progressed further
      if (guestData.currentNode > journey.currentNode) {
        journey.activeMission = guestData.activeMission;
      }

      journey.lastActivityDate = new Date();
    } else {
      // Create new journey from guest data
      const rank = getRankFromXP(guestData.xp || 0);

      journey = new Journey({
        userEmail: session.user.email,
        currentNode: guestData.currentNode,
        characterStage: guestData.characterStage,
        xp: guestData.xp || 0,
        rankLevel: rank.level,
        rankName: rank.name,
        rankArenaId: rank.arenaId,
        rankColor: rank.color,
        rankStageName: rank.stageName,
        missionsCompleted: guestData.missionsCompleted,
        activeMission: guestData.activeMission,
        totalMissionsCompleted: guestData.totalMissionsCompleted,
        journeyStartDate: new Date(guestData.journeyStartDate),
        lastActivityDate: new Date(),
        unlockedFeatures: guestData.unlockedFeatures || []
      });
    }

    await journey.save();

    // Update global XP in GameProfile (centralized) with the journey XP
    const gameProfile = await GameProfile.findOne({ userEmail: session.user.email });
    if (gameProfile) {
      // Sync journey XP to GameProfile if higher
      if ((journey.xp || 0) > (gameProfile.xp || 0)) {
        gameProfile.xp = journey.xp || 0;
        await gameProfile.save();
      }
    }

    // Clear guest data from localStorage (this will be done on the client side)

    return NextResponse.json({
      success: true,
      message: "Progress synced successfully",
      journey: {
        currentNode: journey.currentNode,
        characterStage: journey.characterStage,
        xp: journey.xp,
        rankLevel: journey.rankLevel,
        rankName: journey.rankName,
        rankArenaId: journey.rankArenaId,
        rankColor: journey.rankColor,
        rankStageName: journey.rankStageName,
        missionsCompleted: journey.missionsCompleted,
        activeMission: journey.activeMission,
        totalMissionsCompleted: journey.totalMissionsCompleted,
        journeyStartDate: journey.journeyStartDate,
        lastActivityDate: journey.lastActivityDate,
        unlockedFeatures: journey.unlockedFeatures
      }
    });

  } catch (error) {
    console.error("Error syncing guest progress:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getRankFromXP(xp) {
  const currentXP = Math.max(0, xp || 0);
  const sortedRanks = [...RANKS].sort((a, b) => b.minXP - a.minXP);
  return sortedRanks.find((rank) => currentXP >= rank.minXP) || RANKS[0];
}