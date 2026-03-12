// lib/daily.js
import { WORDS_POOL } from '../constants';

export const getDailyMetadata = () => {
  // We use UTC time to ensure every player globally resets at the exact same moment
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10); // Format: "2026-03-08"
  
  // 1. Generate a consistent Seed based on the date string
  // This ensures the word is the same for everyone on this date
  const seed = todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = seed % WORDS_POOL.length;
  
  // 2. Calculate time until next reset (Midnight UTC)
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);
  const secondsLeft = Math.floor((tomorrow - now) / 1000);

  // 3. Calculate a "Day Number" (e.g., Daily Challenge #42)
  // Base date is Jan 1, 2024
  const baseDate = new Date('2024-01-01').getTime();
  const dayNumber = Math.floor((now.getTime() - baseDate) / 8.64e7);

  return {
    wordObj: WORDS_POOL[index],
    dayNumber: dayNumber,
    dateKey: todayStr,
    secondsLeft
  };
};

export const formatTimeLeft = (seconds) => {
  if (seconds < 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  // Pad with leading zeros
  return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
};