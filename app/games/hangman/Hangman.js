"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";

// UI Components
import LevelBar from "./components/LevelBar";
import GameLobbyView from "./components/GameLobbyView";
import LevelUpModal from "./components/LevelUpModal";
import SaveProgressModal from "./components/SaveProgressModal";

// Segregated Modes
import ClassicMode from "./modes/ClassicMode";
import OnlineMode from "./modes/OnlineMode";
import DailyMode from "./modes/DailyMode";

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
  } = useProfile();

  const [gameMode, setGameMode] = useState(initialMode);
  const [gameState, setGameState] = useState(initialMode ? "playing" : "menu");
  const [showSavePrompt, setShowSavePrompt] = useState(false);

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
    // Trigger prompt if they are a guest when returning to menu
    if (profile.isGhost) setShowSavePrompt(true);
  };

  if (gameState === "menu" || gameState === "lobby") {
    return (
      <GameLobbyView
        gameState={gameState}
        handleModeSelect={handleModeSelect}
        profile={profile}
        requirements={ONLINE_REQUIREMENTS}
        socket={socket}
        startNewGame={() => setGameState("playing")}
      />
    );
  }

  return (
    <div className="min-h-screen p-1 md:p-4 bg-white dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-5xl mx-auto mb-2">
        <LevelBar />
      </div>

      <Card className="max-w-5xl w-full mx-auto p-3 md:p-6 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/40 relative overflow-hidden border-none shadow-none">
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 blur-[80px] opacity-10 pointer-events-none"
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
            />
          )}

          {gameMode === "classic" && (
            <ClassicMode
              profile={profile}
              onQuit={handleQuitToMenu}
              applyClassicResult={applyClassicResult}
              syncToDatabase={syncToDatabase}
              triggerSavePrompt={() => setShowSavePrompt(true)}
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
            />
          )}
        </div>
      </Card>

      <LevelUpModal
        isOpen={showLevelUp}
        rank={currentRank}
        onClose={() => setShowLevelUp(false)}
      />

      <SaveProgressModal
        isOpen={showSavePrompt}
        onClose={() => setShowSavePrompt(false)}
        xp={profile.xp}
        points={profile.papaPoints}
      />
    </div>
  );
}
