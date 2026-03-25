import mongoose, { Schema, models } from "mongoose";
import { RANKS } from "@/app/games/hangman/constants";

const journeySchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // XP and Rank
    xp: {
      type: Number,
      default: 0,
    },
    rankLevel: {
      type: Number,
      default: 1,
    },
    rankName: {
      type: String,
      default: "Infant",
    },
    rankArenaId: {
      type: Number,
      default: 1,
    },
    rankColor: {
      type: String,
      default: "#75c32c",
    },
    rankStageName: {
      type: String,
      default: "The Inner Seed",
    },

    // Current position on the journey
    currentNode: {
      type: Number,
      default: 1, // Start at node 1 (infant)
      min: 1,
      max: 10, // Final WordPapa rank
    },

    // Character evolution stage
    characterStage: {
      type: String,
      enum: ["infant", "toddler", "child", "teen", "young_adult", "adult", "wordpapa"],
      default: "infant",
    },

    // Mission progress tracking
    missionsCompleted: [{
      nodeId: Number,
      missionType: String,
      completedAt: Date,
      xpEarned: Number,
    }],

    // Current active mission
    activeMission: {
      nodeId: Number,
      missionType: String,
      requirements: {
        labActions: Number, // Words dissected in lab
        synonymsLearned: Number, // Synonyms learned
        arenaWins: Number, // Arena victories
        toolsUsed: [String], // Which tools were used
      },
      progress: {
        labActions: { type: Number, default: 0 },
        synonymsLearned: { type: Number, default: 0 },
        arenaWins: { type: Number, default: 0 },
        toolsUsed: { type: [String], default: [] },
      },
      startedAt: Date,
    },

    // Journey statistics
    totalMissionsCompleted: {
      type: Number,
      default: 0,
    },
    journeyStartDate: {
      type: Date,
      default: Date.now,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },

    // Unlocked features/content
    unlockedFeatures: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Helper method to check if mission is complete
journeySchema.methods.isMissionComplete = function() {
  if (!this.activeMission) return false;

  const req = this.activeMission.requirements;
  const prog = this.activeMission.progress;

  return (
    prog.labActions >= req.labActions &&
    prog.synonymsLearned >= req.synonymsLearned &&
    prog.arenaWins >= req.arenaWins &&
    req.toolsUsed.every(tool => prog.toolsUsed.includes(tool))
  );
};

// Helper method to get character stage based on node
journeySchema.methods.getCharacterStage = function() {
  const node = this.currentNode;
  if (node <= 1) return "infant";
  if (node <= 2) return "toddler";
  if (node <= 4) return "child";
  if (node <= 6) return "teen";
  if (node <= 8) return "young_adult";
  if (node <= 9) return "adult";
  return "wordpapa";
};

// Helper method to get rank based on XP
journeySchema.methods.getRankFromXP = function(xp) {
  const currentXP = Math.max(0, xp || 0);
  const sortedRanks = [...RANKS].sort((a,b) => b.minXP - a.minXP);
  const found = sortedRanks.find((rank) => currentXP >= rank.minXP);
  return found || RANKS[0];
};

journeySchema.methods.updateRankWithXP = function(xpDelta) {
  const newXP = Math.max(0, (this.xp || 0) + xpDelta);
  const newRank = this.getRankFromXP(newXP);

  this.xp = newXP;
  this.rankLevel = newRank.level;
  this.rankName = newRank.name;
  this.rankArenaId = newRank.arenaId;
  this.rankColor = newRank.color;
  this.rankStageName = newRank.stageName;

  return this;
};

const Journey = models.Journey || mongoose.model("Journey", journeySchema);
export default Journey;