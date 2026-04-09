// lib/daily.js
export { getDailyTheme } from "../dailyPuzzles";

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
