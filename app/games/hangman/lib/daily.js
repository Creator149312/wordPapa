// lib/daily.js
import { WORDS_POOL } from "../constants";

export const getDailyMetadata = () => {
  const now = new Date();

  // Use UTC for global synchronization
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;

  // 1. Prepare the Daily Pool (Levels 6-10)
  // We filter for keys >= 6 and flatten the arrays into one list
  const dailyPool = Object.keys(WORDS_POOL)
    .filter((level) => parseInt(level) >= 6)
    .reduce((acc, level) => {
      return [...acc, ...WORDS_POOL[level]];
    }, []);

  // 2. Deterministic Seeding
  // Ensures everyone gets the same word from the dailyPool
  const seed = year * 10000 + parseInt(month) * 100 + parseInt(day);

  // Use a pseudo-random jump based on the seed to pick the index
  const pseudoRandomIndex = Math.abs(Math.sin(seed) * 10000);
  const index = Math.floor(pseudoRandomIndex % dailyPool.length);

  // 3. Calculate Day Number (Challenge # from a base date)
  const baseDate = new Date(Date.UTC(2024, 0, 1)).getTime();
  const dayNumber = Math.floor((now.getTime() - baseDate) / 8.64e7);

  return {
    wordObj: dailyPool[index], // This returns { word: "...", category: "..." }
    dayNumber: dayNumber,
    dateKey: todayStr,
  };
};

/**
 * Formats time until next UTC midnight
 */
export const getTimeUntilNextDay = () => {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );

  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
