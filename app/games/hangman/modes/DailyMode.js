"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

// Shared Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import GameResults from "../components/GameResults";
import DynamicPapa from "../components/DynamicPapa";

// Hooks & Lib
import { useGameLogic } from "../hooks/useGameLogic";
import { useAudio } from "../hooks/useAudio";
import { RANKS, ARENAS } from "../constants";

export default function DailyMode({
  dailyWord,
  dayNumber, // New Prop
  profile,
  onDailyComplete,
  syncToDatabase,
  addDailyRewards,
  triggerSavePrompt,
}) {
  const [hasClaimedResult, setHasClaimedResult] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [sessionSnapshot, setSessionSnapshot] = useState({
    streak: 0,
    totalXP: 0,
    totalCoins: 0,
  });

  const { playSynth } = useAudio();
  const syncLock = useRef(false);
  const prevWrongCount = useRef(0);

  const userXP = profile?.xp || 0;

  // 1. RANK & ARENA LOGIC
  const currentRank = useMemo(() => {
    return [...RANKS].reverse().find((r) => userXP >= r.minXP) || RANKS[0];
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

  // 2. JUICE: SHAKE ON MISTAKE
  useEffect(() => {
    if (wrongGuesses.length > prevWrongCount.current) {
      playSynth("POP");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      prevWrongCount.current = wrongGuesses.length;
    }
  }, [wrongGuesses, playSynth]);

  // 3. REWARDS & SYNCING
  useEffect(() => {
    if ((isWon || isLost) && !hasClaimedResult && !syncLock.current) {
      syncLock.current = true;

      const attempts = wrongGuesses.length;
      const max = currentRank.maxTries;

      // --- GENERATE SHAREABLE EMOJI GRID ---
      // 🟩 = Correct Word, 🟥 = Mistakes made, ⬛ = Remaining lives
      const grid =
        "🟩".repeat(wordLetters.length) +
        "\n" +
        "🟥".repeat(attempts) +
        "⬛".repeat(Math.max(0, max - attempts));

      const stats = {
        won: isWon,
        attempts: attempts,
        maxAttempts: max,
        grid: grid,
      };

      let earnedXP = 0;
      let earnedCoins = 0;
      let newDailyStreak = profile?.dailyStreak || 0;

      if (isWon) {
        playSynth("MILESTONE");
        earnedXP = 150;
        earnedCoins = 50;
        newDailyStreak += 1;

        setSessionSnapshot({
          streak: newDailyStreak,
          totalXP: earnedXP,
          totalCoins: earnedCoins,
        });

        if (addDailyRewards) addDailyRewards(earnedXP, earnedCoins);
      } else {
        playSynth("GAMEOVER");
        setSessionSnapshot((prev) => ({ ...prev, streak: 0 })); // Reset streak on loss
      }

      // Sync Profile
      const updatedProfile = {
        ...profile,
        xp: (profile?.xp || 0) + earnedXP,
        papaPoints: (profile?.papaPoints || 0) + earnedCoins,
        dailyStreak: isWon ? newDailyStreak : 0,
      };

      if (!profile?.isGhost && syncToDatabase) {
        syncToDatabase(updatedProfile);
      }

      // IMPORTANT: Pass stats back to /daily/page.js
      if (onDailyComplete) onDailyComplete(stats);

      setHasClaimedResult(true);

      if (profile?.isGhost && isWon && triggerSavePrompt) {
        setTimeout(() => triggerSavePrompt(), 1500);
      }
    }
  }, [
    isWon,
    isLost,
    hasClaimedResult,
    profile,
    syncToDatabase,
    addDailyRewards,
    onDailyComplete,
    playSynth,
    triggerSavePrompt,
    currentRank.maxTries,
    wordLetters.length,
    wrongGuesses.length,
  ]);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || isWon || isLost || isTransitioning)
      return;
    if (wordLetters.includes(letter)) playSynth("CORRECT");
    setGuessedLetters((prev) => [...prev, letter]);
  };

  return (
    <div className="flex flex-col space-y-4">
      <GameHeader
        gameMode="daily"
        category={`Challenge #${dayNumber || "?"}`}
        onQuit={() => (window.location.href = "/games/hangman")}
        playerRank={currentRank}
        wrongCount={wrongGuesses.length}
        maxTries={currentRank.maxTries}
        streak={profile?.dailyStreak || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Papa Avatar Area (Right on Desktop) */}
        <div className="lg:col-span-4 flex justify-center bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border-2 border-zinc-100 dark:border-zinc-800">
          <DynamicPapa
            errors={wrongGuesses.length}
            maxErrors={currentRank.maxTries}
            isWinner={isWon}
            isLost={isLost}
            accent={currentRank.color}
            currentRankName={currentRank.name}
            rankLevel={currentRank.level}
            streak={profile?.dailyStreak || 0}
            wordLength={currentGame?.word?.length || 0}
          />
        </div>
        {/* Main Game Area (Left on Desktop) */}
        <motion.div
          animate={
            isShaking
              ? {
                  x: [-5, 5, -5, 5, 0],
                  backgroundColor: [
                    "rgba(239,68,68,0)",
                    "rgba(239,68,68,0.1)",
                    "rgba(239,68,68,0)",
                  ],
                }
              : {}
          }
          className="lg:col-span-8 flex flex-col space-y-4 rounded-3xl overflow-hidden"
        >
          <div className="py-8 flex justify-center bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl min-h-[160px] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            {wordLetters.length > 0 ? (
              <WordDisplay
                wordLetters={wordLetters}
                guessedLetters={guessedLetters}
                isLost={isLost}
                isWon={isWon}
                wrongCount={wrongGuesses.length}
                xpGained={sessionSnapshot.totalXP}
                accent={currentRank.color}
              />
            ) : (
              <div className="text-zinc-400 font-black animate-pulse flex items-center uppercase tracking-widest">
                Generating Challenge...
              </div>
            )}
          </div>

          <div className="min-h-[220px]">
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
        </motion.div>
      </div>
    </div>
  );
}
