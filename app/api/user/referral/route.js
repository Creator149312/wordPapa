import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";

const REFERRAL_REWARD_SHIELDS = 1;
const MAX_SHIELDS_CAP = 2;

/**
 * POST /api/user/referral
 *
 * Awards a Streak Shield when a user successfully refers a friend.
 * In a full implementation, this would be triggered when a referred user
 * signs up using a referral link (e.g., /register?ref=[username]).
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();
    const userEmail = session.user.email;

    const profile = await GameProfile.findOne({ userEmail });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const currentShields = profile.journey?.streakShields || 0;

    if (currentShields >= MAX_SHIELDS_CAP) {
      return NextResponse.json({
        success: false,
        message: "You already have the maximum number of Streak Shields (2).",
        currentShields,
      });
    }

    // Award shield
    if (!profile.journey) profile.journey = {};
    profile.journey.streakShields = Math.min(MAX_SHIELDS_CAP, currentShields + REFERRAL_REWARD_SHIELDS);
    await profile.save();

    return NextResponse.json({
      success: true,
      message: "Referral successful! You earned a Streak Shield.",
      currentShields: profile.journey.streakShields,
    });
  } catch (error) {
    console.error("[/api/user/referral] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
