/**
 * Word Stream Providers for WordPapa Hangman
 *
 * Encapsulates word-fetching and queueing logic across all modes:
 *  1. Endless Stream (Difficulty-tier weighted random selection)
 *  2. Journey Node Stream (Curriculum-based node fetching + Tough Nut spaced repetition)
 *  3. List Stream (Direct custom / topic list vocabulary)
 */

import { RANKS, WORDS_POOL } from "../constants.js";

/**
 * Creates an Endless Word Stream Provider.
 * Selects words from WORDS_POOL weighted up to the user's unlocked rank.
 */
export function createEndlessStream(playerXP = 0, highestEndlessXP = 0) {
  const effectiveXP = Math.max(highestEndlessXP || 0, playerXP || 0);
  const maxUnlockedRank =
    [...RANKS].reverse().find((r) => effectiveXP >= r.minXP) || RANKS[0];

  return {
    type: "endless",
    getNextWord: (usedWordTexts = []) => {
      const safeLevel = Math.max(1, Math.min(8, maxUnlockedRank.level || 1));

      // Weight words toward unlocked levels
      const levelPickerPool = [];
      for (let lvl = 1; lvl <= safeLevel; lvl++) {
        for (let i = 0; i < lvl; i++) {
          levelPickerPool.push(lvl);
        }
      }

      const selectedLevel =
        levelPickerPool[Math.floor(Math.random() * levelPickerPool.length)] || 1;
      const levelWords = WORDS_POOL[selectedLevel] || WORDS_POOL[1];

      let availableWords = levelWords.filter(
        (item) => !usedWordTexts.includes(item.word)
      );
      if (availableWords.length === 0) availableWords = levelWords;

      const chosen =
        availableWords[Math.floor(Math.random() * availableWords.length)];
      return {
        ...chosen,
        wordLevel: selectedLevel,
        category: `Rank ${selectedLevel}`,
      };
    },
  };
}

/**
 * Creates a Journey Node Word Stream Provider.
 * Fetches curriculum words for a specific node and merges Tough Nuts.
 */
export function createJourneyStream({ nodeId, rankId }) {
  return {
    type: "journey",
    nodeId,
    rankId,
    fetchWords: async () => {
      try {
        const res = await fetch(`/api/journey/node-words?nodeId=${nodeId}`);
        const data = await res.json();
        if (data.success && data.words?.length) {
          return {
            title: data.title || `Node ${nodeId}`,
            words: data.words,
          };
        }
      } catch (err) {
        console.error("Failed to fetch journey stream words:", err);
      }
      return { title: `Node ${nodeId}`, words: [] };
    },
  };
}

/**
 * Creates a Vocabulary List Word Stream Provider.
 * Formats a user or topic list for use in Hangman.
 */
export function createListStream({ listId, listWords = [], listTitle = "List Practice" }) {
  return {
    type: "list",
    listId,
    title: listTitle,
    getWords: () => {
      return (listWords || []).map((w) => ({
        word: typeof w === "string" ? w : w.word,
        hint: typeof w === "string" ? "" : (w.wordData || ""),
        category: listTitle,
      }));
    },
  };
}
