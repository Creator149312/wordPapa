// lib/daily.js
import { WORDS_POOL } from "../constants";

export const getDailyMetadata = () => {
  const now = new Date();

  // 1. Establish UTC Date Constants
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0-indexed
  const day = now.getUTCDate();

  // Start of the current UTC day (for consistent day numbering)
  const todayStartUTC = Date.UTC(year, month, day);
  const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // 2. Prepare the Daily Pool (Harder words: Levels 6-10)
  const dailyPool = Object.keys(WORDS_POOL)
    .filter((level) => parseInt(level) >= 6)
    .reduce((acc, level) => [...acc, ...WORDS_POOL[level]], []);

  // Safety fallback if pool is empty
  const activePool = dailyPool.length > 0 ? dailyPool : WORDS_POOL["1"];

  // 3. Deterministic Seeding
  // Seed remains identical for all users globally for the entire UTC day
  const seed = year * 1000 + (month + 1) * 31 + day;
  const pseudoRandom = Math.abs(Math.sin(seed) * 10000);
  const index = Math.floor(pseudoRandom % activePool.length);

  // 4. Calculate Challenge Number (Days since launch)
  // Use todayStartUTC instead of now.getTime() to prevent mid-day shifts
  const launchDate = new Date(Date.UTC(2025, 0, 1)).getTime();
  const dayNumber = Math.floor((todayStartUTC - launchDate) / 86400000);

  return {
    wordObj: activePool[index],
    dayNumber: Math.max(1, dayNumber),
    dateKey: dateKey,
    timestamp: todayStartUTC,
  };
};

/**
 * Returns formatted string for the countdown to next UTC midnight
 */
export const getTimeUntilNextDay = () => {
  const now = new Date();

  // Calculate exactly when the next UTC day starts
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

  const diff = tomorrow.getTime() - now.getTime();

  // If the difference is negative or zero, it's a new day
  if (diff <= 0) {
    return { formatted: "00:00:00", isNewDay: true };
  }

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return {
    formatted: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    isNewDay: false,
  };
};

/**
 * Helper to get the ISO string of the next UTC day
 * (Useful for streak validation logic)
 */
export const getNextDayDateKey = () => {
  const nextDay = new Date();
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);
  return nextDay.toISOString().split("T")[0];
};
