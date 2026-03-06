'use client'
import { calculateLevel } from '../lib/progression'; // Ensure this path is correct (@ vs @/lib)
import { useState, useEffect } from 'react';

export function useWordPapaProfile() {
  const [profile, setProfile] = useState({
    xp: 0,
    papaPoints: 0,
    unlockedThemes: ['classic'],
    currentTheme: 'classic',
    lastDailyDone: null
  });

  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wordpapa_profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const saveAndSet = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('wordpapa_profile', JSON.stringify(newProfile));
  };

  const addWin = (mode, difficulty = 1) => {
    const xpGain = mode === 'blitz' ? 50 : 20;
    
    // Use the current state value directly to avoid closure staling
    const currentXP = profile.xp;
    const oldRank = calculateLevel(currentXP);
    
    const newXP = currentXP + (xpGain * difficulty);
    const newRank = calculateLevel(newXP);

    const newProfile = {
      ...profile,
      xp: newXP,
      papaPoints: profile.papaPoints + (mode === 'blitz' ? 10 : 5)
    };

    saveAndSet(newProfile);

    // Trigger check
    if (newRank.name !== oldRank.name) {
      setShowLevelUp(true);
    }
  };

  const selectTheme = (themeId) => {
    if (profile.unlockedThemes.includes(themeId)) {
      saveAndSet({ ...profile, currentTheme: themeId });
    }
  };

  const purchaseTheme = (themeId, price) => {
    if (profile.papaPoints >= price && !profile.unlockedThemes.includes(themeId)) {
      const newProfile = {
        ...profile,
        papaPoints: profile.papaPoints - price,
        unlockedThemes: [...profile.unlockedThemes, themeId],
        currentTheme: themeId 
      };
      saveAndSet(newProfile);
      return true;
    }
    return false;
  };

  // MUST return these so Hangman.js can use them!
  return { 
    profile, 
    addWin, 
    selectTheme, 
    purchaseTheme, 
    showLevelUp, 
    setShowLevelUp 
  };
}