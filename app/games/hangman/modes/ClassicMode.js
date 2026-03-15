"use client";
import { useState, useEffect, useMemo, useRef } from "react";

// Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import GameResults from "../components/GameResults";
import DynamicPapa from "../components/DynamicPapa";
import GameTransitionOverlay from "../components/GameTransitionOverlay";

// Hooks & Logic
import { useGameLogic } from "../hooks/useGameLogic";
import {
  getClassicRewards,
  getArenaUnlockBonus,
  calculateLevel,
} from "../lib/progression";
import { RANKS, ARENAS } from "../constants";

export default function ClassicMode({
  profile,
  onQuit,
  applyClassicResult,
  syncToDatabase,
  triggerSavePrompt,
}) {
  const [hasClaimedResult, setHasClaimedResult] = useState(false);

  const [sessionSnapshot, setSessionSnapshot] = useState({
    streak: 0,
    totalXP: 0,
    totalCoins: 0,
  });

  const syncLock = useRef(false);

  const currentRank = useMemo(() => {
    return (
      RANKS.find(
        (r) =>
          profile.xp >= r.minXP &&
          profile.xp < (RANKS[RANKS.indexOf(r) + 1]?.minXP || Infinity),
      ) || RANKS[0]
    );
  }, [profile.xp]);

  const activeArena = useMemo(
    () => ARENAS[currentRank.arenaId] || ARENAS[1],
    [currentRank],
  );

  const {
    currentGame,
    guessedLetters,
    setGuessedLetters,
    isTransitioning,
    wordLetters,
    wrongGuesses,
    isLost,
    isWon,
    initGameSession,
  } = useGameLogic(null, profile.xp);

  useEffect(() => {
    if (!currentGame && !isTransitioning) {
      initGameSession("classic");
    }
  }, []);

  const isGameOver = isWon || isLost;

  // --- GHOST USER PROMPT LOGIC ---
  useEffect(() => {
    if (isLost && profile.isGhost && hasClaimedResult) {
      const timer = setTimeout(() => {
        if (typeof triggerSavePrompt === "function") triggerSavePrompt();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLost, profile.isGhost, hasClaimedResult, triggerSavePrompt]);

  const handleGuess = (letter) => {
    const L = letter.toUpperCase();
    if (
      guessedLetters.includes(L) ||
      isGameOver ||
      isTransitioning ||
      !currentGame
    )
      return;
    setGuessedLetters((prev) => [...prev, L]);
  };

  const startNewGame = (resetToMenu = false) => {
    if (resetToMenu && !isGameOver) {
      applyClassicResult(false);
    }

    if (resetToMenu) {
      onQuit();
    } else {
      if (isLost) {
        setSessionSnapshot({ streak: 0, totalXP: 0, totalCoins: 0 });
      }
      initGameSession("classic");
      setGuessedLetters([]);
      setHasClaimedResult(false);
      syncLock.current = false;
    }
  };

  useEffect(() => {
    if (isGameOver && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;
      let updatedProfile = { ...profile };
      let earnedXP = 0;
      let earnedCoins = 0;
      let levelUpBonus = 0;
      let newStreak = 0;

      if (isWon) {
        const rewards = getClassicRewards(profile.currentStreak + 1);
        const streakBonus = Math.floor((profile.currentStreak + 1) / 5) * 2;
        earnedXP = rewards.xpGain + streakBonus;
        earnedCoins = rewards.coinGain;
        newStreak = profile.currentStreak + 1;

        setSessionSnapshot((prev) => ({
          streak: newStreak,
          totalXP: prev.totalXP + earnedXP,
          totalCoins: prev.totalCoins + earnedCoins,
        }));

        applyClassicResult(true);
      } else {
        earnedXP = profile.currentStreak > 0 ? 0 : -5;
        newStreak = 0;
        setSessionSnapshot((prev) => ({ ...prev, streak: 0 }));

        updatedProfile.lives = Math.max(0, profile.lives - 1);
        updatedProfile.lastLifeLost = new Date();
        applyClassicResult(false);
      }

      const oldLevel = calculateLevel(profile.xp).level;
      const newXPTotal = Math.max(0, profile.xp + earnedXP);
      const newLevel = calculateLevel(newXPTotal).level;

      if (newLevel > oldLevel) {
        for (let i = oldLevel + 1; i <= newLevel; i++) {
          levelUpBonus += 100 * i;
        }
        setSessionSnapshot((prev) => ({
          ...prev,
          totalCoins: prev.totalCoins + levelUpBonus,
        }));
      }

      updatedProfile = {
        ...updatedProfile,
        xp: newXPTotal,
        papaPoints: profile.papaPoints + earnedCoins + levelUpBonus,
        currentStreak: newStreak,
        highestStreak: Math.max(profile.highestStreak, newStreak),
      };

      if (!profile.isGhost) syncToDatabase(updatedProfile);
      setHasClaimedResult(true);
    }
  }, [isGameOver, isWon]);

  return (
    <div className="flex flex-col space-y-4">
      <GameHeader
        gameMode="classic"
        category={currentGame?.category || "Loading..."}
        onQuit={() => startNewGame(true)}
        currentArena={activeArena}
        wrongCount={wrongGuesses.length}
        maxTries={currentRank.maxTries}
        streak={
          hasClaimedResult ? sessionSnapshot.streak : profile.currentStreak
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="py-3 flex justify-center bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl min-h-[100px]">
            {currentGame ? (
              <WordDisplay
                wordLetters={wordLetters}
                guessedLetters={guessedLetters}
                isLost={isLost}
                isWon={isWon}
              />
            ) : (
              <div className="flex items-center gap-2 text-zinc-400 font-black animate-pulse">
                GENERATING WORD...
              </div>
            )}
          </div>

          <div className="min-h-[180px]">
            {!hasClaimedResult ? (
              <VirtualKeyboard
                guessedLetters={guessedLetters}
                wordLetters={wordLetters}
                onGuess={handleGuess}
                disabled={isTransitioning || !currentGame}
              />
            ) : (
              <GameResults
                isWon={isWon}
                word={currentGame?.word}
                mode="classic"
                onRestart={() => startNewGame(false)}
                streak={sessionSnapshot.streak}
                xpEarned={sessionSnapshot.totalXP}
                coinsEarned={sessionSnapshot.totalCoins}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex justify-center">
          <DynamicPapa
            wrongCount={wrongGuesses.length}
            isWon={isWon}
            isLost={isLost}
            maxTries={currentRank.maxTries}
            arenaId={currentRank.arenaId}
            streak={
              hasClaimedResult ? sessionSnapshot.streak : profile.currentStreak
            }
          />
        </div>
      </div>
      {isTransitioning && <GameTransitionOverlay />}
    </div>
  );
}
