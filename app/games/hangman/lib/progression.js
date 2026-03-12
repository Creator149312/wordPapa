// 1. STAKES & ECONOMY CONFIGURATION
export const GAME_STAKES = {
  ONLINE_1V1: {
    ENTRY_FEE: 10,           // Cost to enter the race
    BASE_WIN_PRIZE: 20,      // Basic win (Return entry + 10)
    BASE_XP_WIN: 25,         // High XP Frequency
    XP_LOSS: 5,              // XP lost on defeat
    STREAK_XP_BONUS: 15,     // Extra XP per win in a streak (Cumulative)
    STREAK_COIN_BONUS: 5,    // Extra Coins per win in a streak (Cumulative)
  },
  CLASSIC: {
    BASE_XP: 10,         
    BASE_COINS: 5,       
    XP_LOSS_PER_LIFE: 2, 
    STREAK_BONUS_MULTIPLIER: 1.5, 
  },
  ENERGY: {
    MAX_LIVES: 10,
    RECOVERY_MINUTES: 180, 
  },
  ARENA_BONUSES: {
    LIBRARY_UNLOCK: 50,    
    LABORATORY_UNLOCK: 100 
  }
};

// 2. RANK DEFINITIONS
export const RANKS = [
  { level: 1, name: "Word Toddler", minXP: 0, color: "#94a3b8", arenaId: 'backyard' },
  { level: 2, name: "Word Scout", minXP: 100, color: "#60a5fa", arenaId: 'backyard' }, 
  { level: 3, name: "Word Knight", minXP: 300, color: "#a855f7", arenaId: 'library' },
  { level: 4, name: "Word Master", minXP: 700, color: "#f59e0b", arenaId: 'library' },
  { level: 5, name: "Word Papa", minXP: 1500, color: "#75c32c", arenaId: 'laboratory' },
  { level: 6, name: "Word Legend", minXP: 3000, color: "#ef4444", arenaId: 'laboratory' },
];

// 3. UTILITY FUNCTIONS

/**
 * NEW: Calculates Multiplayer 1v1 rewards.
 * Implements "Large Streak Bonus" and "Loss Penalty".
 */
export const getOnlineMatchRewards = (isWinner, currentWinStreak = 0) => {
  const stakes = GAME_STAKES.ONLINE_1V1;

  if (!isWinner) {
    return {
      xpChange: -stakes.XP_LOSS,
      coinChange: 0, 
      shouldResetStreak: true // Loss Penalty: Win Streak Reset
    };
  }

  // Large Streak Bonus: Calculation based on consecutive wins
  // Example: 3rd win in a row gives 25 + (3 * 15) = 70 XP
  const streakMultiplier = currentWinStreak + 1;
  const xpGain = stakes.BASE_XP_WIN + (currentWinStreak * stakes.STREAK_XP_BONUS);
  const coinGain = stakes.BASE_WIN_PRIZE + (currentWinStreak * stakes.STREAK_COIN_BONUS);

  return {
    xpChange: xpGain,
    coinChange: coinGain,
    shouldResetStreak: false
  };
};

/**
 * Calculates the "First Time Arena Bonus."
 */
export const getArenaUnlockBonus = (level) => {
  const { ARENA_BONUSES } = GAME_STAKES;
  if (level === 3) return ARENA_BONUSES.LIBRARY_UNLOCK;
  if (level === 5) return ARENA_BONUSES.LABORATORY_UNLOCK;
  return 0;
};

/**
 * Calculates rewards for Classic mode. (UNTOUCHED)
 */
export const getClassicRewards = (currentStreak) => {
  const { BASE_XP, BASE_COINS, STREAK_BONUS_MULTIPLIER } = GAME_STAKES.CLASSIC;
  
  const milestoneBonus = Math.floor(currentStreak / 5);
  const multiplier = 1 + (milestoneBonus * (STREAK_BONUS_MULTIPLIER - 1));

  return {
    xpGain: Math.round(BASE_XP * multiplier),
    coinGain: Math.round(BASE_COINS * multiplier),
    isMilestone: currentStreak > 0 && currentStreak % 5 === 0
  };
};

/**
 * Returns the current rank based on total XP.
 */
export const calculateLevel = (xp) => {
  const safeXP = Math.max(0, xp);
  return [...RANKS].reverse().find(rank => safeXP >= rank.minXP) || RANKS[0];
};

/**
 * Returns the next rank for UI.
 */
export const getNextRank = (xp) => {
  const safeXP = Math.max(0, xp);
  return RANKS.find(r => r.minXP > safeXP) || null;
};

/**
 * Returns percentage (0-100) for UI.
 */
export const calculateProgress = (xp) => {
  const safeXP = Math.max(0, xp);
  const currentRank = calculateLevel(safeXP);
  const nextRank = getNextRank(safeXP);

  if (!nextRank) return 100;

  const range = nextRank.minXP - currentRank.minXP;
  const progressWithinRange = safeXP - currentRank.minXP;
  
  return Math.min(Math.round((progressWithinRange / range) * 100), 100);
};