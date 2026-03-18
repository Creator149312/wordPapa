'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from "next-auth/react"; // Add this
import {
  calculateLevel,
  getClassicRewards,
  getOnlineMatchRewards,
  getArenaUnlockBonus
} from '../lib/progression';

const STORAGE_KEY = 'wordpapa_profile';
const MAX_LIVES = 10;
const RECOVERY_MS = 3 * 60 * 60 * 1000;

const INITIAL_STATE = {
  name: "Player",
  xp: 0,
  papaPoints: 50,
  lives: MAX_LIVES,
  lastLifeLost: Date.now(),
  currentStreak: 0,
  highestStreak: 0,
  onlineWinStreak: 0,
  highestWinStreak: 0,
  dailyStreak: 0,
  lastDailyDate: null,
  unlockedThemes: ['classic'],
  currentTheme: 'classic',
  isGhost: true,
};

export function useWordPapaProfile() {
  const { data: session, status } = useSession(); // Access NextAuth session
  const [profile, setProfile] = useState(INITIAL_STATE);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- NEW: Sync local state with DB data ---
  const updateLocalProfile = useCallback((newProfileData) => {
    setProfile(prev => {
      const merged = { ...prev, ...newProfileData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  // --- NEW: Auth Effect (Handles Ghost -> User transition) ---
  useEffect(() => {
    const syncWithAuth = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          // Attempt to fetch existing profile from DB
          const res = await fetch("/api/game/hangman/sync");
          const data = await res.json();

          if (data.success && data.profile) {
            updateLocalProfile({ ...data.profile, isGhost: false });
          } else {
            // First time user: Convert ghost progress to DB record
            convertGhostToUser({
              name: session.user.name,
              userEmail: session.user.email
            });
          }
        } catch (err) {
          console.error("Auth Sync Error:", err);
        }
      }
    };
    syncWithAuth();
  }, [status, session]);

  // 1. Initial Load & Offline Life Recovery
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();

        let updatedLives = parsed.lives ?? MAX_LIVES;
        let lastLifeTimestamp = parsed.lastLifeLost ?? now;

        if (updatedLives < MAX_LIVES) {
          const timePassed = now - lastLifeTimestamp;
          const recovered = Math.floor(timePassed / RECOVERY_MS);

          if (recovered > 0) {
            updatedLives = Math.min(MAX_LIVES, updatedLives + recovered);
            lastLifeTimestamp = updatedLives === MAX_LIVES
              ? now
              : lastLifeTimestamp + (recovered * RECOVERY_MS);
          }
        }

        setProfile(prev => ({
          ...INITIAL_STATE,
          ...parsed,
          lives: updatedLives,
          lastLifeLost: lastLifeTimestamp,
        }));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Centralized Save Function
  const updateProfile = useCallback((updateFn) => {
    setProfile(prev => {
      const newProfile = updateFn(prev);
      const oldLevel = calculateLevel(prev.xp).level;
      const newLevel = calculateLevel(newProfile.xp).level;

      if (newLevel > oldLevel) {
        setShowLevelUp(true);
        const arenaBonus = getArenaUnlockBonus(newLevel);
        if (arenaBonus > 0) {
          newProfile.papaPoints += arenaBonus;
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // 3. Classic Result
  const applyClassicResult = (isWin) => {
    updateProfile(prev => {
      const newStreak = isWin ? prev.currentStreak + 1 : 0;
      const { xpGain, coinGain } = isWin
        ? getClassicRewards(newStreak)
        : { xpGain: -2, coinGain: 0 };

      let newLives = prev.lives;
      let newLastLifeLost = prev.lastLifeLost;

      if (!isWin) {
        if (newLives === MAX_LIVES) newLastLifeLost = Date.now();
        newLives = Math.max(0, newLives - 1);
      }

      return {
        ...prev,
        xp: Math.max(0, prev.xp + xpGain),
        papaPoints: prev.papaPoints + coinGain,
        currentStreak: newStreak,
        highestStreak: Math.max(prev.highestStreak, newStreak),
        lives: newLives,
        lastLifeLost: newLastLifeLost
      };
    });
  };

  // 4. Online Results
  const applyOnlineResults = (isWinner) => {
    updateProfile(prev => {
      const outcome = getOnlineMatchRewards(isWinner, prev.onlineWinStreak);
      const newWinStreak = outcome.shouldResetStreak ? 0 : prev.onlineWinStreak + 1;

      return {
        ...prev,
        xp: Math.max(0, prev.xp + outcome.xpChange),
        papaPoints: prev.papaPoints + outcome.coinChange,
        onlineWinStreak: newWinStreak,
        highestWinStreak: Math.max(prev.highestWinStreak || 0, newWinStreak)
      };
    });
  };

  // 5. Daily Rewards
  const addDailyRewards = (xp, coins) => {
    updateProfile(prev => {
      const today = new Date().toISOString().slice(0, 10);
      return {
        ...prev,
        xp: prev.xp + xp,
        papaPoints: prev.papaPoints + coins,
        dailyStreak: (prev.dailyStreak || 0) + 1,
        lastDailyDate: today
      };
    });
  };

  // 6. Economy
  const deductCoins = (amount) => {
    if (profile.papaPoints < amount) return false;
    updateProfile(prev => ({
      ...prev,
      papaPoints: prev.papaPoints - amount
    }));
    return true;
  };

  // 7. Themes
  const purchaseTheme = (themeId, price) => {
    if (profile.papaPoints >= price && !profile.unlockedThemes.includes(themeId)) {
      updateProfile(prev => ({
        ...prev,
        papaPoints: prev.papaPoints - price,
        unlockedThemes: [...prev.unlockedThemes, themeId],
        currentTheme: themeId
      }));
      return true;
    }
    return false;
  };

  // 8. Auth Sync
  const convertGhostToUser = (userData) => {
    updateProfile(prev => ({
      ...prev,
      ...userData,
      isGhost: false
    }));
  };


  // Add this inside useWordPapaProfile hook
  const applyEndlessResult = (wordsSolved, totalXpEarned, totalCoinsEarned) => {
    updateProfile(prev => ({
      ...prev,
      xp: prev.xp + totalXpEarned,
      papaPoints: prev.papaPoints + totalCoinsEarned,
      // Optional: track a separate high score for Endless
      highestEndlessRun: Math.max(prev.highestEndlessRun || 0, wordsSolved)
    }));
  };

  return {
    profile,
    isLoaded,
    applyClassicResult,
    applyEndlessResult, // <--- ADD THIS HERE
    addDailyRewards,
    deductCoins,
    applyOnlineResults,
    purchaseTheme,
    showLevelUp,
    setShowLevelUp,
    convertGhostToUser,
    updateLocalProfile
  };

}