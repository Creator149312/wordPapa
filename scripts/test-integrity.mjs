import assert from "assert";
import { createEndlessStream, createListStream } from "../app/games/hangman/lib/wordStreams.js";
import { calculateLevel, calculateProgress, getEndlessRewards } from "../app/games/hangman/lib/progression.js";

console.log("▶ Running Word Stream Engine Tests...");

// Test Endless Stream Provider
const endlessStream = createEndlessStream(1500, 2000);
assert.strictEqual(endlessStream.type, "endless");
const sampleWord = endlessStream.getNextWord([]);
assert.ok(sampleWord.word, "Endless stream must return a word object with a word property");
assert.ok(sampleWord.wordLevel >= 1 && sampleWord.wordLevel <= 8, "Word level must be in 1..8");
console.log("✔ Endless Stream Provider passed:", { word: sampleWord.word, level: sampleWord.wordLevel });

// Test List Stream Provider
const mockList = [
  { word: "ephemeral", wordData: "lasting for a very short time" },
  { word: "serendipity", wordData: "finding good things without looking" }
];
const listStream = createListStream({ listId: "test-list-123", listWords: mockList, listTitle: "SAT Vocabulary" });
assert.strictEqual(listStream.type, "list");
assert.strictEqual(listStream.title, "SAT Vocabulary");
const words = listStream.getWords();
assert.strictEqual(words.length, 2);
assert.strictEqual(words[0].word, "ephemeral");
assert.strictEqual(words[0].hint, "lasting for a very short time");
assert.strictEqual(words[0].category, "SAT Vocabulary");
console.log("✔ List Stream Provider passed:", words[0]);

console.log("▶ Running Progression Invariant Tests...");

// User with existing high XP must remain in their corresponding Rank
const masterProfile = calculateLevel(120000);
assert.strictEqual(masterProfile.name, "Master");
assert.strictEqual(masterProfile.level, 8);
console.log("✔ High-rank player career XP preserved:", { level: masterProfile.level, name: masterProfile.name });

const toddlerProfile = calculateLevel(600);
assert.strictEqual(toddlerProfile.name, "Toddler");
assert.strictEqual(toddlerProfile.level, 2);
console.log("✔ Intermediate player rank preserved:", { level: toddlerProfile.level, name: toddlerProfile.name });

// Reward calculation with wrong guess penalty must never return negative or zero
const rewards = getEndlessRewards(6, 3, 2, 4);
assert.ok(rewards.xpGain > 0, "Earned XP must be positive");
assert.ok(rewards.coinGain > 0, "Earned coins must be positive");
console.log("✔ Rewards invariant passed:", rewards);

console.log("\n✅ ALL INTEGRITY AND STREAM TESTS PASSED SUCCESSFULLY!");
