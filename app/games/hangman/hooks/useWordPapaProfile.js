"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  calculateLevel,
  getClassicRewards,
  getOnlineMatchRewards,
  getArenaUnlockBonus,
} from "../lib/progression";

const STORAGE_KEY = "wordpapa_profile";
const MAX_LIVES = 10;
const RECOVERY_MS = 3 * 60 * 60 * 1000;

const INITIAL_STATE = {
  name: "Player",
  userEmail: null,
  isGhost: true,
  xp: 0,
  papaPoints: 50,
  lives: MAX_LIVES,
  lastLifeLost: Date.now(),
  totalWordsSolved: 0,
  currentStreak: 0,
  highestStreak: 0,
  highestEndlessRun: 0,
  highestEndlessXP: 0,
  totalEndlessXP: 0,
  onlineWinStreak: 0,
  highestWinStreak: 0,
  dailyStreak: 0,
  lastDailyDate: null,
  unlockedThemes: ["classic"],
  currentTheme: "classic",
};

export function useWordPapaProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(INITIAL_STATE);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ref to track if we've already performed the initial auth sync to avoid loops
  const hasSyncedAuth = useRef(false);

  // --- 1. Sync local state with provided data ---
  const updateLocalProfile = useCallback((newProfileData) => {
    setProfile((prev) => {
      const merged = { ...prev, ...newProfileData };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    });
  }, []);

  // --- 2. Database Sync Helper (Push to Cloud) ---
  const syncToRemoteDB = useCallback(async (profileData) => {
    try {
      await fetch("/api/games/hangman/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
    } catch (err) {
      console.error("Failed to sync to DB:", err);
    }
  }, []);

  // --- 3. Auth Effect: The Sync/Migration Engine ---
  useEffect(() => {
    const syncWithAuth = async () => {
      // Only run when authenticated and only once per session
      if (
        status === "authenticated" &&
        session?.user &&
        !hasSyncedAuth.current
      ) {
        try {
          // 1. Check if user has an existing profile in Online DB
          const res = await fetch("/api/games/hangman/sync");
          const data = await res.json();

          // 2. Get the current progress from Local Storage (Ghost data)
          const saved = localStorage.getItem(STORAGE_KEY);
          const localData = saved ? JSON.parse(saved) : profile;

          if (data.success && data.profile) {
            /**
             * CASE: RETURNING USER
             * We prioritize the Database data. This overrides the local Ghost data
             * to ensure the user is back where they left off on their account.
             */
            const syncedProfile = {
              ...data.profile,
              name: session.user.name || data.profile.name || "Player",
              userEmail: session.user.email,
              isGhost: false, // Explicitly false now that they are logged in
            };

            updateLocalProfile(syncedProfile);
          } else {
            /**
             * CASE: NEW USER / FIRST LOGIN
             * We take the progress they made as a "Ghost" and save it to the DB.
             */
            const newCloudProfile = {
              ...localData,
              name: session.user.name || "Player",
              userEmail: session.user.email,
              isGhost: false, // Turn off ghost mode
            };

            updateLocalProfile(newCloudProfile);
            await syncToRemoteDB(newCloudProfile);
          }

          hasSyncedAuth.current = true;
        } catch (err) {
          console.error("Auth Sync Error:", err);
        }
      }
    };
    syncWithAuth();
  }, [status, session, profile, updateLocalProfile, syncToRemoteDB]);

  // --- 4. Initial Load & Life Recovery Logic ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();

        let updatedLives = parsed.lives ?? MAX_LIVES;
        let lastLifeTimestamp = parsed.lastLifeLost ?? now;

        // Calculate life recovery
        if (updatedLives < MAX_LIVES) {
          const timePassed = now - lastLifeTimestamp;
          const recovered = Math.floor(timePassed / RECOVERY_MS);

          if (recovered > 0) {
            updatedLives = Math.min(MAX_LIVES, updatedLives + recovered);
            lastLifeTimestamp =
              updatedLives === MAX_LIVES
                ? now
                : lastLifeTimestamp + recovered * RECOVERY_MS;
          }
        }

        setProfile((prev) => ({
          ...INITIAL_STATE,
          ...parsed,
          lives: updatedLives,
          lastLifeLost: lastLifeTimestamp,
        }));
      } catch (e) {
        console.error("Failed to parse local profile", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // --- 5. Internal Update Logic (Handles Level Ups) ---
  const updateProfile = useCallback((updateFn) => {
    setProfile((prev) => {
      const newProfile = updateFn(prev);
      const oldRank = calculateLevel(prev.xp);
      const newRank = calculateLevel(newProfile.xp);

      // Check for Level Up
      if (newRank.level > oldRank.level) {
        setShowLevelUp(true);
        const arenaBonus = getArenaUnlockBonus(newRank.level);
        if (arenaBonus > 0) {
          newProfile.papaPoints += arenaBonus;
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      }
      return newProfile;
    });
  }, []);

  // --- 6. Game Actions ---
  const applyClassicResult = (isWin) => {
    updateProfile((prev) => {
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
        totalWordsSolved: isWin
          ? (prev.totalWordsSolved || 0) + 1
          : prev.totalWordsSolved,
        currentStreak: newStreak,
        highestStreak: Math.max(prev.highestStreak, newStreak),
        lives: newLives,
        lastLifeLost: newLastLifeLost,
      };
    });
  };

  const applyEndlessResult = (snapshot) => {
    updateProfile((prev) => {
      const runXpEarned = Math.max(0, (snapshot.xp || 0) - (prev.xp || 0));
      return {
        ...prev,
        ...snapshot,
        totalEndlessXP: (prev.totalEndlessXP || 0) + runXpEarned,
      };
    });
  };

  const applyOnlineResults = (isWinner) => {
    updateProfile((prev) => {
      const outcome = getOnlineMatchRewards(isWinner, prev.onlineWinStreak);
      const newWinStreak = outcome.shouldResetStreak
        ? 0
        : prev.onlineWinStreak + 1;

      return {
        ...prev,
        xp: Math.max(0, prev.xp + outcome.xpChange),
        papaPoints: prev.papaPoints + outcome.coinChange,
        onlineWinStreak: newWinStreak,
        highestWinStreak: Math.max(prev.highestWinStreak || 0, newWinStreak),
      };
    });
  };

  const addDailyRewards = (xp, coins) => {
    updateProfile((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      return {
        ...prev,
        xp: prev.xp + xp,
        papaPoints: prev.papaPoints + coins,
        totalWordsSolved: (prev.totalWordsSolved || 0) + 1,
        dailyStreak: (prev.dailyStreak || 0) + 1,
        lastDailyDate: today,
      };
    });
  };

  const deductCoins = (amount) => {
    let success = false;
    updateProfile((prev) => {
      if (prev.papaPoints >= amount) {
        success = true;
        return { ...prev, papaPoints: prev.papaPoints - amount };
      }
      return prev;
    });
    return success;
  };

  const purchaseTheme = (themeId, price) => {
    let success = false;
    updateProfile((prev) => {
      if (prev.papaPoints >= price && !prev.unlockedThemes.includes(themeId)) {
        success = true;
        return {
          ...prev,
          papaPoints: prev.papaPoints - price,
          unlockedThemes: [...prev.unlockedThemes, themeId],
          currentTheme: themeId,
        };
      }
      return prev;
    });
    return success;
  };

  return {
    profile,
    isLoaded,
    applyClassicResult,
    applyEndlessResult,
    addDailyRewards,
    deductCoins,
    applyOnlineResults,
    purchaseTheme,
    showLevelUp,
    setShowLevelUp,
    updateLocalProfile,
  };
}
