'use client';
import { useState, useEffect, useCallback } from 'react';
import { 
  calculateLevel, 
  getClassicRewards, 
  getOnlineMatchRewards, 
  getArenaUnlockBonus 
} from '../lib/progression';

const STORAGE_KEY = 'wordpapa_profile';
const MAX_LIVES = 10;
const RECOVERY_MS = 3 * 60 * 60 * 1000; // 3 Hours per life

const INITIAL_STATE = {
  name: "Player",
  xp: 0,
  papaPoints: 50,
  lives: MAX_LIVES,
  lastLifeLost: Date.now(),
  currentStreak: 0,       // Classic Streak
  highestStreak: 0,       // Classic Peak
  onlineWinStreak: 0,     // NEW: Multiplayer Streak
  highestWinStreak: 0,    // NEW: Multiplayer Peak
  dailyStreak: 0,
  lastDailyDate: null,
  unlockedThemes: ['classic'],
  currentTheme: 'classic',
  isGhost: true, 
};

export function useWordPapaProfile() {
  const [profile, setProfile] = useState(INITIAL_STATE);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initial Load & Offline Life Recovery Logic
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

        setProfile({
          ...INITIAL_STATE,
          ...parsed,
          isGhost: parsed.isGhost ?? true, 
          lives: updatedLives,
          lastLifeLost: lastLifeTimestamp,
          name: parsed.name || "Player_" + Math.floor(Math.random() * 1000)
        });
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
      
      // Automatic Level Up Check
      if (newLevel > oldLevel) {
        setShowLevelUp(true);
        
        // --- NEW: Arena Unlock Bonus Integration ---
        const arenaBonus = getArenaUnlockBonus(newLevel);
        if (arenaBonus > 0) {
          newProfile.papaPoints += arenaBonus;
          console.log(`Arena Bonus Unlocked: +${arenaBonus} Coins`);
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // 3. Classic Mode Results (XP, Coins, Streaks, Lives) - UNTOUCHED
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

  // 4. Online Race Results - UPDATED for 1v1 High Stakes
  const applyOnlineResults = (isWinner) => {
    updateProfile(prev => {
      // Use the new Multiplayer Math
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

  // 5. Daily Rewards & Streaks
  const addDailyRewards = (xp, coins) => {
    updateProfile(prev => {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      let newDailyStreak = prev.dailyStreak;
      if (prev.lastDailyDate === yesterdayStr) {
        newDailyStreak += 1;
      } else if (prev.lastDailyDate !== today) {
        newDailyStreak = 1;
      }

      return {
        ...prev,
        xp: prev.xp + xp,
        papaPoints: prev.papaPoints + coins,
        dailyStreak: newDailyStreak,
        lastDailyDate: today
      };
    });
  };

  // 6. Economy Actions
  const deductCoins = (amount) => {
    if (profile.papaPoints < amount) return false;
    
    updateProfile(prev => ({
      ...prev,
      papaPoints: prev.papaPoints - amount
    }));
    return true;
  };

  // 7. Theme Purchases
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

  return {
    profile,
    isLoaded,
    applyClassicResult,
    addDailyRewards,
    deductCoins,
    applyOnlineResults,
    purchaseTheme,
    showLevelUp,
    setShowLevelUp,
    convertGhostToUser
  };
}