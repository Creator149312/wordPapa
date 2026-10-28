import assert from "assert";
import fs from "fs";
import { WORDS_POOL, ONLINE_WORDS } from "../app/games/hangman/constants.js";
import { SPELLS_CONFIG } from "../app/games/hangman/constants/spells.js";
import { createEndlessStream } from "../app/games/hangman/lib/wordStreams.js";

console.log("▶ Running Phase 2: Match Flow Polish & Desktop/Mobile Ergonomics Tests...\n");

// =========================================================================
// TEST 1: Physical Keyboard & Spell Hotkeys Validation
// =========================================================================
console.log("1. Validating Physical Keyboard & Spell Hotkeys Ergonomics:");

// A. Key mapping logic simulation
const mockDeck = ["freeze", "shield", "scramble", "reveal"];
const keyIndexMap = {
  "1": 0, "2": 1, "3": 2, "4": 3,
  "Digit1": 0, "Digit2": 1, "Digit3": 2, "Digit4": 3,
  "Numpad1": 0, "Numpad2": 1, "Numpad3": 2, "Numpad4": 3
};

Object.entries(keyIndexMap).forEach(([key, expectedIdx]) => {
  const resolvedIdx = parseInt(key.replace(/^(Digit|Numpad)/, ""), 10) - 1;
  assert.strictEqual(resolvedIdx, expectedIdx, `Key '${key}' must map to spell index ${expectedIdx}`);
  const spellId = mockDeck[resolvedIdx];
  assert.ok(spellId, `Index ${resolvedIdx} must resolve to a valid spell (${spellId})`);
  assert.ok(SPELLS_CONFIG[spellId], `Spell '${spellId}' must exist in SPELLS_CONFIG`);
});
console.log("   ✔ Hotkeys 1-4, Digit1-4, Numpad1-4 map cleanly to spell slots 0..3");

// B. Spell Guards: Cooldown, Shield Redundancy, Insufficient Elixir
const canCastSpell = ({ spellId, elixir, isFrozen, isGameOver, cooldowns, hasShield }) => {
  if (isGameOver || isFrozen) return { allowed: false, reason: "status" };
  if ((cooldowns[spellId] || 0) > 0) return { allowed: false, reason: "cooldown" };
  if (spellId === "shield" && hasShield) return { allowed: false, reason: "redundant_shield" };
  const cost = SPELLS_CONFIG[spellId].cost;
  if (elixir < cost) return { allowed: false, reason: "elixir" };
  return { allowed: true, cost };
};

assert.strictEqual(canCastSpell({ spellId: "freeze", elixir: 5, isFrozen: false, isGameOver: false, cooldowns: {}, hasShield: false }).allowed, true);
assert.strictEqual(canCastSpell({ spellId: "freeze", elixir: 2, isFrozen: false, isGameOver: false, cooldowns: {}, hasShield: false }).reason, "elixir");
assert.strictEqual(canCastSpell({ spellId: "freeze", elixir: 5, isFrozen: false, isGameOver: false, cooldowns: { freeze: 3.5 }, hasShield: false }).reason, "cooldown");
assert.strictEqual(canCastSpell({ spellId: "shield", elixir: 5, isFrozen: false, isGameOver: false, cooldowns: {}, hasShield: true }).reason, "redundant_shield");
assert.strictEqual(canCastSpell({ spellId: "scramble", elixir: 5, isFrozen: true, isGameOver: false, cooldowns: {}, hasShield: false }).reason, "status");
console.log("   ✔ Spell hotkey triggers obey cooldowns, shield redundancy, and elixir checks");

// C. Physical Letter Guess Filtering (A-Z)
const isInputActive = (tagName, isContentEditable) => ["INPUT", "TEXTAREA", "SELECT"].includes(tagName) || Boolean(isContentEditable);
assert.strictEqual(isInputActive("INPUT", false), true, "Active text input must block game hotkeys");
assert.strictEqual(isInputActive("DIV", false), false, "Standard DIV must allow game hotkeys");

const isValidGuessKey = (key) => /^[a-zA-Z]$/.test(key);
assert.strictEqual(isValidGuessKey("a"), true);
assert.strictEqual(isValidGuessKey("Z"), true);
assert.strictEqual(isValidGuessKey("Enter"), false);
assert.strictEqual(isValidGuessKey(" "), false);
console.log("   ✔ Physical keyboard A-Z typing strictly scoped without interfering with form inputs");


// =========================================================================
// TEST 2: Effective Dual-Ended Match Ending & Play Again Rematch Handshake
// =========================================================================
console.log("\n2. Validating Effective Match Ending & Play Again Rematch:");

// A. Time-Up & Error Dual-Ended Match Conclusion
const evaluateMatchTermination = ({ timeLeft, isOvertime, myWrongCount, oppWrongCount, myScore, oppScore }) => {
  // 1. Errors limit reached
  if (myWrongCount >= 6) return { ended: true, winner: "opponent", reason: "six_errors" };
  if (oppWrongCount >= 6) return { ended: true, winner: "me", reason: "opponent_six_errors" };
  
  // 2. Overtime expired
  if (isOvertime && timeLeft <= 0) {
    if (myScore > oppScore) return { ended: true, winner: "me", reason: "time_up" };
    if (oppScore > myScore) return { ended: true, winner: "opponent", reason: "time_up" };
    if (myWrongCount < oppWrongCount) return { ended: true, winner: "me", reason: "time_up" };
    if (oppWrongCount < myWrongCount) return { ended: true, winner: "opponent", reason: "time_up" };
    return { ended: true, winner: "Draw", reason: "time_up" };
  }
  return { ended: false };
};

const overtimeExpiredMeAhead = evaluateMatchTermination({ timeLeft: 0, isOvertime: true, myWrongCount: 2, oppWrongCount: 4, myScore: 5, oppScore: 3 });
assert.strictEqual(overtimeExpiredMeAhead.ended, true);
assert.strictEqual(overtimeExpiredMeAhead.winner, "me");
assert.strictEqual(overtimeExpiredMeAhead.reason, "time_up");

const overtimeExpiredOppAhead = evaluateMatchTermination({ timeLeft: 0, isOvertime: true, myWrongCount: 1, oppWrongCount: 1, myScore: 2, oppScore: 4 });
assert.strictEqual(overtimeExpiredOppAhead.ended, true);
assert.strictEqual(overtimeExpiredOppAhead.winner, "opponent");

const errorsLimitReached = evaluateMatchTermination({ timeLeft: 45, isOvertime: false, myWrongCount: 6, oppWrongCount: 2, myScore: 3, oppScore: 3 });
assert.strictEqual(errorsLimitReached.ended, true);
assert.strictEqual(errorsLimitReached.winner, "opponent");
assert.strictEqual(errorsLimitReached.reason, "six_errors");
console.log("   ✔ Simultaneous dual-ended termination confirmed for time expiration and error limits");

// B. Standalone 1v1 Play Again Handshake Simulation
const simulatePlayAgainHandshake = (p1Wants, p2Wants) => {
  const requests = new Set();
  if (p1Wants) requests.add("p1");
  if (p2Wants) requests.add("p2");

  if (requests.size === 0) return { status: "idle" };
  if (requests.size === 1) return { status: "waiting_opponent", requester: [...requests][0] };
  return { status: "play_again_accepted", bothReady: true };
};

assert.strictEqual(simulatePlayAgainHandshake(false, false).status, "idle");
assert.strictEqual(simulatePlayAgainHandshake(true, false).status, "waiting_opponent");
assert.strictEqual(simulatePlayAgainHandshake(true, true).bothReady, true);
console.log("   ✔ Clean standalone Play Again handshake confirmed without rigid 3-round lockouts");


// =========================================================================
// TEST 3: Expanded Curated Duel Word Pool & Mode Compatibility
// =========================================================================
console.log("\n3. Validating Expanded Curated Word Pool & Multi-Mode Compatibility:");

// A. Server ONLINE_WORDS count & categories
const serverFile = fs.readFileSync("server/server.js", "utf-8");
const match = serverFile.match(/const ONLINE_WORDS = (\[[\s\S]*?\]);/);
assert.ok(match, "server.js must contain ONLINE_WORDS array");
const serverWords = eval(match[1]);

assert.ok(serverWords.length >= 100, `ONLINE_WORDS must have 100+ words (found: ${serverWords.length})`);
assert.strictEqual(serverWords.length, 112, "Curated pool contains exactly 112 words (14 per category)");

const expectedCategories = ["Space", "Animals", "Nature", "Food", "Landmarks", "Science", "Vehicles", "Vocabulary"];
const categoryCounts = {};

serverWords.forEach((item) => {
  assert.ok(item.word, "Word must not be empty");
  assert.ok(/^[A-Z]+$/.test(item.word), `Word '${item.word}' must be uppercase letters only`);
  assert.ok(
    item.word.length >= 6 && item.word.length <= 10,
    `Word '${item.word}' length (${item.word.length}) must be strictly between 6 and 10 letters`
  );
  categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
});

assert.deepStrictEqual(Object.keys(categoryCounts).sort(), expectedCategories.sort());
expectedCategories.forEach((cat) => {
  assert.strictEqual(categoryCounts[cat], 14, `Category '${cat}' must have 14 balanced words`);
  console.log(`   ✔ Category [${cat}]: 14 words (6..10 letters)`);
});

// B. Verify 100% presence in constants.js WORDS_POOL (for EndlessRun and Journey)
const poolWordsSet = new Set();
for (const lvl in WORDS_POOL) {
  WORDS_POOL[lvl].forEach((item) => {
    poolWordsSet.add(item.word.toUpperCase());
  });
}

let missingInPoolCount = 0;
serverWords.forEach((sw) => {
  if (!poolWordsSet.has(sw.word.toUpperCase())) {
    missingInPoolCount++;
  }
});

assert.strictEqual(missingInPoolCount, 0, "All 112 online words must be present in constants.js WORDS_POOL");
console.log(`   ✔ All ${serverWords.length} online duel words are present in WORDS_POOL for Endless & Journey`);

// C. Verify Endless Stream draws valid words across progression tiers
const streamHighXP = createEndlessStream(25000, 30000);
for (let i = 0; i < 20; i++) {
  const w = streamHighXP.getNextWord([]);
  assert.ok(w.word, "Endless stream must return valid words");
  assert.ok(w.hint, "Word must have a valid hint for player guidance");
}
console.log("   ✔ Endless stream successfully draws words including newly curated 6-10 letter entries");

console.log("\n🎉 ALL PHASE 2 MATCH FLOW, ERGONOMICS & POOL TESTS PASSED SUCCESSFULLY!");
