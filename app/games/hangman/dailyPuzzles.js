/**
 * dailyPuzzles.js
 *
 * 20 curated Daily-5 themes sourced from WORDS_POOL levels 5–10.
 * Every word appears exactly once. Each theme has a hidden "Aha!"
 * title that is revealed to the player only after all 5 words are solved.
 *
 * Rotation: getDailyTheme() maps UTC day number → theme via modulo,
 * so every user on Earth gets the exact same puzzle on the same day.
 */

export const DAILY_THEMES = [
  // ─── THEME 1 ──────────────────────────────────────────────────────────────
  {
    id: 1,
    theme: "Sacred Rituals",
    emoji: "🪔",
    words: [
      { word: "PRAYER", hint: "Silent words reach sky", level: 5 },
      { word: "CHANT", hint: "Echo repeated until truth", level: 5 },
      { word: "RITUAL", hint: "Steps repeated for unseen", level: 5 },
      { word: "OFFERING", hint: "Gift laid before silence", level: 5 },
      { word: "GATHER", hint: "Hands meet, voices join", level: 5 },
    ],
  },

  // ─── THEME 2 ──────────────────────────────────────────────────────────────
  {
    id: 2,
    theme: "The Royal Court",
    emoji: "👑",
    words: [
      { word: "KING", hint: "Voice rules, crown shines", level: 5 },
      { word: "QUEEN", hint: "Grace beside the throne", level: 5 },
      { word: "ADVISOR", hint: "A person who gives guidance", level: 7 },
      { word: "SOLDIER", hint: "A person who serves in an army", level: 7 },
      { word: "ORATOR", hint: "A public speaker of great eloquence", level: 7 },
    ],
  },

  // ─── THEME 3 ──────────────────────────────────────────────────────────────
  {
    id: 3,
    theme: "The Deep Forest",
    emoji: "🌲",
    words: [
      { word: "FOREST", hint: "A large area covered with trees", level: 6 },
      { word: "STREAM", hint: "A small, narrow river", level: 6 },
      { word: "VALLEY", hint: "Low area between hills or mountains", level: 6 },
      { word: "WILDERNESS", hint: "An uncultivated, uninhabited region", level: 6 },
      { word: "SILENCE", hint: "The complete absence of sound", level: 6 },
    ],
  },

  // ─── THEME 4 ──────────────────────────────────────────────────────────────
  {
    id: 4,
    theme: "Justice & Honor",
    emoji: "⚖️",
    words: [
      { word: "JUSTICE", hint: "Fairness in the way people are treated", level: 7 },
      { word: "FREEDOM", hint: "The power or right to act as one wants", level: 7 },
      { word: "HONOR", hint: "High respect or great esteem", level: 7 },
      { word: "COURAGE", hint: "Strength in the face of pain or grief", level: 7 },
      { word: "SUCCESS", hint: "The accomplishment of an aim or purpose", level: 7 },
    ],
  },

  // ─── THEME 5 ──────────────────────────────────────────────────────────────
  {
    id: 5,
    theme: "The Great River",
    emoji: "🌊",
    words: [
      { word: "FLOWING", hint: "Moving steadily in a continuous stream", level: 8 },
      { word: "CROSSING", hint: "Going from one side to the other", level: 8 },
      { word: "SAILING", hint: "Traveling by ship with sails", level: 8 },
      { word: "CURRENT", hint: "The flow of water or electricity", level: 8 },
      { word: "RIPPLES", hint: "Small waves on the surface of water", level: 8 },
    ],
  },

  // ─── THEME 6 ──────────────────────────────────────────────────────────────
  {
    id: 6,
    theme: "The Solar Chariot",
    emoji: "☀️",
    words: [
      { word: "CELESTIAL", hint: "Belonging or relating to the heavens", level: 9 },
      { word: "UNIVERSE", hint: "All existing matter and space as a whole", level: 9 },
      { word: "CHARIOT", hint: "A two-wheeled horse-drawn vehicle of antiquity", level: 9 },
      { word: "LIGHTNING", hint: "A sudden spark of electricity in the sky", level: 9 },
      { word: "RADIANCE", hint: "Light or heat emitted from something", level: 9 },
    ],
  },

  // ─── THEME 7 ──────────────────────────────────────────────────────────────
  {
    id: 7,
    theme: "The Cosmic Dance",
    emoji: "🌌",
    words: [
      { word: "ENLIGHTEN", hint: "To give someone greater knowledge", level: 10 },
      { word: "MEDITATION", hint: "A practice of focus for mental clarity", level: 10 },
      { word: "TRANSCEND", hint: "To rise above or go beyond the limits of", level: 10 },
      { word: "AWAKENING", hint: "Coming to realize something important", level: 10 },
      { word: "LIBERATION", hint: "The act of setting someone free", level: 10 },
    ],
  },

  // ─── THEME 8 ──────────────────────────────────────────────────────────────
  {
    id: 8,
    theme: "Rites & Symbols",
    emoji: "🥁",
    words: [
      { word: "CANDLE", hint: "Wax spine holds fire", level: 5 },
      { word: "DRUM", hint: "Heartbeat carved in wood", level: 5 },
      { word: "LAMP", hint: "Glass cage for flame", level: 5 },
      { word: "CROWN", hint: "Circle of power worn", level: 5 },
      { word: "INCENSE", hint: "Smoke carries devotion upward", level: 5 },
    ],
  },

  // ─── THEME 9 ──────────────────────────────────────────────────────────────
  {
    id: 9,
    theme: "The Human Heart",
    emoji: "❤️",
    words: [
      { word: "FAITH", hint: "Bridge built without sight", level: 5 },
      { word: "HOPE", hint: "Light carried in dark", level: 5 },
      { word: "LOVE", hint: "Bond unseen yet unbroken", level: 5 },
      { word: "WONDER", hint: "A feeling of surprise and admiration", level: 6 },
      { word: "DEVOTION", hint: "Love, loyalty, or enthusiasm for a cause", level: 9 },
    ],
  },

  // ─── THEME 10 ─────────────────────────────────────────────────────────────
  {
    id: 10,
    theme: "Holy Ground",
    emoji: "🕌",
    words: [
      { word: "TEMPLE", hint: "Walls whisper to heaven", level: 5 },
      { word: "CHURCH", hint: "Echoes of hymns linger", level: 5 },
      { word: "ALTAR", hint: "Stone table for gods", level: 5 },
      { word: "WELL", hint: "Depth that holds thirst", level: 5 },
      { word: "BRIDGE", hint: "Stone spine across water", level: 5 },
    ],
  },

  // ─── THEME 11 ─────────────────────────────────────────────────────────────
  {
    id: 11,
    theme: "The Boundless",
    emoji: "♾️",
    words: [
      { word: "ENDLESS", hint: "Having or seeming to have no limit", level: 8 },
      { word: "POWERFUL", hint: "Having great strength or influence", level: 8 },
      { word: "INFINITE", hint: "Limitless or endless in space or size", level: 9 },
      { word: "BOUNDLESS", hint: "Immense in scope; having no boundaries", level: 10 },
      { word: "OMNIPRESENT", hint: "Widely or constantly encountered", level: 10 },
    ],
  },

  // ─── THEME 12 ─────────────────────────────────────────────────────────────
  {
    id: 12,
    theme: "Ancient Wisdom",
    emoji: "📜",
    words: [
      { word: "ANCIENT", hint: "Belonging to the very distant past", level: 6 },
      { word: "MYSTERY", hint: "Something that is difficult to explain", level: 6 },
      { word: "HARMONY", hint: "The quality of forming a pleasing whole", level: 6 },
      { word: "WISDOM", hint: "Experience, knowledge, and good judgment", level: 8 },
      { word: "GUIDANCE", hint: "Direction or advice for a path forward", level: 8 },
    ],
  },

  // ─── THEME 13 ─────────────────────────────────────────────────────────────
  {
    id: 13,
    theme: "The Wanderer",
    emoji: "🧭",
    words: [
      { word: "JOURNEY", hint: "The act of traveling from one place to another", level: 6 },
      { word: "WALKING", hint: "Moving at a regular pace by foot", level: 6 },
      { word: "HUNTER", hint: "A person or animal that hunts", level: 6 },
      { word: "NATURAL", hint: "Existing in or derived from nature", level: 6 },
      { word: "SHADOW", hint: "A dark area produced by blocking light", level: 6 },
    ],
  },

  // ─── THEME 14 ─────────────────────────────────────────────────────────────
  {
    id: 14,
    theme: "Voices of Power",
    emoji: "🏰",
    words: [
      { word: "KINGDOM", hint: "A country ruled by a monarch", level: 7 },
      { word: "PALACE", hint: "The official residence of a sovereign", level: 7 },
      { word: "NOBLEMAN", hint: "A man of the highest social class", level: 7 },
      { word: "COMMAND", hint: "To give an authoritative order", level: 7 },
      { word: "HISTORY", hint: "The study of past events", level: 7 },
    ],
  },

  // ─── THEME 15 ─────────────────────────────────────────────────────────────
  {
    id: 15,
    theme: "Mind & Cosmos",
    emoji: "🔭",
    words: [
      { word: "CONSCIOUS", hint: "Aware of and responding to surroundings", level: 10 },
      { word: "EXISTENCE", hint: "The fact or state of having objective reality", level: 10 },
      { word: "DIMENSION", hint: "A measurable extent, like length or width", level: 10 },
      { word: "DUALITY", hint: "The quality of being made of two parts", level: 10 },
      { word: "COSMOLOGY", hint: "The science of the origin of the universe", level: 10 },
    ],
  },

  // ─── THEME 16 ─────────────────────────────────────────────────────────────
  {
    id: 16,
    theme: "The Open Sea",
    emoji: "⛵",
    words: [
      { word: "OCEANS", hint: "Vast bodies of salt water covering Earth", level: 8 },
      { word: "SURRENDER", hint: "To cease resistance and submit", level: 8 },
      { word: "ETERNAL", hint: "Lasting or existing forever", level: 8 },
      { word: "UNBROKEN", hint: "Continuous and not interrupted", level: 8 },
      { word: "BRIDGES", hint: "Structures carrying paths over obstacles", level: 8 },
    ],
  },

  // ─── THEME 17 ─────────────────────────────────────────────────────────────
  {
    id: 17,
    theme: "Eternal Glory",
    emoji: "✨",
    words: [
      { word: "GLORIOUS", hint: "Having or deserving fame and admiration", level: 9 },
      { word: "BRILLIANT", hint: "Exceptionally clever; or very bright", level: 9 },
      { word: "ABSOLUTE", hint: "Not qualified or diminished; total", level: 9 },
      { word: "PROPHECY", hint: "A prediction of what will happen", level: 9 },
      { word: "ETERNITY", hint: "Infinite or unending time", level: 9 },
    ],
  },

  // ─── THEME 18 ─────────────────────────────────────────────────────────────
  {
    id: 18,
    theme: "The City Square",
    emoji: "🏙️",
    words: [
      { word: "MARKET", hint: "Coins sing, voices clash", level: 5 },
      { word: "STREET", hint: "Stone veins of the city", level: 5 },
      { word: "CITY", hint: "Crowds, towers, endless hum", level: 5 },
      { word: "FESTIVAL", hint: "Days when colors dance", level: 5 },
      { word: "FEAST", hint: "Tables heavy with joy", level: 5 },
    ],
  },

  // ─── THEME 19 ─────────────────────────────────────────────────────────────
  {
    id: 19,
    theme: "Soul & Fate",
    emoji: "🌀",
    words: [
      { word: "SOUL", hint: "Traveler within the body", level: 5 },
      { word: "DESTINY", hint: "Path written before steps", level: 5 },
      { word: "BELIEF", hint: "Invisible anchor of mind", level: 5 },
      { word: "OATH", hint: "Words chained to honor", level: 5 },
      { word: "SPIRIT", hint: "Breath unseen, eternal", level: 5 },
    ],
  },

  // ─── THEME 20 ─────────────────────────────────────────────────────────────
  {
    id: 20,
    theme: "The Sacred Path",
    emoji: "🧿",
    words: [
      { word: "RING", hint: "Circle that binds forever", level: 5 },
      { word: "SILVER", hint: "Moon's metal, cold shine", level: 5 },
      { word: "MASK", hint: "Face that hides truth", level: 5 },
      { word: "MONK", hint: "Silence becomes his speech", level: 5 },
      { word: "PILGRIM", hint: "Traveler with sacred steps", level: 5 },
    ],
  },
];

/**
 * Returns the Daily-5 theme for a given date (defaults to today UTC).
 *
 * @param {Date|null} dateOverride  - Optional date for testing specific days.
 * @returns {{ theme: object, dayNumber: number, dateKey: string, timestamp: number }}
 */
export function getDailyTheme(dateOverride = null) {
  const now = dateOverride || new Date();

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();

  const todayUTC = Date.UTC(year, month, day);
  const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Days since launch (Jan 1 2025) — deterministic globally
  const launchDate = Date.UTC(2025, 0, 1);
  const dayNumber = Math.max(1, Math.floor((todayUTC - launchDate) / 86400000));

  const themeIndex = (dayNumber - 1) % DAILY_THEMES.length;

  return {
    theme: DAILY_THEMES[themeIndex],
    dayNumber,
    dateKey,
    timestamp: todayUTC,
  };
}
