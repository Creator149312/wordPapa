"use client";

import { useState, useMemo, useEffect } from "react";
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
import { RANKS } from "./constants";

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
  // Inside Hangman.js
  const [leaderboardData, setLeaderboardData] = useState([]);


  // 1. MASTER RANK CALCULATION
  // This drives the "Color Sweep" across all components
  const currentRank = useMemo(() => {
    return (
      RANKS.find(
        (r) =>
          profile.xp >= r.minXP &&
          profile.xp < (RANKS[RANKS.indexOf(r) + 1]?.minXP || Infinity),
      ) || RANKS[0]
    );
  }, [profile.xp]);

  const syncToDatabase = async (updatedProfile) => {
    if (profile.isGhost) return;
    try {
      const response = await fetch("/api/game/hangman/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      const data = await response.json();
      if (data.success && updateLocalProfile) {
        updateLocalProfile(data.profile);
      }
    } catch (error) {
      console.error("DB Sync failed:", error);
    }
  };


  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/game/hangman/leaderboard");
      const data = await res.json();
      if (data.success) setLeaderboardData(data.leaderboard);
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
      if (profile.papaPoints < ONLINE_REQUIREMENTS.MIN_COINS)
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

  // Trigger fetch when component mounts or returns to menu
  useEffect(() => {
    if (gameState === "menu") fetchLeaderboard();
  }, [gameState]);

  // --- VIEW: MENU / LOBBY ---
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
            leaderboard={leaderboardData}
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

  // --- VIEW: ACTIVE GAMEPLAY (COLOR SWEEP ENABLED) ---
  return (
    <div className="min-h-screen p-1 md:p-4 bg-white dark:bg-zinc-950 transition-colors duration-1000">

      <Card className="max-w-5xl w-full mx-auto mt-4 p-3 md:p-6 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden border-none shadow-none">

        {/* THE COLOR SWEEP GLOW */}
        {/* This element transitions its background color smoothly as the rank changes */}
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
              accent={currentRank.color} // Passing the master color
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
              // CRITICAL: We pass the Rank color to keep all internal animations in sync
              accent={currentRank.color}
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
            />
          )}
        </div>
      </Card>

      {/* The Modal handles the "Flash" and the "Identity Shift" confirmation */}
      <LevelUpModal
        isOpen={showLevelUp}
        rank={currentRank}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
}