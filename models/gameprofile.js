import mongoose, { Schema, models } from "mongoose";

const gameProfileSchema = new Schema(
  {
    // --- IDENTITY & ACCOUNT STATE ---
    userEmail: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: "Player",
    },
    isGhost: {
      type: Boolean,
      default: true,
    },

    // --- GLOBAL CAREER PROGRESSION ---
    // Derived value: xp = journeyXP + endlessXP (computed server-side on every sync).
    // Stored for efficient leaderboard sorting.
    xp: {
      type: Number,
      default: 0,
    },
    papaPoints: {
      type: Number,
      default: 100, // Initial currency for power-ups
    },
    totalWordsSolved: {
      type: Number,
      default: 0, // Lifetime activity counter
    },
    lives: {
      type: Number,
      default: 5,
    },
    lastLifeLost: {
      type: Date,
      default: Date.now,
    },

    // --- ENDLESS MODE RECORDS ---
    highestEndlessRun: {
      type: Number,
      default: 0, // Most words solved in one session
    },
    highestEndlessXP: {
      type: Number,
      default: 0, // Best single-run XP (leaderboard only, not used for rank)
    },
    // Cumulative XP earned from ALL Endless runs combined.
    // Incremented via $inc (delta-based) on every sync.
    endlessXP: {
      type: Number,
      default: 0,
    },

    // --- JOURNEY MODE TOTALS ---
    // Accumulated XP earned exclusively through Journey mode.
    // Incremented via $inc (delta-based) on every sync — never via $max —
    // so a stale localStorage cache can never silently drop session earnings.
    // Analogous to Clash Royale's mode-specific trophy tracks.
    journeyXP: {
      type: Number,
      default: 0,
    },



    // --- DAILY CHALLENGE ---
    dailyStreak: {
      type: Number,
      default: 0,
    },
    lastDailyDate: {
      type: String, // Stored as "YYYY-MM-DD" for easy daily locking
      default: null,
    },

    // --- CLASSIC MODE ---
    currentStreak: {
      type: Number,
      default: 0,
    },
    highestStreak: {
      type: Number,
      default: 0,
    },

    // --- ONLINE MULTIPLAYER ---
    onlineWinStreak: {
      type: Number,
      default: 0,
    },
    highestWinStreak: {
      type: Number,
      default: 0,
    },

    // --- CUSTOMIZATION ---
    unlockedThemes: {
      type: [String],
      default: ["classic"],
    },
    currentTheme: {
      type: String,
      default: "classic",
    },
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt
  },
);

// Middleware/Helper to prevent model re-definition errors in Next.js
const GameProfile =
  models.GameProfile || mongoose.model("GameProfile", gameProfileSchema);

export default GameProfile;
