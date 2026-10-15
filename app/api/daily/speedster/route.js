import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";

const SPEEDSTER_THRESHOLD_MS = 10000; // 10 seconds
const MAX_SPEEDSTERS_PER_DAY = 100;

/**
 * POST /api/daily/speedster
 *
 * Verifies and awards the "Speedster" badge for today's Daily Word challenge.
 * Users must solve the final 5th word in under 10 seconds,
 * and be among the first 100 players globally to do so.
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { solveTimeMs, dateKey } = await request.json();

    if (typeof solveTimeMs !== "number" || solveTimeMs > SPEEDSTER_THRESHOLD_MS) {
      return NextResponse.json({
        success: false,
        isSpeedster: false,
        reason: "Time exceeds 10-second threshold.",
      });
    }

    await connectMongoDB();
    const userEmail = session.user.email;

    // Use an atomic query to increment the counter if it's under the cap.
    // We store the daily speedster counter in a shared system collection or a meta document.
    // For simplicity, we can use a dedicated settings/meta model, or query GameProfile for count.
    // To make this atomic and safe without a separate counter collection:
    // We'll use a simple counter stored in a "SystemMeta" document, but since we don't have one,
    // we'll query GameProfile to count how many users got the badge today.
    // A robust approach: Use a dedicated `dailyCounters` collection.

    // Let's do a simple check and update:
    const profile = await GameProfile.findOne({ userEmail });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Prevent double claiming today
    if (profile.lastDailyDate === dateKey && profile.hasSpeedsterBadge) {
      return NextResponse.json({
        success: true,
        isSpeedster: true,
        alreadyClaimed: true,
      });
    }

    // For production scale, use an atomic increment on a singleton DailyCounter document.
    // We will simulate this by checking the total number of users with the badge today.
    // In a real app, you would create a DailyCounter model. Let's create a quick inline counter approach.
    const db = profile.db;
    const DailyCounter = db.model(
      "DailyCounter",
      new db.Schema({
        dateKey: { type: String, unique: true },
        count: { type: Number, default: 0 },
      }),
      "dailycounters"
    );

    // Atomically increment if under cap
    const counter = await DailyCounter.findOneAndUpdate(
      { dateKey, count: { $lt: MAX_SPEEDSTERS_PER_DAY } },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    if (!counter) {
      return NextResponse.json({
        success: false,
        isSpeedster: false,
        reason: "Daily speedster cap reached (100 players).",
      });
    }

    // Award badge to user
    profile.hasSpeedsterBadge = true;
    profile.speedsterBadgesCount = (profile.speedsterBadgesCount || 0) + 1;
    await profile.save();

    return NextResponse.json({
      success: true,
      isSpeedster: true,
      rank: counter.count, // Their speedster rank for the day (e.g., #42)
    });
  } catch (error) {
    console.error("[/api/daily/speedster] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
