import { RANKS, ARENAS, GAME_STAKES } from "../constants";

/**
 * Calculates Multiplayer 1v1 rewards.
 * Note: Entry Fee should be deducted via deductCoins() BEFORE calling this.
 */
export const getOnlineMatchRewards = (isWinner, currentWinStreak = 0) => {
  const stakes = GAME_STAKES.ONLINE_1V1;
  const safeStreak = Math.max(0, currentWinStreak);

  if (!isWinner) {
    return {
      xpChange: -stakes.XP_LOSS,
      coinChange: 0,
      shouldResetStreak: true,
    };
  }

  // Winning calculation using streak bonuses from constants
  const xpGain = stakes.BASE_XP_WIN + safeStreak * stakes.STREAK_XP_BONUS;
  const coinGain =
    stakes.BASE_WIN_PRIZE + safeStreak * (stakes.STREAK_COIN_BONUS || 0);

  return {
    xpChange: xpGain,
    coinChange: coinGain,
    shouldResetStreak: false,
  };
};


/**
 * Calculates rewards for Endless Run mode.
 * Rewards are given per word solved, with bonuses for current health.
 */
export const getEndlessRewards = (remainingLives) => {
  const { BASE_XP, BASE_COINS, HEALTH_BONUS_XP, HEALTH_BONUS_COINS } = GAME_STAKES.ENDLESS;

  const safeLives = Math.max(0, remainingLives);

  return {
    xpGain: BASE_XP + (safeLives * HEALTH_BONUS_XP),
    coinGain: BASE_COINS + (safeLives * HEALTH_BONUS_COINS),
  };
};

/**
 * Calculates the "First Time Arena Bonus" when leveling up.
 * Updated to use the dynamic (100 * level) formula.
 */
export const getArenaUnlockBonus = (level) => {
  // Uses the functional constant we defined: (level) => 100 * level
  if (typeof GAME_STAKES.getArenaUnlockBonus === "function") {
    return GAME_STAKES.getArenaUnlockBonus(level);
  }
  // Fallback if the function isn't found
  return level * 100;
};

/**
 * Calculates rewards for Classic mode based on the current streak.
 */
export const getClassicRewards = (currentStreak) => {
  const { BASE_XP, BASE_COINS, STREAK_BONUS_MULTIPLIER } = GAME_STAKES.CLASSIC;
  const safeStreak = Math.max(0, currentStreak);

  // Every 5 wins, the multiplier increases.
  const milestoneBonus = Math.floor(safeStreak / 5);
  const multiplier = 1 + milestoneBonus * (STREAK_BONUS_MULTIPLIER - 1);

  return {
    xpGain: Math.round(BASE_XP * multiplier),
    coinGain: Math.round(BASE_COINS * multiplier),
    isMilestone: safeStreak > 0 && safeStreak % 5 === 0,
  };
};

/**
 * Returns the current rank object based on total XP.
 */
export const calculateLevel = (xp) => {
  const safeXP = Math.max(0, xp || 0);
  // Iterate backwards to find the highest rank from the 10-stage RANKS array
  return [...RANKS].reverse().find((rank) => safeXP >= rank.minXP) || RANKS[0];
};

/**
 * Returns the next rank object for progress tracking.
 */
export const getNextRank = (xp) => {
  const safeXP = Math.max(0, xp || 0);
  return RANKS.find((r) => r.minXP > safeXP) || null;
};

/**
 * Returns percentage (0-100) toward the next level.
 */
export const calculateProgress = (xp) => {
  const safeXP = Math.max(0, xp || 0);
  const currentRank = calculateLevel(safeXP);
  const nextRank = getNextRank(safeXP);

  if (!nextRank) return 100;

  const range = nextRank.minXP - currentRank.minXP;
  const progressWithinRange = safeXP - currentRank.minXP;

  return Math.min(Math.round((progressWithinRange / range) * 100), 100);
};
