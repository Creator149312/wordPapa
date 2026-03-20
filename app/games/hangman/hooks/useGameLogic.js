"use client";
import { useState, useMemo, useCallback } from "react";
import { WORDS_POOL, GAME_CONFIG, ARENAS } from "../constants";
import { calculateLevel } from "../lib/progression";

export function useGameLogic(dailyWord, playerXP = 0) {
  const [currentGame, setCurrentGame] = useState(dailyWord || null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- 1. Arena & Rank Logic ---
  const arenaInfo = useMemo(() => {
    const rank = calculateLevel(playerXP);
    const theme = ARENAS[rank.arenaId];
    return { ...rank, theme };
  }, [playerXP]);

  // --- 2. Derived State ---
  // Ensure we handle potential undefined word property safely
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

  // --- 3. Win/Loss States ---
  const isWon = useMemo(() => {
    if (alphabeticLetters.length === 0) return false;
    // Check if every unique letter in the word has been guessed
    return alphabeticLetters.every((l) => guessedLetters.includes(l));
  }, [alphabeticLetters, guessedLetters]);

  const isLost = useMemo(
    () => wrongGuesses.length >= maxWrong,
    [wrongGuesses.length, maxWrong],
  );

  // --- 4. Core Actions ---
  const initGameSession = useCallback(
    (mode, serverData = null) => {
      let nextWord;

      // PRIORITY 1: Manual Injection (Endless Mode weighted word)
      if (serverData) {
        nextWord = {
          word: serverData.word,
          category: serverData.category,
          hint: serverData.hint,
          // Attach arena metadata for UI consistency
          arena: arenaInfo.stageName,
          arenaId: arenaInfo.arenaId,
        };
      }
      // PRIORITY 2: Daily Challenge
      else if (mode === "daily" && dailyWord) {
        nextWord = dailyWord;
      }
      // PRIORITY 3: Fallback random selection (Classic Mode)
      else {
        const levelPool = WORDS_POOL[arenaInfo.level] || WORDS_POOL[1];
        const next = levelPool[Math.floor(Math.random() * levelPool.length)];

        nextWord = {
          ...next,
          arena: arenaInfo.stageName,
          arenaId: arenaInfo.arenaId,
          cefr: arenaInfo.cefr,
        };
      }

      // Reset interaction state for the new word
      setGuessedLetters([]);
      setCurrentGame(nextWord);
    },
    [dailyWord, arenaInfo],
  );

  /**
   * Reveal Letter Hint (Consumable)
   */
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
