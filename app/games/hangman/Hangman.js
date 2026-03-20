"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";

// UI Components
import GameClientHeader from "./GameClientHeader";
import LevelBar from "./components/LevelBar";
import GameLobbyView from "./components/GameLobbyView";
import LevelUpModal from "./components/LevelUpModal";
import SaveProgressModal from "./components/SaveProgressModal";

// Segregated Modes
import ClassicMode from "./modes/ClassicMode";
import OnlineMode from "./modes/OnlineMode";
import DailyMode from "./modes/DailyMode";
import EndlessRunMode from "./modes/EndlessRunMode";

// Hooks & Logic
import { useProfile } from "./../../ProfileContext";
import { useHangmanSocket } from "./hooks/useHangmanSocket";
import { RANKS, WORDS_POOL } from "./constants";

const ONLINE_REQUIREMENTS = { MIN_XP: 0, MIN_COINS: 10 };

export default function Hangman({
  initialMode = null,
  dailyWord = null,
  onDailyComplete = null,
}) {
  const {
    profile,
    applyClassicResult,
    showLevelUp,
    setShowLevelUp,
    deductCoins,
    applyOnlineResults,
    addDailyRewards,
    updateLocalProfile,
    applyEndlessResult,
  } = useProfile();

  const [gameMode, setGameMode] = useState(initialMode);
  const [gameState, setGameState] = useState(initialMode ? "playing" : "menu");
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [leaderboards, setLeaderboards] = useState({ global: [], endless: [] });

  // --- 1. UPDATED RANK LOGIC ---
  // Now uses highestEndlessXP as the primary driver for Rank/Title
  const currentRank = useMemo(() => {
    return (
      [...RANKS]
        .reverse()
        .find((r) => (profile.highestEndlessXP || 0) >= r.minXP) || RANKS[0]
    );
  }, [profile.highestEndlessXP]);

  // Master Selector Logic (Weighting Level Number)
  const getNextWeightedWord = useCallback((userLevel, usedWords = []) => {
    const safeLevel = Math.max(1, Math.min(userLevel, 10));
    let levelPickerPool = [];

    for (let lvl = 1; lvl <= safeLevel; lvl++) {
      for (let i = 0; i < lvl; i++) {
        levelPickerPool.push(lvl);
      }
    }

    const selectedLevel =
      levelPickerPool[Math.floor(Math.random() * levelPickerPool.length)];
    let levelWords = WORDS_POOL[selectedLevel] || WORDS_POOL[1];

    let availableWords = levelWords.filter(
      (item) => !usedWords.includes(item.word),
    );

    if (availableWords.length === 0) availableWords = levelWords;

    const chosenEntry =
      availableWords[Math.floor(Math.random() * availableWords.length)];
    return { ...chosenEntry, wordLevel: selectedLevel };
  }, []);

  const calculateEarnedXP = useCallback(
    (mistakes) => Math.max(0, 100 - mistakes * 5),
    [],
  );

  // --- 2. UPDATED SYNC LOGIC ---
  // Points to the new /api/profile/sync and handles the updated snapshot keys
  const syncToDatabase = async (updatedSnapshot) => {
    if (profile.isGhost) return;

    try {
      const response = await fetch("/api/games/hangman/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSnapshot),
      });

      const data = await response.json();
      if (data.success && updateLocalProfile) {
        updateLocalProfile(data.profile);
      }
    } catch (error) {
      console.error("Hangman DB Sync failed:", error);
    }
  };

  // --- 3. UPDATED LEADERBOARD FETCH ---
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/games/hangman/leaderboard");
      const data = await res.json();
      if (data.success) {
        setLeaderboards({
          global: data.global || [],
          endless: data.endless || [],
        });
      }
    } catch (err) {
      console.error("Leaderboard fetch failed", err);
    }
  };

  const { joinQueue, disconnect, socket } = useHangmanSocket({
    profile,
    deductCoins,
    setGameState,
    applyOnlineResults,
  });

  const handleModeSelect = (mode) => {
    if (mode === "classic" && profile.lives <= 0)
      return alert(`❤️ Out of lives!`);

    if (mode === "online") {
      if ((profile.papaPoints || 0) < ONLINE_REQUIREMENTS.MIN_COINS)
        return alert(`💰 Not enough coins!`);
      setGameMode(mode);
      joinQueue();
      setGameState("lobby");
    } else {
      setGameMode(mode);
      setGameState("playing");
    }
  };

  const handleQuitToMenu = () => {
    disconnect();
    setGameMode(null);
    setGameState("menu");
    if (profile.isGhost) setShowSavePrompt(true);
  };

  useEffect(() => {
    if (gameState === "menu") fetchLeaderboard();
  }, [gameState]);

  // LOBBY / MENU VIEW
  if (gameState === "menu" || gameState === "lobby") {
    return (
      <div className="flex flex-col w-full transition-colors duration-1000">
        <GameClientHeader />
        <div className="max-w-5xl w-full mx-auto px-1 md:px-4">
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <LevelBar />
          </div>
          <GameLobbyView
            gameState={gameState}
            leaderboard={leaderboards}
            handleModeSelect={handleModeSelect}
            profile={profile}
            requirements={ONLINE_REQUIREMENTS}
            socket={socket}
            startNewGame={() => setGameState("playing")}
          />
        </div>
        <SaveProgressModal
          isOpen={showSavePrompt}
          onClose={() => setShowSavePrompt(false)}
          xp={profile.xp}
          points={profile.papaPoints}
        />
      </div>
    );
  }

  // ACTIVE GAMEPLAY VIEW
  return (
    <div className="min-h-screen p-1 md:p-4 bg-white dark:bg-zinc-950 transition-colors duration-1000">
      <Card className="max-w-5xl w-full mx-auto mt-4 p-3 md:p-6 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden border-none shadow-none">
        {/* Decorative Rank Glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: currentRank.color }}
        />

        <div className="relative z-10">
          {gameMode === "online" && (
            <OnlineMode
              profile={profile}
              onQuit={handleQuitToMenu}
              applyOnlineResults={applyOnlineResults}
              syncToDatabase={syncToDatabase}
              triggerSavePrompt={() => setShowSavePrompt(true)}
              accent={currentRank.color}
              getWord={getNextWeightedWord}
              calculateXP={calculateEarnedXP}
            />
          )}
          {gameMode === "endless" && (
            <EndlessRunMode
              profile={profile}
              onQuit={handleQuitToMenu}
              applyEndlessResult={applyEndlessResult}
              syncToDatabase={syncToDatabase}
              triggerSavePrompt={() => setShowSavePrompt(true)}
              deductCoins={deductCoins}
              accent={currentRank.color}
              getWord={getNextWeightedWord}
              calculateXP={calculateEarnedXP}
            />
          )}
          {gameMode === "classic" && (
            <ClassicMode
              profile={profile}
              onQuit={handleQuitToMenu}
              applyClassicResult={applyClassicResult}
              syncToDatabase={syncToDatabase}
              triggerSavePrompt={() => setShowSavePrompt(true)}
              accent={currentRank.color}
              getWord={getNextWeightedWord}
              calculateXP={calculateEarnedXP}
            />
          )}
          {gameMode === "daily" && (
            <DailyMode
              dailyWord={dailyWord}
              profile={profile}
              onDailyComplete={onDailyComplete}
              syncToDatabase={syncToDatabase}
              addDailyRewards={addDailyRewards}
              triggerSavePrompt={() => setShowSavePrompt(true)}
              accent={currentRank.color}
              calculateXP={calculateEarnedXP}
            />
          )}
        </div>
      </Card>

      <LevelUpModal
        isOpen={showLevelUp}
        rank={currentRank}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
}
