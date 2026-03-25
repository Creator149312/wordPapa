import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";

/**
 * GET: Retrieves the user's profile if it exists.
 * We REMOVED the "upsert" here so the client can detect if this is a first-time login.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    // Look for the profile without creating one automatically
    const profile = await GameProfile.findOne({
      userEmail: session.user.email,
    });

    if (!profile) {
      // Return success: false so the client knows to push the LocalStorage (Ghost) data
      return NextResponse.json({ success: false, message: "No profile found" });
    }

    // If found, ensure the name is updated from the latest session
    profile.name = session.user.name || profile.name || "Player";
    await profile.save();

    // Get the global user XP
    catch (error) {
    console.error("GET Sync Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * POST: Updates or Creates the cloud profile.
 * Handles the initial migration from Ghost -> Real User.
 */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData = await req.json();
    await connectMongoDB();

    // 1. Destructure to protect high-score integrity and prevent meta-data overwrites
    const {
      _id,
      __v,
      userEmail,
      createdAt,
      updatedAt,
      isGhost,
      name,
      xp,
      highestEndlessXP,
      highestEndlessRun,
      highestStreak,
      highestWinStreak,
      ...otherData
    } = updateData;

    // 2. The Migration & Sync Update:
    // $set: Updates dynamic values (coins, current theme, etc.)
    // $max: Ensures records/XP never go backwards during syncs
    const updatedProfile = await GameProfile.findOneAndUpdate(
      { userEmail: session.user.email },
      {
        $set: {
          ...otherData,
          name: session.user.name || name || "Player",
          userEmail: session.user.email,
          isGhost: false, // Permanently convert to a real user
        },
        $max: {
          xp: xp || 0,
          highestEndlessXP: highestEndlessXP || 0,
          highestEndlessRun: highestEndlessRun || 0,
          highestStreak: highestStreak || 0,
          highestWinStreak: highestWinStreak || 0,
        },
      },
      {
        new: true,
        upsert: true, // This allows the FIRST POST (the migration) to create the document
        runValidators: true,
      },
    );

    // Sync GameProfile XP to global User XP (centralized)
    if (updatedProfile && updatedProfile.xp > 0) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        // Only update if GameProfile XP is higher than User XP
    console.error("POST Sync Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync profile" },
      { status: 500 },
    );
  }
}
