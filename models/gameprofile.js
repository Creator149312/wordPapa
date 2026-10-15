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
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },
    country: {
      type: String, // 2-letter ISO country code, e.g., "US", "IN", "GB"
      default: "",
      uppercase: true,
      trim: true,
    },
    region: {
      type: String, // State/Province, e.g., "California", "Ontario"
      default: "",
      trim: true,
    },
    institution: {
      type: String, // School, College, or Club name
      default: "",
      trim: true,
    },
    wordsMastered: {
      type: Number,
      default: 0,
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
    // Trophy Floor: the minimum rank XP the player has ever reached.
    // Losing matches can never drop the player below this rank's minXP.
    highestXP: {
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
    weekendFreeze: {
      type: Boolean,
      default: false, // If true, Saturday/Sunday misses do not break the streak
    },
    hasSpeedsterBadge: {
      type: Boolean,
      default: false,
    },
    speedsterBadgesCount: {
      type: Number,
      default: 0,
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

    // --- CLASH DUEL 1v1 (Safe optional fields with defaults) ---
    activeDeck: {
      type: [String],
      default: ["freeze", "shield", "scramble", "reveal"],
    },
    duelMatchesPlayed: {
      type: Number,
      default: 0,
    },
    duelSpellsCast: {
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

    // --- CONSOLIDATED JOURNEY PROGRESSION (Zero-Loss Migration) ---
    journey: {
      currentNodeId: {
        type: String,
        default: "1-1",
      },
      unlockedNodes: {
        type: [String],
        default: ["1-1"],
      },
      characterStage: {
        type: String,
        default: "infant",
      },
      nodeWordProgress: {
        type: Map,
        of: {
          wordsCompleted: { type: Number, default: 0 },
          totalWords: { type: Number, default: 0 },
          percent: { type: Number, default: 0 },
          completed: { type: Boolean, default: false },
          lastPracticed: { type: Date, default: Date.now },
        },
        default: () => new Map(),
      },
      streak: {
        type: Number,
        default: 0,
      },
      lastPracticeDay: {
        type: String,
        default: null,
      },
      streakShields: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt
  },
);

// Compound indexes for leaderboard sort + filter queries.
// These make .sort({ xp: -1 }) and countDocuments({ xp: { $gt: X } }) use index scans.
gameProfileSchema.index({ isGhost: 1, xp: -1 });
gameProfileSchema.index({ isGhost: 1, highestEndlessXP: -1 });
gameProfileSchema.index({ isGhost: 1, journeyXP: -1 });
gameProfileSchema.index({ isGhost: 1, country: 1, xp: -1 });
gameProfileSchema.index({ isGhost: 1, institution: 1, xp: -1 });

// Middleware/Helper to prevent model re-definition errors in Next.js
const GameProfile =
  models.GameProfile || mongoose.model("GameProfile", gameProfileSchema);

export default GameProfile;
