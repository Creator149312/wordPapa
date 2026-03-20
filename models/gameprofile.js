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
    // Combined stats from all game modes
    xp: {
      type: Number,
      default: 0,
    },
    papaPoints: {
      type: Number,
      default: 50, // Initial currency for power-ups
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
    // Specifically for the Endless Leaderboard
    highestEndlessRun: {
      type: Number,
      default: 0, // Most words solved in one session
    },
    highestEndlessXP: {
      type: Number,
      default: 0, // Most XP earned in one session
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
