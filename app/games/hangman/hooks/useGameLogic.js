"use client";
import { useState, useMemo, useCallback } from "react";
import { WORDS_POOL, GAME_CONFIG, ARENAS, RANKS } from "../constants";
// Assuming calculateLevel is a helper that finds the rank in RANKS based on XP
import { calculateLevel } from "../lib/progression";

/**
 * @param {Object} dailyWord - The daily word object
 * @param {number} playerXP - Total Profile XP (for Career Ranks)
 * @param {number} highestEndlessXP - The user's PB (for Word Pool selection)
 */
export function useGameLogic(dailyWord, playerXP = 0, highestEndlessXP = 0) {
  const [currentGame, setCurrentGame] = useState(dailyWord || null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- 1. Arena & Rank Logic ---
  const arenaInfo = useMemo(() => {
    // FIX: Rank calculation now uses total profile XP for the "Label"
    const rank = calculateLevel(playerXP);
    const theme = ARENAS[rank.arenaId];
    return { ...rank, theme };
  }, [playerXP]);

  // --- 2. Word Pool Difficulty Logic ---
  const wordSelectionRank = useMemo(() => {
    // FIX 2: Word selection is now driven by highestEndlessRunXP
    // We find the highest rank achieved in Endless to determine the pool limit
    const effectiveRank =
      [...RANKS].reverse().find((r) => highestEndlessXP >= r.minXP) || RANKS[0];
    return effectiveRank;
  }, [highestEndlessXP]);

  // --- 3. Derived State ---
  const wordLetters = useMemo(
    () => currentGame?.word?.toUpperCase().split("") || [],
    [currentGame],
  );

  const alphabeticLetters = useMemo(
    () => wordLetters.filter((char) => /[A-Z]/.test(char)),
    [wordLetters],
  );

  const wrongGuesses = useMemo(
    () => guessedLetters.filter((l) => !wordLetters.includes(l)),
    [guessedLetters, wordLetters],
  );

  const maxWrong = useMemo(
    () => arenaInfo?.maxTries || GAME_CONFIG?.MAX_WRONG_GUESSES || 6,
    [arenaInfo],
  );

  // --- 4. Win/Loss States ---
  const isWon = useMemo(() => {
    if (alphabeticLetters.length === 0) return false;
    return alphabeticLetters.every((l) => guessedLetters.includes(l));
  }, [alphabeticLetters, guessedLetters]);

  const isLost = useMemo(
    () => wrongGuesses.length >= maxWrong,
    [wrongGuesses.length, maxWrong],
  );

  // --- 5. Core Actions ---
  const initGameSession = useCallback(
    (mode, serverData = null) => {
      let nextWord;

      // PRIORITY 1: Manual Injection (Endless Mode weighted word)
      if (serverData) {
        nextWord = {
          ...serverData,
          // Attach session-specific arena metadata
          arena: arenaInfo.stageName,
          arenaId: arenaInfo.arenaId,
        };
      }
      // PRIORITY 2: Daily Challenge
      else if (mode === "daily" && dailyWord) {
        nextWord = dailyWord;
      }
      // PRIORITY 3: Fallback random selection (Classic/Endless)
      else {
        // FIX: Use wordSelectionRank (based on high score) instead of current arenaInfo
        const targetLevel = wordSelectionRank.level;
        const levelPool = WORDS_POOL[targetLevel] || WORDS_POOL[1];
        const next = levelPool[Math.floor(Math.random() * levelPool.length)];

        nextWord = {
          ...next,
          arena: arenaInfo.stageName,
          arenaId: arenaInfo.arenaId,
        };
      }

      setGuessedLetters([]);
      setCurrentGame(nextWord);
    },
    [dailyWord, arenaInfo, wordSelectionRank],
  );

  const useHint = useCallback(
    (currentCoins, cost = 50) => {
      if (currentCoins < cost || isWon || isLost) return null;

      const missingLetters = alphabeticLetters.filter(
        (l) => !guessedLetters.includes(l),
      );

      if (missingLetters.length > 0) {
        const randomHint =
          missingLetters[Math.floor(Math.random() * missingLetters.length)];
        setGuessedLetters((prev) => [...prev, randomHint]);
        return randomHint;
      }
      return null;
    },
    [alphabeticLetters, guessedLetters, isWon, isLost],
  );

  return {
    currentGame,
    guessedLetters,
    setGuessedLetters,
    isTransitioning,
    setIsTransitioning,
    wordLetters,
    alphabeticLetters,
    wrongGuesses,
    isWon,
    isLost,
    initGameSession,
    useHint,
    currentArena: arenaInfo,
  };
}
