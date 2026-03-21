import { RANKS, ARENAS, GAME_STAKES } from "../constants";

/**
 * Returns the current rank object based on total XP.
 * Attaches the corresponding Arena/Theme metadata.
 */
export const calculateLevel = (xp) => {
  const safeXP = Math.max(0, xp || 0);

  // Find the highest rank achieved
  const currentRank =
    [...RANKS].reverse().find((rank) => safeXP >= rank.minXP) || RANKS[0];

  // Attach Arena metadata if it exists
  const theme = ARENAS[currentRank.arenaId] || ARENAS[1];

  return {
    ...currentRank,
    theme,
  };
};

/**
 * Returns the next rank object for progress tracking.
 */
export const getNextRank = (xp) => {
  const safeXP = Math.max(0, xp || 0);
  // Find the first rank that has a minXP strictly greater than current XP
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

  // Ensure we don't divide by zero if rank config is identical
  if (range <= 0) return 100;

  return Math.min(
    Math.max(Math.round((progressWithinRange / range) * 100), 0),
    100,
  );
};

/**
 * Calculates rewards for Endless Run mode.
 * Matches the logic: (Length * 10) + (Difficulty * 15)
 */
export const getEndlessRewards = (
  wordLength,
  wordLevel,
  remainingLives = 0,
) => {
  const { HEALTH_BONUS_XP, HEALTH_BONUS_COINS } = GAME_STAKES.ENDLESS;

  const baseXP = wordLength * 10 + wordLevel * 15;
  const baseCoins = Math.ceil(baseXP / 10);

  const safeLives = Math.max(0, remainingLives);

  return {
    xpGain: baseXP + safeLives * HEALTH_BONUS_XP,
    coinGain: baseCoins + safeLives * HEALTH_BONUS_COINS,
  };
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
 * Calculates Multiplayer 1v1 rewards.
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
 * Calculates the "First Time Arena Bonus" when leveling up.
 */
export const getArenaUnlockBonus = (level) => {
  // Try to use functional constant from game stakes
  if (typeof GAME_STAKES?.getArenaUnlockBonus === "function") {
    return GAME_STAKES.getArenaUnlockBonus(level);
  }

  // Logical progression: Level 2 = 200, Level 5 = 500, etc.
  return level * 100;
};
