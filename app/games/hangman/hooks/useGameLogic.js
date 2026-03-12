import { useState, useMemo, useCallback } from 'react';
import { WORDS_POOL, GAME_CONFIG } from '../constants';
import { calculateLevel } from '../lib/progression';

export function useGameLogic(dailyWord, playerXP = 0) {
  const [currentGame, setCurrentGame] = useState(dailyWord || null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // --- Arena Logic ---
  
  // Determine which Arena the player is currently in based on XP
  const arenaInfo = useMemo(() => {
    const rank = calculateLevel(playerXP);
    if (rank.level >= 5) {
      return { id: 'laboratory', name: "Papa's Laboratory", difficulty: 'hard' };
    } else if (rank.level >= 3) {
      return { id: 'library', name: "The Grand Library", difficulty: 'medium' };
    }
    return { id: 'backyard', name: "Papa's Backyard", difficulty: 'easy' };
  }, [playerXP]);

  // --- Derived State ---
  
  const wordLetters = useMemo(() => 
    currentGame?.word.toUpperCase().split('') || [], 
    [currentGame]
  );

  const wrongGuesses = useMemo(() => 
    guessedLetters.filter(l => !wordLetters.includes(l)), 
    [guessedLetters, wordLetters]
  );

  const correctGuessesCount = useMemo(() =>
    wordLetters.filter(letter => guessedLetters.includes(letter)).length,
    [wordLetters, guessedLetters]
  );

  const isWon = useMemo(() => {
    if (isTransitioning || wordLetters.length === 0) return false;
    return wordLetters.every(l => guessedLetters.includes(l));
  }, [wordLetters, guessedLetters, isTransitioning]);

  const isLost = useMemo(() => {
    if (isTransitioning) return false;
    return wrongGuesses.length >= (GAME_CONFIG?.MAX_WRONG_GUESSES || 6);
  }, [wrongGuesses, isTransitioning]);

  /**
   * Initializes or Resets a game session.
   * Filters words based on the current Arena difficulty for Classic Mode.
   */
  const initGameSession = useCallback((mode, serverData = null) => {
    let nextWord;

    if (mode === 'daily' && dailyWord) {
      nextWord = dailyWord;
    } else if (serverData) {
      nextWord = { word: serverData.word, category: serverData.category };
    } else {
      // 1. Filter the pool based on the active Arena difficulty
      const arenaPool = WORDS_POOL.filter(w => w.difficulty === arenaInfo.difficulty);
      
      // 2. Safety fallback: if no words match the difficulty, use the whole pool
      const finalPool = arenaPool.length > 0 ? arenaPool : WORDS_POOL;
      
      // 3. Pick random word
      const next = finalPool[Math.floor(Math.random() * finalPool.length)];
      
      nextWord = { 
        word: next.word, 
        category: next.category,
        arena: arenaInfo.name, // Pass arena name for UI display
        arenaId: arenaInfo.id   // Pass arena ID for potential styling
      };
    }

    setGuessedLetters([]);
    setCurrentGame(nextWord);
    setIsTransitioning(false);
  }, [dailyWord, arenaInfo]);

  return {
    currentGame,
    guessedLetters,
    setGuessedLetters,
    isTransitioning,
    setIsTransitioning,
    wordLetters,
    wrongGuesses,
    correctGuessesCount,
    isWon,
    isLost,
    initGameSession,
    currentArena: arenaInfo // Export arena info for the UI
  };
}