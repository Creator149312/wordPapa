"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

// Shared Components
import GameHeader from "../components/GameHeader";
import WordDisplay from "../components/WordDisplay";
import VirtualKeyboard from "../components/VirtualKeyboard";
import DynamicPapa from "../components/DynamicPapa";

// Hooks & Lib
import { useGameLogic } from "../hooks/useGameLogic";
import { useAudio } from "../hooks/useAudio";
import { RANKS, ARENAS, GAME_CONFIG } from "../constants";

const TOTAL_WORDS = 5;

function getWordEmoji(result) {
  if (!result.won) return "🟥";
  if (result.wrongCount === 0) return "🟩";
  if (result.wrongCount <= 2) return "🟨";
  return "🟧";
}

export default function DailyMode({
  dailyWords,   // array of 5 word objects
  themeName,
  themeEmoji,
  dayNumber,
  profile,
  onDailyComplete,
  syncToDatabase,
  addDailyRewards,
  triggerSavePrompt,
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [wordResults, setWordResults] = useState([]);
  const [claimedIndexes, setClaimedIndexes] = useState(new Set());
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [allDone, setAllDone] = useState(false);
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

  const currentRank = useMemo(
    () => [...RANKS].reverse().find((r) => userXP >= r.minXP) || RANKS[0],
    [userXP],
  );

  // eslint-disable-next-line no-unused-vars
  const activeArena = useMemo(
    () => ARENAS[currentRank.arenaId] || ARENAS[1],
    [currentRank],
  );

  const currentWord = dailyWords?.[wordIndex];

  const {
    currentGame,
    guessedLetters,
    setGuessedLetters,
    initGameSession,
    isTransitioning,
    wordLetters,
    wrongGuesses,
    isLost,
    isWon,
  } = useGameLogic(currentWord, userXP);

  // Shake on wrong guess
  useEffect(() => {
    if (wrongGuesses.length > prevWrongCount.current) {
      playSynth("POP");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      prevWrongCount.current = wrongGuesses.length;
    }
  }, [wrongGuesses, playSynth]);

  // Reset shake counter when moving to next word
  useEffect(() => {
    prevWrongCount.current = 0;
  }, [wordIndex]);

  // Word completion handler
  useEffect(() => {
    if ((isWon || isLost) && !claimedIndexes.has(wordIndex) && !syncLock.current) {
      syncLock.current = true;

      const result = {
        won: isWon,
        wrongCount: wrongGuesses.length,
        isPerfect: isWon && wrongGuesses.length === 0,
      };

      const newResults = [...wordResults, result];
      setWordResults(newResults);
      setClaimedIndexes((prev) => new Set([...prev, wordIndex]));

      if (isWon) playSynth("MILESTONE");
      else playSynth("GAMEOVER");

      if (wordIndex === TOTAL_WORDS - 1) {
        // ── All 5 words done ──────────────────────────────────────────────
        const wonCount = newResults.filter((r) => r.won).length;
        const perfectCount = newResults.filter((r) => r.isPerfect).length;

        const earnedXP =
          wonCount * GAME_CONFIG.DAILY_XP_REWARD +
          perfectCount * GAME_CONFIG.DAILY_PERFECT_BONUS +
          (wonCount === TOTAL_WORDS ? 50 : 0); // full-clear bonus
        const earnedCoins = wonCount * GAME_CONFIG.DAILY_COIN_REWARD;
        const newStreak = wonCount > 0 ? (profile?.dailyStreak || 0) + 1 : 0;

        const grid = newResults.map(getWordEmoji).join("");
        const stats = { wonCount, perfectCount, earnedXP, earnedCoins, grid, newStreak };

        setSessionSnapshot({ streak: newStreak, totalXP: earnedXP, totalCoins: earnedCoins });
        setAllDone(true);

        const updatedProfile = {
          ...profile,
          xp: (profile?.xp || 0) + earnedXP,
          papaPoints: (profile?.papaPoints || 0) + earnedCoins,
          dailyStreak: newStreak,
        };

        if (addDailyRewards) addDailyRewards(earnedXP, earnedCoins);
        if (!profile?.isGhost && syncToDatabase) syncToDatabase(updatedProfile);
        if (onDailyComplete) onDailyComplete(stats);
        if (profile?.isGhost && wonCount > 0 && triggerSavePrompt) {
          setTimeout(() => triggerSavePrompt(), 1500);
        }
      } else {
        setShowInterstitial(true);
      }
    }
  }, [isWon, isLost]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNextWord = () => {
    const next = wordIndex + 1;
    syncLock.current = false;
    initGameSession("daily", dailyWords[next]);
    setWordIndex(next);
    setShowInterstitial(false);
  };

  const handleGuess = (letter) => {
    if (
      guessedLetters.includes(letter) ||
      isWon ||
      isLost ||
      isTransitioning ||
      showInterstitial
    )
      return;
    if (wordLetters.includes(letter)) playSynth("CORRECT");
    setGuessedLetters((prev) => [...prev, letter]);
  };

  // ── Progress dots ───────────────────────────────────────────────────────
  const ProgressDots = () => (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: TOTAL_WORDS }).map((_, i) => {
        const result = wordResults[i];
        const isCurrent = i === wordIndex && !showInterstitial && !allDone;
        let cls = "w-3 h-3 rounded-full transition-all duration-300 ";
        if (result) {
          cls += result.won
            ? "bg-[#75c32c] scale-110"
            : "bg-red-500 scale-110";
        } else if (isCurrent) {
          cls +=
            "bg-zinc-400 scale-125 ring-2 ring-offset-1 ring-zinc-400 dark:ring-offset-zinc-900";
        } else {
          cls += "bg-zinc-200 dark:bg-zinc-700";
        }
        return <div key={i} className={cls} />;
      })}
    </div>
  );

  // ── Between-words interstitial ──────────────────────────────────────────
  if (showInterstitial && !allDone) {
    const lastResult = wordResults[wordResults.length - 1];
    const lastWord = dailyWords[wordIndex];
    const emoji = getWordEmoji(lastResult);

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
        <ProgressDots />

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl"
        >
          {emoji}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black uppercase italic tracking-tight text-zinc-800 dark:text-zinc-100"
        >
          {lastResult.won
            ? lastResult.isPerfect
              ? "Perfect Clear!"
              : "Solved!"
            : "Word Lost"}
        </motion.h2>

        {!lastResult.won && (
          <p className="text-sm font-bold text-zinc-400">
            The word was{" "}
            <span className="text-zinc-800 dark:text-zinc-200 font-black">
              {lastWord.word}
            </span>
          </p>
        )}
        {lastResult.isPerfect && (
          <p className="text-sm font-bold text-[#75c32c]">
            +{GAME_CONFIG.DAILY_PERFECT_BONUS} XP Perfect Bonus
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ y: 2 }}
          onClick={handleNextWord}
          className="mt-2 px-8 py-4 bg-[#75c32c] hover:bg-[#6ab127] text-black font-black uppercase italic rounded-2xl shadow-[0_5px_0_0_#4d821c] active:translate-y-1 active:shadow-none transition-all"
        >
          Word {wordIndex + 2} of {TOTAL_WORDS} →
        </motion.button>
      </div>
    );
  }

  // ── Final results screen ────────────────────────────────────────────────
  if (allDone) {
    const wonCount = wordResults.filter((r) => r.won).length;

    return (
      <div className="flex flex-col items-center gap-6 p-4 pt-8">
        <ProgressDots />

        {/* Theme reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">
            Today&apos;s Theme
          </p>
          <h2 className="text-3xl font-black uppercase italic tracking-tight text-zinc-800 dark:text-zinc-100">
            {themeEmoji} {themeName}
          </h2>
        </motion.div>

        {/* Emoji grid */}
        <div className="flex gap-3 text-3xl">
          {wordResults.map((r, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.12 }}
            >
              {getWordEmoji(r)}
            </motion.span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-2xl text-center border border-zinc-200 dark:border-zinc-700">
            <p className="text-2xl font-black">
              {wonCount}/{TOTAL_WORDS}
            </p>
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">
              Solved
            </p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-2xl text-center border border-zinc-200 dark:border-zinc-700">
            <p className="text-2xl font-black text-[#75c32c]">
              +{sessionSnapshot.totalXP}
            </p>
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">
              XP
            </p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-2xl text-center border border-zinc-200 dark:border-zinc-700">
            <p className="text-2xl font-black text-amber-500">
              {sessionSnapshot.streak} 🔥
            </p>
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">
              Streak
            </p>
          </div>
        </div>

        {/* Play more CTA */}
        <div className="w-full max-w-sm space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center mb-3">
            Keep Playing
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => (window.location.href = "/games/hangman?mode=endless")}
              className="flex flex-col items-center gap-1 py-4 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-700 transition-all"
            >
              <span className="text-xl">⚡</span>
              <span className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-200">Endless Run</span>
              <span className="text-[10px] text-zinc-400">How long can you last?</span>
            </button>
            <button
              onClick={() => (window.location.href = "/games/hangman?mode=journey")}
              className="flex flex-col items-center gap-1 py-4 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-2xl border border-zinc-200 dark:border-zinc-700 transition-all"
            >
              <span className="text-xl">🗺️</span>
              <span className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-200">Journey</span>
              <span className="text-[10px] text-zinc-400">Level-by-level story</span>
            </button>
          </div>
          <button
            onClick={() => (window.location.href = "/games/hangman")}
            className="mt-1 w-full py-3 text-xs font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            ← Back to Arena
          </button>
        </div>
      </div>
    );
  }

  // ── Active game ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col space-y-4">
      <GameHeader
        gameMode="daily"
        category={`Daily #${dayNumber || "?"} · Word ${wordIndex + 1}/${TOTAL_WORDS}`}
        onQuit={() => (window.location.href = "/games/hangman")}
        playerRank={currentRank}
        wrongCount={wrongGuesses.length}
        maxTries={currentRank.maxTries}
        streak={profile?.dailyStreak || 0}
      />

      <ProgressDots />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Papa Avatar */}
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

        {/* Main Game Area */}
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
                xpGained={0}
                accent={currentRank.color}
              />
            ) : (
              <div className="text-zinc-400 font-black animate-pulse flex items-center uppercase tracking-widest">
                Generating Challenge...
              </div>
            )}
          </div>

          <div className="min-h-[220px]">
            <VirtualKeyboard
              guessedLetters={guessedLetters}
              wordLetters={wordLetters}
              onGuess={handleGuess}
              disabled={isTransitioning || isWon || isLost}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

