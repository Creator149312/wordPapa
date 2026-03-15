import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@lib/mongodb";
import GameProfile from "@/models/gameprofile";

/**
 * GET: Retrieves the user's profile from MongoDB on login or refresh.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const profile = await GameProfile.findOne({
      userEmail: session.user.email,
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("GET Sync Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * POST: Overwrites the cloud profile with the latest snapshot from the game.
 */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData = await req.json();
    await connectMongoDB();

    // Remove sensitive fields to prevent accidental overwrites of system data
    const { _id, userEmail, ...safeUpdateData } = updateData;

    const updatedProfile = await GameProfile.findOneAndUpdate(
      { userEmail: session.user.email },
      {
        $set: {
          ...safeUpdateData,
          userEmail: session.user.email, // Ensure email remains consistent
          updatedAt: Date.now(),
        },
      },
      {
        new: true, // Return the modified document
        upsert: true, // Create if it doesn't exist
        runValidators: true,
      },
    );

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("POST Sync Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync profile" },
      { status: 500 },
    );
  }
}
