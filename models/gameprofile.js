import mongoose, { Schema, models } from "mongoose";

const gameProfileSchema = new Schema(
  {
    // Link to the user via email (matching your List model logic) 
    // or use userEmail: { type: String, required: true, unique: true }
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
    xp: {
      type: Number,
      default: 0,
    },
    papaPoints: {
      type: Number,
      default: 50,
    },
    lives: {
      type: Number,
      default: 5, // Assuming MAX_LIVES is 5
    },
    lastLifeLost: {
      type: Date,
      default: Date.now,
    },
    // --- Hangman Classic Stats ---
    currentStreak: {
      type: Number,
      default: 0,
    },
    highestStreak: {
      type: Number,
      default: 0,
    },
    // --- Multiplayer / Online Stats ---
    onlineWinStreak: {
      type: Number,
      default: 0,
    },
    highestWinStreak: {
      type: Number,
      default: 0,
    },
    // --- Daily Retention ---
    dailyStreak: {
      type: Number,
      default: 0,
    },
    lastDailyDate: {
      type: Date,
      default: null,
    },
    // --- Customization ---
    unlockedThemes: {
      type: [String],
      default: ["classic"],
    },
    currentTheme: {
      type: String,
      default: "classic",
    },
    // --- Player State ---
    isGhost: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const GameProfile = models.GameProfile || mongoose.model("GameProfile", gameProfileSchema);

export default GameProfile;