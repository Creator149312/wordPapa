import { useState, useMemo, useCallback } from "react";
import { WORDS_POOL, GAME_CONFIG, ARENAS } from "../constants";
import { calculateLevel } from "../lib/progression";

export function useGameLogic(dailyWord, playerXP = 0) {
  const [currentGame, setCurrentGame] = useState(dailyWord || null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- Arena & Rank Logic ---
  // This pulls the dynamic stats (like maxTries) based on the player's current XP
  const arenaInfo = useMemo(() => {
    const rank = calculateLevel(playerXP);
    const theme = ARENAS[rank.arenaId];

    return {
      ...rank,
      theme: theme,
    };
  }, [playerXP]);

  // --- Derived State ---
  const wordLetters = useMemo(
    () => currentGame?.word.toUpperCase().split("") || [],
    [currentGame],
  );

  const alphabeticLetters = useMemo(
    () => wordLetters.filter((char) => char !== " "),
    [wordLetters],
  );

  const wrongGuesses = useMemo(
    () => guessedLetters.filter((l) => !wordLetters.includes(l)),
    [guessedLetters, wordLetters],
  );

  // --- DYNAMIC MAX TRIES FIX ---
  // Prioritizes Rank-specific maxTries (e.g., 10 for Toddler) over the global 6.
  const maxWrong = useMemo(
    () => arenaInfo?.maxTries || GAME_CONFIG?.MAX_WRONG_GUESSES || 6,
    [arenaInfo],
  );

  const livesRemaining = Math.max(0, maxWrong - wrongGuesses.length);

  const correctGuessesCount = useMemo(
    () =>
      alphabeticLetters.filter((letter) => guessedLetters.includes(letter))
        .length,
    [alphabeticLetters, guessedLetters],
  );

  const isWon = useMemo(() => {
    if (isTransitioning || alphabeticLetters.length === 0) return false;
    return alphabeticLetters.every((l) => guessedLetters.includes(l));
  }, [alphabeticLetters, guessedLetters, isTransitioning]);

  const isLost = useMemo(() => {
    if (isTransitioning) return false;
    // Now accurately reflects the player's rank-based limits
    return wrongGuesses.length >= maxWrong;
  }, [wrongGuesses.length, maxWrong, isTransitioning]);

  /**
   * Initializes or Resets a game session.
   */
  const initGameSession = useCallback(
    (mode, serverData = null) => {
      let nextWord;

      if (mode === "daily" && dailyWord) {
        nextWord = dailyWord;
      } else if (serverData) {
        nextWord = { word: serverData.word, category: serverData.category };
      } else {
        // Get the pool specifically for the player's current level
        const levelPool = WORDS_POOL[arenaInfo.level];

        // Safety fallback: if the pool is missing, use level 1
        const finalPool =
          levelPool && levelPool.length > 0 ? levelPool : WORDS_POOL[1];

        // Pick random word
        const next = finalPool[Math.floor(Math.random() * finalPool.length)];

        nextWord = {
          word: next.word,
          category: next.category,
          arena: arenaInfo.stageName,
          arenaId: arenaInfo.arenaId,
          cefr: arenaInfo.cefr,
        };
      }

      setGuessedLetters([]);
      setCurrentGame(nextWord);
      setIsTransitioning(false);
    },
    [dailyWord, arenaInfo],
  );

  /**
   * Hint Logic
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
    livesRemaining,
    correctGuessesCount,
    isWon,
    isLost,
    initGameSession,
    useHint,
    currentArena: arenaInfo,
  };
}
