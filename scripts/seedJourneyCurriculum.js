#!/usr/bin/env node

require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const axios = require("axios");

const wordDataSchema = new mongoose.Schema({
  word: String,
  wordData: String,
});

const listSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    words: { type: [wordDataSchema], default: [] },
    createdBy: { type: String, required: true },
    tags: { type: [String], default: [] },
    practiceCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const nodeListSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true, min: 1, max: 8 },
    node: { type: Number, required: true, min: 1, max: 5 },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

nodeListSchema.index({ rank: 1, node: 1, listId: 1 }, { unique: true });

const List = mongoose.models.List || mongoose.model("List", listSchema);
const NodeList =
  mongoose.models.NodeList || mongoose.model("NodeList", nodeListSchema);

const SYSTEM_EMAIL = "system@wordpapa.com";
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE_FALLBACK = process.argv.includes("--no-ai");

const RANK_META = {
  1: { name: "Infant", cefr: "A1" },
  2: { name: "Toddler", cefr: "A1" },
  3: { name: "Student", cefr: "A2" },
  4: { name: "Scholar", cefr: "A2" },
  5: { name: "Sage", cefr: "B1" },
  6: { name: "Yogi", cefr: "B2" },
  7: { name: "Guru", cefr: "C1" },
  8: { name: "Master", cefr: "C2" },
};

const CURRICULUM = [
  {
    rank: 1,
    node: 1,
    title: "Sun, Sky & Weather",
    blurb: "First picture words about the sky, light, and simple weather.",
    words: ["sun", "sky", "cloud", "rain", "wind", "moon", "star", "day", "night", "snow"],
  },
  {
    rank: 1,
    node: 2,
    title: "Farm & Forest Friends",
    blurb: "Easy animal names children meet early in stories and daily life.",
    words: ["cat", "dog", "pig", "cow", "hen", "duck", "goat", "horse", "sheep", "rabbit"],
  },
  {
    rank: 1,
    node: 3,
    title: "Family & People Around Me",
    blurb: "Core family and people words for very early conversation.",
    words: ["mother", "father", "sister", "brother", "baby", "child", "woman", "man", "boy", "girl"],
  },
  {
    rank: 1,
    node: 4,
    title: "Colors, Shapes & Numbers",
    blurb: "Starter words for counting, noticing colors, and describing shapes.",
    words: ["red", "blue", "green", "yellow", "black", "white", "one", "two", "three", "circle"],
  },
  {
    rank: 1,
    node: 5,
    title: "Home Basics",
    blurb: "The boss node for Infant rank: common objects found at home.",
    words: ["bed", "chair", "table", "cup", "spoon", "door", "window", "book", "bag", "lamp"],
  },
  {
    rank: 2,
    node: 1,
    title: "Move, Sit & Start",
    blurb: "Simple action verbs that unlock everyday sentence building.",
    words: ["eat", "drink", "sleep", "walk", "run", "jump", "sit", "stand", "open", "close"],
  },
  {
    rank: 2,
    node: 2,
    title: "Food & Kitchen Basics",
    blurb: "Essential food words used in beginner conversations and routines.",
    words: ["bread", "milk", "rice", "apple", "egg", "fish", "tea", "water", "cake", "soup"],
  },
  {
    rank: 2,
    node: 3,
    title: "Body & Clothes",
    blurb: "Words for body parts and everyday clothing.",
    words: ["head", "hand", "foot", "leg", "eye", "nose", "shirt", "dress", "shoe", "hat"],
  },
  {
    rank: 2,
    node: 4,
    title: "School & Playtime",
    blurb: "Early school vocabulary mixed with fun and games.",
    words: ["school", "class", "teacher", "student", "pen", "pencil", "ball", "game", "song", "story"],
  },
  {
    rank: 2,
    node: 5,
    title: "Places Around Town",
    blurb: "The boss node for Toddler rank: common places learners navigate daily.",
    words: ["park", "shop", "road", "bus", "bank", "market", "library", "station", "garden", "bridge"],
  },
  {
    rank: 3,
    node: 1,
    title: "My Day & Routines",
    blurb: "A2 starter verbs for describing the flow of a normal day.",
    words: ["wake", "brush", "wash", "cook", "study", "clean", "visit", "start", "finish", "rest"],
  },
  {
    rank: 3,
    node: 2,
    title: "Travel & Transport",
    blurb: "Practical travel vocabulary for moving around and checking in.",
    words: ["ticket", "train", "airport", "hotel", "taxi", "travel", "luggage", "passport", "arrive", "depart"],
  },
  {
    rank: 3,
    node: 3,
    title: "Time & Calendar",
    blurb: "Words for dates, periods of time, and planning ahead.",
    words: ["monday", "tuesday", "today", "tomorrow", "morning", "evening", "month", "weekend", "holiday", "season"],
  },
  {
    rank: 3,
    node: 4,
    title: "Feelings & Health",
    blurb: "Describe how you feel, physically and emotionally.",
    words: ["happy", "sad", "angry", "tired", "sick", "hungry", "thirsty", "nervous", "calm", "healthy"],
  },
  {
    rank: 3,
    node: 5,
    title: "Shopping & Money",
    blurb: "The boss node for Student rank: survival words for shops and spending.",
    words: ["price", "money", "buy", "sell", "cheap", "expensive", "wallet", "change", "receipt", "store"],
  },
  {
    rank: 4,
    node: 1,
    title: "Home Tasks & Chores",
    blurb: "A higher A2 step: practical verbs for maintenance and chores.",
    words: ["laundry", "vacuum", "tidy", "repair", "sweep", "borrow", "polish", "fold", "build", "paint"],
  },
  {
    rank: 4,
    node: 2,
    title: "Nature & Seasons",
    blurb: "Landscape and weather vocabulary that expands beyond the basics.",
    words: ["spring", "summer", "autumn", "winter", "river", "valley", "island", "desert", "thunder", "forest"],
  },
  {
    rank: 4,
    node: 3,
    title: "Work & Study Tools",
    blurb: "Useful classroom and workplace words for organized communication.",
    words: ["project", "lesson", "homework", "notebook", "schedule", "meeting", "email", "document", "research", "report"],
  },
  {
    rank: 4,
    node: 4,
    title: "Messages & Technology",
    blurb: "Everyday digital vocabulary that modern learners use constantly.",
    words: ["message", "website", "computer", "keyboard", "screen", "charger", "online", "search", "upload", "folder"],
  },
  {
    rank: 4,
    node: 5,
    title: "Social Life & Events",
    blurb: "The boss node for Scholar rank: invitations, celebrations, and social gatherings.",
    words: ["party", "wedding", "birthday", "concert", "picnic", "guest", "invite", "celebrate", "festival", "neighbor"],
  },
  {
    rank: 5,
    node: 1,
    title: "Opinions & Preferences",
    blurb: "B1 vocabulary for expressing taste, judgment, and personal response.",
    words: ["opinion", "prefer", "agree", "disagree", "choice", "favorite", "useful", "boring", "exciting", "improve"],
  },
  {
    rank: 5,
    node: 2,
    title: "Problems & Solutions",
    blurb: "Words for handling obstacles, mistakes, and practical fixes.",
    words: ["problem", "solution", "mistake", "damage", "effort", "manage", "solve", "support", "reduce", "prevent"],
  },
  {
    rank: 5,
    node: 3,
    title: "Goals & Habits",
    blurb: "Progress language for personal growth, planning, and consistency.",
    words: ["habit", "routine", "target", "plan", "progress", "practice", "focus", "achieve", "delay", "commit"],
  },
  {
    rank: 5,
    node: 4,
    title: "Media & Culture",
    blurb: "Discuss film, art, fashion, and how audiences react.",
    words: ["article", "movie", "series", "actor", "museum", "music", "fashion", "audience", "review", "drama"],
  },
  {
    rank: 5,
    node: 5,
    title: "Environment & Responsibility",
    blurb: "The boss node for Sage rank: everyday environmental literacy.",
    words: ["recycle", "pollution", "climate", "energy", "plastic", "protect", "waste", "resource", "wildlife", "carbon"],
  },
  {
    rank: 6,
    node: 1,
    title: "Work & Leadership",
    blurb: "B2 words for teams, deadlines, and professional responsibility.",
    words: ["leadership", "deadline", "strategy", "manager", "client", "budget", "profit", "teamwork", "performance", "mentor"],
  },
  {
    rank: 6,
    node: 2,
    title: "Learning & Debate",
    blurb: "Language for building arguments and reasoning with evidence.",
    words: ["argument", "evidence", "analysis", "debate", "compare", "contrast", "conclusion", "assumption", "reasoning", "counter"],
  },
  {
    rank: 6,
    node: 3,
    title: "Travel & Global Issues",
    blurb: "Broader international vocabulary around movement, borders, and culture.",
    words: ["border", "refugee", "tourism", "culture", "abroad", "customs", "economy", "language", "migration", "remote"],
  },
  {
    rank: 6,
    node: 4,
    title: "Science & Innovation",
    blurb: "Core B2 academic words for discovery, technology, and measurement.",
    words: ["experiment", "theory", "data", "measure", "invention", "device", "digital", "automate", "discover", "formula"],
  },
  {
    rank: 6,
    node: 5,
    title: "Law & Society",
    blurb: "The boss node for Yogi rank: civic language with legal and social focus.",
    words: ["justice", "policy", "rights", "legal", "court", "citizen", "duty", "prison", "reform", "welfare"],
  },
  {
    rank: 7,
    node: 1,
    title: "Academic Thinking",
    blurb: "C1 language for abstract thought, interpretation, and structured argument.",
    words: ["concept", "framework", "perspective", "interpretation", "evaluate", "synthesis", "critical", "thesis", "discourse", "premise"],
  },
  {
    rank: 7,
    node: 2,
    title: "Economy & Institutions",
    blurb: "Institutional and economic vocabulary for advanced discussion.",
    words: ["inflation", "regulation", "commerce", "finance", "investment", "governance", "bureaucracy", "taxation", "subsidy", "enterprise"],
  },
  {
    rank: 7,
    node: 3,
    title: "Psychology & Behaviour",
    blurb: "Advanced words for motivation, emotion, judgment, and bias.",
    words: ["motivation", "cognition", "empathy", "impulse", "anxiety", "resilience", "attitude", "perception", "bias", "instinct"],
  },
  {
    rank: 7,
    node: 4,
    title: "Media & Influence",
    blurb: "Language for persuasion, credibility, and information control.",
    words: ["narrative", "propaganda", "editorial", "platform", "persuasion", "misinformation", "exposure", "credibility", "amplify", "agenda"],
  },
  {
    rank: 7,
    node: 5,
    title: "Ethics & Power",
    blurb: "The boss node for Guru rank: moral language for authority and public responsibility.",
    words: ["integrity", "authority", "privilege", "accountability", "transparency", "ideology", "oppression", "diplomacy", "mandate", "consent"],
  },
  {
    rank: 8,
    node: 1,
    title: "Philosophy & Abstraction",
    blurb: "C2 vocabulary for identity, existence, and highly abstract thought.",
    words: ["ontology", "paradox", "essence", "existence", "consciousness", "morality", "identity", "transcendence", "epistemology", "dualism"],
  },
  {
    rank: 8,
    node: 2,
    title: "Literature & Interpretation",
    blurb: "Deep interpretive vocabulary for texts, rhetoric, and literary meaning.",
    words: ["metaphor", "symbolism", "nuance", "allusion", "ambiguity", "prose", "rhetoric", "irony", "motif", "allegory"],
  },
  {
    rank: 8,
    node: 3,
    title: "Diplomacy & Conflict",
    blurb: "Advanced geopolitical language for negotiation, treaties, and escalation.",
    words: ["negotiation", "sovereignty", "treaty", "sanctions", "ceasefire", "mediation", "insurgency", "alliance", "escalation", "tribunal"],
  },
  {
    rank: 8,
    node: 4,
    title: "Systems & Complexity",
    blurb: "High-level vocabulary for dynamic systems, resilience, and interdependence.",
    words: ["ecosystem", "feedback", "emergence", "entropy", "nonlinear", "interdependence", "resilience", "optimization", "infrastructure", "cascade"],
  },
  {
    rank: 8,
    node: 5,
    title: "Precision & Nuance",
    blurb: "The final boss node: words for exactness, subtle reasoning, and refined expression.",
    words: ["meticulous", "articulate", "coherent", "succinct", "granular", "discern", "infer", "qualify", "approximate", "definitive"],
  },
];

function buildListTitle(entry) {
  return `Journey R${entry.rank}N${entry.node} - ${entry.title}`;
}

function buildDescription(entry) {
  const rankMeta = RANK_META[entry.rank];
  return `${rankMeta.name} Rank / CEFR ${rankMeta.cefr}. ${entry.blurb}`;
}

function buildTags(entry) {
  const rankMeta = RANK_META[entry.rank];
  return [
    "journey",
    "official",
    "curriculum",
    `journey-rank-${entry.rank}`,
    `journey-node-${entry.node}`,
    `rank-${rankMeta.name.toLowerCase()}`,
    `cefr-${rankMeta.cefr.toLowerCase()}`,
  ];
}

function fallbackWordData(words, entry) {
  return words.map((word) => ({
    word,
    wordData: `${word} is a ${RANK_META[entry.rank].cefr} vocabulary word from ${entry.title.toLowerCase()}.`,
  }));
}

async function enrichWordsWithAI(words, entry) {
  if (!process.env.OPENAI_API_KEY || FORCE_FALLBACK) {
    return fallbackWordData(words, entry);
  }

  try {
    const prompt = [
      `You are creating hangman hints for an English learning app.`,
      `CEFR level: ${RANK_META[entry.rank].cefr}.`,
      `List title: ${entry.title}.`,
      `Return JSON only in this exact shape: {"items":[{"word":"sun","wordData":"short learner-friendly hint"}]}.`,
      `Keep each wordData under 12 words, simple, clear, and not repetitive.`,
      `Words: ${words.join(", ")}`,
    ].join("\n");

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You write concise vocabulary hints for language learners.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 45000,
      },
    );

    const payload = JSON.parse(response.data.choices[0].message.content);
    const items = Array.isArray(payload.items) ? payload.items : [];
    const hintMap = new Map(
      items
        .filter((item) => item && item.word && item.wordData)
        .map((item) => [String(item.word).toLowerCase(), String(item.wordData).trim()]),
    );

    return words.map((word) => ({
      word,
      wordData:
        hintMap.get(word.toLowerCase()) ||
        `${word} is a ${RANK_META[entry.rank].cefr} vocabulary word from ${entry.title.toLowerCase()}.`,
    }));
  } catch (error) {
    console.warn(`AI enrichment failed for ${buildListTitle(entry)}. Using fallback hints.`);
    return fallbackWordData(words, entry);
  }
}

function validateCurriculum() {
  if (CURRICULUM.length !== 40) {
    throw new Error(`Expected 40 node lists, found ${CURRICULUM.length}`);
  }

  const seenTitles = new Set();
  const seenNodes = new Set();

  for (const entry of CURRICULUM) {
    const nodeKey = `${entry.rank}-${entry.node}`;
    if (seenTitles.has(entry.title)) {
      throw new Error(`Duplicate title found: ${entry.title}`);
    }
    if (seenNodes.has(nodeKey)) {
      throw new Error(`Duplicate node mapping found: ${nodeKey}`);
    }
    if (!RANK_META[entry.rank]) {
      throw new Error(`Invalid rank in curriculum: ${entry.rank}`);
    }
    if (!Array.isArray(entry.words) || entry.words.length < 10) {
      throw new Error(`Node ${nodeKey} needs at least 10 words`);
    }

    seenTitles.add(entry.title);
    seenNodes.add(nodeKey);
  }
}

async function upsertJourneyList(entry) {
  const title = buildListTitle(entry);
  const description = buildDescription(entry);
  const tags = buildTags(entry);
  const words = await enrichWordsWithAI(entry.words, entry);

  const list = await List.findOneAndUpdate(
    { title },
    {
      title,
      description,
      words,
      createdBy: SYSTEM_EMAIL,
      tags,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  await NodeList.findOneAndUpdate(
    {
      rank: entry.rank,
      node: entry.node,
      listId: list._id,
    },
    {
      rank: entry.rank,
      node: entry.node,
      listId: list._id,
      order: 0,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  return list;
}

async function main() {
  validateCurriculum();

  if (DRY_RUN) {
    const countsByRank = CURRICULUM.reduce((acc, entry) => {
      acc[entry.rank] = (acc[entry.rank] || 0) + 1;
      return acc;
    }, {});

    console.log("Journey curriculum dry run passed.");
    console.log(`Ranks: ${Object.keys(countsByRank).length}`);
    console.log(`Nodes: ${CURRICULUM.length}`);
    console.log(`Words total: ${CURRICULUM.reduce((sum, entry) => sum + entry.words.length, 0)}`);
    Object.entries(countsByRank).forEach(([rank, count]) => {
      console.log(`Rank ${rank} (${RANK_META[rank].name}, ${RANK_META[rank].cefr}): ${count} nodes`);
    });
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI not found in .env.local");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri);
  console.log("Connected.");

  let createdOrUpdated = 0;

  for (const entry of CURRICULUM) {
    const list = await upsertJourneyList(entry);
    createdOrUpdated += 1;
    console.log(
      `Seeded Rank ${entry.rank} Node ${entry.node}: ${list.title} (${entry.words.length} words)`,
    );
  }

  await mongoose.disconnect();
  console.log(`Done. Seeded ${createdOrUpdated} journey lists and assignments.`);
}

main().catch(async (error) => {
  console.error("Journey curriculum seed failed:", error.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});