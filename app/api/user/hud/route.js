import { getServerSession } from "next-auth/next";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { connectMongoDB } from "@lib/mongodb";
import GameProfile from "@models/gameprofile";

// Rank thresholds — kept in sync with app/games/hangman/constants.js
const RANKS = [
  { level: 1,  name: "Infant",    minXP: 0,      color: "#75c32c" },
  { level: 2,  name: "Toddler",   minXP: 500,    color: "#059669" },
  { level: 3,  name: "Student",   minXP: 1500,   color: "#0284c7" },
  { level: 4,  name: "Scholar",   minXP: 3500,   color: "#2563eb" },
  { level: 5,  name: "Sage",      minXP: 8000,   color: "#4f46e5" },
  { level: 6,  name: "Yogi",      minXP: 18000,  color: "#7c3aed" },
  { level: 7,  name: "Guru",      minXP: 37000,  color: "#c026d3" },
  { level: 8,  name: "Master",    minXP: 75000,  color: "#db2777" },
  { level: 9,  name: "Legend",    minXP: 125000, color: "#ea580c" },
  { level: 10, name: "Word Papa", minXP: 210000, color: "#dc2626" },
];

function calculateLevel(xp) {
  const safeXP = Math.max(0, xp || 0);
  return [...RANKS].reverse().find((r) => safeXP >= r.minXP) || RANKS[0];
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ hud: null }, { status: 200 });
    }

    await connectMongoDB();
    const profile = await GameProfile.findOne(
      { userEmail: session.user.email },
      { xp: 1 }
    ).lean();

    if (!profile) {
      return Response.json({ hud: null }, { status: 200 });
    }

    const rank = calculateLevel(profile.xp);

    return Response.json(
      {
        hud: {
          xp: profile.xp || 0,
          level: rank.level,
          name: rank.name,
          color: rank.color,
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (err) {
    console.error("[/api/user/hud] Error:", err);
    return Response.json({ hud: null }, { status: 200 });
  }
}
