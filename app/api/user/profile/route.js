import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";

// Helper to normalize username: alphanumeric + hyphens/underscores, 3-24 chars
function sanitizeUsername(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 24);
}

/**
 * GET /api/user/profile
 * Returns the current authenticated user's profile details.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();
    let profile = await GameProfile.findOne({ userEmail: session.user.email }).lean();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        name: profile.name || session.user.name || "Player",
        username: profile.username || "",
        bio: profile.bio || "",
        country: profile.country || "",
        region: profile.region || "",
        institution: profile.institution || "",
        wordsMastered: profile.wordsMastered || 0,
        totalWordsSolved: profile.totalWordsSolved || 0,
        xp: profile.xp || 0,
        journeyXP: profile.journeyXP || 0,
        highestEndlessXP: profile.highestEndlessXP || 0,
        highestEndlessRun: profile.highestEndlessRun || 0,
        dailyStreak: profile.dailyStreak || 0,
      },
    });
  } catch (error) {
    console.error("[GET /api/user/profile] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * PATCH /api/user/profile
 * Updates the user's personal & regional identity (username, bio, country, region, institution).
 */
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, bio, country, region, institution, name } = body;

    await connectMongoDB();
    const userEmail = session.user.email;

    const updateFields = {};

    if (name !== undefined) {
      updateFields.name = String(name).trim().slice(0, 50) || "Player";
    }

    if (username !== undefined) {
      const cleanUsername = sanitizeUsername(username);
      if (cleanUsername.length > 0) {
        if (cleanUsername.length < 3) {
          return NextResponse.json(
            { error: "Username must be at least 3 characters long" },
            { status: 400 }
          );
        }

        // Check uniqueness if changed
        const existing = await GameProfile.findOne({
          username: cleanUsername,
          userEmail: { $ne: userEmail },
        });

        if (existing) {
          return NextResponse.json(
            { error: "Username is already taken by another player" },
            { status: 409 }
          );
        }

        updateFields.username = cleanUsername;
      }
    }

    if (bio !== undefined) {
      updateFields.bio = String(bio).trim().slice(0, 160);
    }

    if (country !== undefined) {
      updateFields.country = String(country).trim().toUpperCase().slice(0, 3);
    }

    if (region !== undefined) {
      updateFields.region = String(region).trim().slice(0, 60);
    }

    if (institution !== undefined) {
      updateFields.institution = String(institution).trim().slice(0, 80);
    }

    const updatedProfile = await GameProfile.findOneAndUpdate(
      { userEmail },
      { $set: updateFields },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        name: updatedProfile.name,
        username: updatedProfile.username,
        bio: updatedProfile.bio,
        country: updatedProfile.country,
        region: updatedProfile.region,
        institution: updatedProfile.institution,
      },
    });
  } catch (error) {
    console.error("[PATCH /api/user/profile] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
