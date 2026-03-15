"use client";
import { useState, useEffect, useMemo, useRef } from "react";

// Shared Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import GameResults from "../components/GameResults";
import DynamicPapa from "../components/DynamicPapa";

// Hooks & Lib
import { useGameLogic } from "../hooks/useGameLogic";
import { calculateLevel } from "../lib/progression";
import { RANKS, ARENAS } from "../constants";

export default function DailyMode({
  dailyWord,
  profile,
  onDailyComplete,
  syncToDatabase,
  addDailyRewards,
  triggerSavePrompt, // Received from Hangman.js or Daily Page
}) {
  const [hasClaimedResult, setHasClaimedResult] = useState(false);
  const [sessionSnapshot, setSessionSnapshot] = useState({
    streak: 0,
    totalXP: 0,
    totalCoins: 0,
  });
  const syncLock = useRef(false);

  // Safety: Fallback if profile isn't loaded yet
  const userXP = profile?.xp || 0;

  const currentRank = useMemo(() => {
    return (
      RANKS.find(
        (r) =>
          userXP >= r.minXP &&
          userXP < (RANKS[RANKS.indexOf(r) + 1]?.minXP || Infinity),
      ) || RANKS[0]
    );
  }, [userXP]);

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
  } = useGameLogic(dailyWord, userXP);

  // --- GHOST USER PROMPT LOGIC ---
  // Triggered when a guest wins the Daily Challenge
  useEffect(() => {
    if (isWon && profile?.isGhost && hasClaimedResult) {
      const timer = setTimeout(() => {
        if (typeof triggerSavePrompt === "function") triggerSavePrompt();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isWon, profile?.isGhost, hasClaimedResult, triggerSavePrompt]);

  const handleGuess = (letter) => {
    const L = letter.toUpperCase();
    if (guessedLetters.includes(L) || isWon || isLost || isTransitioning)
      return;
    setGuessedLetters((prev) => [...prev, L]);
  };

  // Logic to process rewards and sync
  useEffect(() => {
    if ((isWon || isLost) && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;

      let earnedXP = 0;
      let earnedCoins = 0;
      let newDailyStreak = profile?.dailyStreak || 0;

      if (isWon) {
        earnedXP = 50;
        earnedCoins = 20;
        newDailyStreak += 1;

        setSessionSnapshot({
          streak: newDailyStreak,
          totalXP: earnedXP,
          totalCoins: earnedCoins,
        });

        if (typeof addDailyRewards === "function") {
          addDailyRewards(earnedXP, earnedCoins);
        }

        if (typeof onDailyComplete === "function") {
          onDailyComplete();
        }
      }

      const updatedProfile = {
        ...profile,
        xp: (profile?.xp || 0) + earnedXP,
        papaPoints: (profile?.papaPoints || 0) + earnedCoins,
        dailyStreak: newDailyStreak,
      };

      if (!profile?.isGhost && typeof syncToDatabase === "function") {
        syncToDatabase(updatedProfile);
      }

      setHasClaimedResult(true);
    }
  }, [
    isWon,
    isLost,
    hasClaimedResult,
    profile,
    syncToDatabase,
    addDailyRewards,
    onDailyComplete,
  ]);

  return (
    <div className="flex flex-col space-y-4">
      <GameHeader
        gameMode="daily"
        category="Daily Challenge"
        onQuit={() => (window.location.href = "/games/hangman")}
        currentArena={activeArena}
        wrongCount={wrongGuesses.length}
        maxTries={currentRank.maxTries}
        streak={profile?.dailyStreak || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="py-3 flex justify-center bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl min-h-[100px]">
            {wordLetters.length > 0 ? (
              <WordDisplay
                wordLetters={wordLetters}
                guessedLetters={guessedLetters}
                isLost={isLost}
                isWon={isWon}
              />
            ) : (
              <div className="text-zinc-400 font-black animate-pulse">
                PREPARING CHALLENGE...
              </div>
            )}
          </div>

          <div className="min-h-[180px]">
            {!hasClaimedResult ? (
              <VirtualKeyboard
                guessedLetters={guessedLetters}
                wordLetters={wordLetters}
                onGuess={handleGuess}
                disabled={isTransitioning}
              />
            ) : (
              <GameResults
                isWon={isWon}
                word={currentGame?.word}
                mode="daily"
                streak={sessionSnapshot.streak}
                xpEarned={sessionSnapshot.totalXP}
                coinsEarned={sessionSnapshot.totalCoins}
                onRestart={() => (window.location.href = "/games/hangman")}
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
            streak={profile?.dailyStreak || 0}
          />
        </div>
      </div>
    </div>
  );
}
