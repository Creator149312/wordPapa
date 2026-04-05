import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";
import User from "@/models/user";

/**
 * GET: Retrieves the user's profile if it exists.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const profile = await GameProfile.findOne({
      userEmail: session.user.email,
    });

    if (!profile) {
      return NextResponse.json({ success: false, message: "No profile found" });
    }

    // Update name from session if needed
    profile.name = session.user.name || profile.name || "Player";
    await profile.save();

    return NextResponse.json({ success: true, data: profile, profile });
  } catch (error) {
    console.error("GET Sync Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * POST: Updates or Creates the cloud profile.
 *
 * Delta fields (journeyXPDelta, endlessXPDelta) are handled via $inc so that
 * stale localStorage caches can never silently overwrite DB-side progress.
 *
 * After incrementing, xp is recomputed as journeyXP + endlessXP.
 */
export async function POST(req) {
  try {
    const syncDebugEnabled = req.headers.get("x-journey-sync-debug") === "1";
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData = await req.json();
    if (syncDebugEnabled) {
      console.log("[JourneySync][server] hangman.sync.request", {
        userEmail: session.user.email,
        updateData,
      });
    }
    await connectMongoDB();

    const {
      _id,
      __v,
      userEmail,
      createdAt,
      updatedAt,
      isGhost,
      name,
      highestEndlessXP,
      highestEndlessRun,
      highestStreak,
      highestWinStreak,
      // Delta fields — never written as absolute values
      journeyXPDelta,
      endlessXPDelta,
      papaPointsDelta,
      // These are server-managed; ignore client values
      xp: _ignoredXP,
      journeyXP: _ignoredJourneyXP,
      endlessXP: _ignoredEndlessXP,
      papaPoints: _ignoredPapaPoints,
      // Legacy fields — ignore if client still sends them
      weeklyXP: _ignoredWeeklyXP,
      weekKey: _ignoredWeekKey,
      weeklyXPDelta: _ignoredWeeklyDelta,
      ...otherData
    } = updateData;

    // Security caps — prevent tampered deltas from inflating progress
    const MAX_XP_PER_SYNC = 20000;
    const MAX_COIN_DELTA_PER_SYNC = 10000;

    // Build $inc object for delta fields
    const incFields = {};
    if (journeyXPDelta > 0) incFields.journeyXP = Math.min(journeyXPDelta, MAX_XP_PER_SYNC);
    if (endlessXPDelta > 0) incFields.endlessXP = Math.min(endlessXPDelta, MAX_XP_PER_SYNC);
    if (papaPointsDelta !== undefined && papaPointsDelta !== 0) {
      incFields.papaPoints = Math.max(-MAX_COIN_DELTA_PER_SYNC, Math.min(MAX_COIN_DELTA_PER_SYNC, papaPointsDelta));
    }

    // 1. Main profile update — high-score fields protected by $max, deltas by $inc
    const updatedProfile = await GameProfile.findOneAndUpdate(
      { userEmail: session.user.email },
      {
        $set: {
          ...otherData,
          name: session.user.name || name || "Player",
          userEmail: session.user.email,
          isGhost: false,
        },
        $max: {
          highestEndlessXP: highestEndlessXP || 0,
          highestEndlessRun: highestEndlessRun || 0,
          highestStreak: highestStreak || 0,
          highestWinStreak: highestWinStreak || 0,
        },
        ...(Object.keys(incFields).length > 0 && { $inc: incFields }),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    // 2. Recompute xp = journeyXP + endlessXP (the canonical Global XP)
    if (updatedProfile) {
      const computedXP = (updatedProfile.journeyXP || 0) + (updatedProfile.endlessXP || 0);
      let needsSave = false;
      if (updatedProfile.xp !== computedXP) {
        updatedProfile.xp = computedXP;
        needsSave = true;
      }
      // Floor papaPoints at 0 — $inc with negative delta could dip below zero
      if (updatedProfile.papaPoints < 0) {
        updatedProfile.papaPoints = 0;
        needsSave = true;
      }
      if (needsSave) await updatedProfile.save();
    }

    // 3. Mirror global XP to User model for session/auth uses
    if (updatedProfile && updatedProfile.xp > 0) {
      const user = await User.findOne({ email: session.user.email });
      if (user && updatedProfile.xp > (user.xp || 0)) {
        user.xp = updatedProfile.xp;
        await user.save();
      }
    }

    if (syncDebugEnabled) {
      console.log("[JourneySync][server] hangman.sync.success", {
        userEmail: session.user.email,
        journeyXP: updatedProfile?.journeyXP || 0,
        endlessXP: updatedProfile?.endlessXP || 0,
        xp: updatedProfile?.xp || 0,
        papaPoints: updatedProfile?.papaPoints || 0,
        totalWordsSolved: updatedProfile?.totalWordsSolved || 0,
      });
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("POST Sync Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync profile" },
      { status: 500 },
    );
  }
}
