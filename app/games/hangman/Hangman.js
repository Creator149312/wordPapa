"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";

// UI Components
import GameClientHeader from "./GameClientHeader";
import LevelBar from "./components/LevelBar";
import GameLobbyView from "./components/GameLobbyView";
import SaveProgressModal from "./components/SaveProgressModal";

// Segregated Modes
import ClassicMode from "./modes/ClassicMode";
import OnlineMode from "./modes/OnlineMode";
import DailyMode from "./modes/DailyMode";
import EndlessRunMode from "./modes/EndlessRunMode";

// Hooks & Logic
import { useProfile } from "./../../ProfileContext";
import { useHangmanSocket } from "./hooks/useHangmanSocket";
import { calculateLevel } from "./lib/progression";

const ONLINE_REQUIREMENTS = { MIN_XP: 0, MIN_COINS: 10 };

export default function Hangman({
  initialMode = null,
  dailyWord = null,
  onDailyComplete = null,
}) {
  const {
    profile,
    isLoaded,
    applyClassicResult,
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

  const currentRank = useMemo(() => {
    return calculateLevel(profile.xp || 0);
  }, [profile.xp]);

  const calculateEarnedXP = useCallback(
    (mistakes) => Math.max(0, 100 - mistakes * 5),
    [],
  );

  /**
   * syncToDatabase
   * Handles pushing mid-game or end-game results to the cloud.
   * If the user is a Ghost, it skips the network call (local storage handles it).
   */
  const syncToDatabase = useCallback(
    async (updatedSnapshot) => {
      // Ghost users only sync locally via the ProfileContext actions
      if (profile.isGhost) return;

      try {
        const response = await fetch("/api/games/hangman/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSnapshot),
        });
        const data = await response.json();

        // Update local context with fresh data from DB (ensures $max logic is reflected)
        if (data.success && data.profile) {
          updateLocalProfile(data.profile);
        }
      } catch (error) {
        console.error("Hangman DB Sync failed:", error);
      }
    },
    [profile.isGhost, updateLocalProfile],
  );

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
    if (mode === "classic" && (profile.lives || 0) <= 0) {
      return alert(`❤️ Out of fuel! Wait for recovery or play Endless Mode.`);
    }

    if (mode === "online") {
      if ((profile.papaPoints || 0) < ONLINE_REQUIREMENTS.MIN_COINS)
        return alert(`💰 Not enough coins for the entry fee!`);
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

    // Trigger save prompt if ghost has made significant progress
    if (profile.isGhost && (profile.xp > 50 || profile.papaPoints > 100)) {
      setShowSavePrompt(true);
    }
  };

  useEffect(() => {
    if (gameState === "menu") fetchLeaderboard();
  }, [gameState]);

  // Prevent UI flickering or "ghosting" while the profile sync is resolving
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-500"></div>
      </div>
    );
  }

  if (gameState === "menu" || gameState === "lobby") {
    return (
      <div className="flex flex-col w-full transition-colors duration-1000">
        {/* <GameClientHeader /> */}
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

  return (
    <div className="min-h-screen p-1 md:p-4 bg-white dark:bg-zinc-950 transition-colors duration-1000">
      <Card className="max-w-5xl w-full mx-auto mt-2 p-3 md:p-6 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden border-none shadow-none">
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
    </div>
  );
}
