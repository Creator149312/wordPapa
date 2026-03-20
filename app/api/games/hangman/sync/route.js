import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";

/**
 * GET: Retrieves or Initializes the user's profile.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    // Lazy Create: If no profile exists, create one with default starter stats.
    const profile = await GameProfile.findOneAndUpdate(
      { userEmail: session.user.email },
      {
        $setOnInsert: {
          userEmail: session.user.email,
          name: session.user.name || "Player",
          xp: 0,
          papaPoints: 50,
          totalWordsSolved: 0,
          highestEndlessRun: 0,
          highestEndlessXP: 0,
          isGhost: false,
          unlockedThemes: ["classic"],
          currentTheme: "classic",
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("GET Sync Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST: Updates the cloud profile with the latest game session snapshot.
 */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData = await req.json();
    await connectMongoDB();

    // 1. Destructure to strip out sensitive/DB-generated fields.
    // We explicitly exclude 'isGhost' because once they sync to DB, they aren't ghosts.
    const { 
      _id, 
      __v, 
      userEmail, 
      createdAt, 
      updatedAt, 
      isGhost, 
      ...safeUpdateData 
    } = updateData;

    // 2. Perform a deep update.
    // Since EndlessRunMode sends the FULL calculated snapshot, we use $set.
    const updatedProfile = await GameProfile.findOneAndUpdate(
      { userEmail: session.user.email },
      {
        $set: {
          ...safeUpdateData,
          userEmail: session.user.email, // Final integrity check
          isGhost: false, // Ensure they are marked as a registered user
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("POST Sync Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync profile" },
      { status: 500 }
    );
  }
}