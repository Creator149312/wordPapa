export const WORDS_POOL = [
  // EASY (Arena: Backyard) - 3-5 Letters
  { word: "CHESS", category: "Games", difficulty: "easy" },
  { word: "TOKYO", category: "Cities", difficulty: "easy" },
  { word: "AVATAR", category: "Movies", difficulty: "easy" },
  { word: "PIZZA", category: "Food", difficulty: "easy" },
  
  // MEDIUM (Arena: Library) - 6-8 Letters
  { word: "HAMLET", category: "Books", difficulty: "medium" },
  { word: "SAHARA", category: "Places", difficulty: "medium" },
  { word: "FERRARI", category: "Cars", difficulty: "medium" },
  { word: "AVOCADO", category: "Food", difficulty: "medium" },
  { word: "BICYCLE", category: "Transport", difficulty: "medium" },

  // HARD (Arena: Laboratory) - 9+ Letters
  { word: "EINSTEIN", category: "People", difficulty: "hard" },
  { word: "PINEAPPLE", category: "Fruits", difficulty: "hard" },
  { word: "ESPRESSO", category: "Drinks", difficulty: "hard" },
  { word: "OLYMPICS", category: "Sports", difficulty: "hard" }
];

export const GAME_CONFIG = {
  MAX_WRONG_GUESSES: 6,
  DAILY_XP_REWARD: 50,
  DAILY_COIN_REWARD: 20,
  DAILY_PERFECT_BONUS: 20,
};

export const ARENAS = {
  BACKYARD: {
    id: 'backyard',
    name: "Papa's Backyard",
    minLevel: 1,
    difficulty: 'easy',
    color: '#75c32c',
    description: "Simple words for a sunny start."
  },
  LIBRARY: {
    id: 'library',
    name: "The Grand Library",
    minLevel: 3,
    difficulty: 'medium',
    color: '#60a5fa',
    description: "Academic terms and longer puzzles."
  },
  LABORATORY: {
    id: 'laboratory',
    name: "Papa's Laboratory",
    minLevel: 5,
    difficulty: 'hard',
    color: '#a855f7',
    description: "Complex concepts and scientific words."
  }
};