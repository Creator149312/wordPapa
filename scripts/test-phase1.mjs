import assert from "assert";
import { getContextScenario } from "../app/games/hangman/lib/wordClues.js";

console.log("▶ Running Phase 1 Verification Tests...\n");

// 1. Test Contextual Micro-Narratives Clue Generator
console.log("1. Testing Contextual Micro-Narratives (wordClues.js)...");

// A curated scenario
const curatedScenario = getContextScenario("METICULOUS");
assert.ok(curatedScenario.includes("________"), "Curated scenario must contain cloze blank");
assert.ok(curatedScenario.toLowerCase().includes("precision") || curatedScenario.toLowerCase().includes("watchmaker"));
console.log("✔ Curated scenario returned:", curatedScenario);

// A synthesized scenario from category & hint
const synthesizedScenario = getContextScenario("ZEPHYR", "a soft gentle breeze", "Weather");
assert.ok(synthesizedScenario.includes("________"), "Synthesized scenario must contain cloze blank");
assert.ok(synthesizedScenario.includes("Weather"), "Synthesized scenario must include category");
console.log("✔ Synthesized scenario returned:", synthesizedScenario);

// Fallback scenario
const fallbackScenario = getContextScenario("UNKNOWNWORD");
assert.ok(fallbackScenario.includes("________"), "Fallback scenario must contain cloze blank");
console.log("✔ Fallback scenario returned:", fallbackScenario);

console.log("\n✅ ALL PHASE 1 INTEGRITY TESTS PASSED!");
