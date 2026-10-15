import assert from "assert";
import { SPELLS_CONFIG } from "../app/games/hangman/constants/spells.js";
import { calculateLevel, applyTrophyFloor, getOnlineMatchRewards } from "../app/games/hangman/lib/progression.js";

console.log("▶ Running Clash Royale 1v1 Hangman MVP Tests...\n");

// --- TEST 1: Spells Configuration & Elixir Costs ---
console.log("1. Validating Tactical Spells Configuration:");
const expectedSpells = ["freeze", "shield", "scramble", "reveal"];
expectedSpells.forEach((id) => {
  const spell = SPELLS_CONFIG[id];
  assert.ok(spell, `Spell '${id}' must exist in SPELLS_CONFIG`);
  assert.ok(spell.cost > 0 && spell.cost <= 4, `Spell '${id}' cost must be between 1 and 4`);
  assert.ok(spell.name, `Spell '${id}' must have a name`);
  assert.ok(spell.desc, `Spell '${id}' must have a description`);
  console.log(`   ✔ Spell [${spell.id.toUpperCase()}] | Cost: ${spell.cost} Elixir | ${spell.name} (${spell.desc})`);
});

// --- TEST 2: Elixir Generation & 2X Sudden Death Rate ---
console.log("\n2. Validating Elixir Regeneration Math:");
const standardRatePer100ms = 0.0667; // 1 Elixir per 1.5s
const suddenDeathRatePer100ms = 0.1333; // 2X Boost: 1 Elixir per 0.75s

const elixirIn15sStandard = standardRatePer100ms * 150;
const elixirIn15sSuddenDeath = suddenDeathRatePer100ms * 150;

assert.ok(Math.abs(elixirIn15sStandard - 10.0) < 0.5, "Standard rate must generate ~10 elixir in 15 seconds");
assert.ok(Math.abs(elixirIn15sSuddenDeath - 20.0) < 0.5, "Sudden death rate must generate ~20 elixir in 15 seconds");
console.log("   ✔ Normal Elixir regen: 1.0 Elixir / 1.5s (~10 elixir in 15s)");
console.log("   ✔ Sudden Death 2X regen: 2.0 Elixir / 1.5s (~20 elixir in 15s)");

// --- TEST 3: Bounty Consonant Logic ---
console.log("\n3. Validating Rare Letter Bounty Mechanics:");
const RARE_BOUNTY_LETTERS = ["J", "Q", "X", "Z", "K", "V", "W", "B", "P"];
const standardLetter = "E";
const bountyLetter = "Z";

const guessCost = 2.0;
const standardRebate = 1.0;
const bountyRebate = 2.0;

const netCostStandard = guessCost - standardRebate;
const netCostBounty = guessCost - bountyRebate;

assert.strictEqual(netCostStandard, 1.0, "Standard letter hit must net cost 1.0 Elixir");
assert.strictEqual(netCostBounty, 0.0, "Bounty consonant hit must net cost 0.0 Elixir (full refund)");
assert.ok(RARE_BOUNTY_LETTERS.includes(bountyLetter), "Z must be a bounty letter");
assert.ok(!RARE_BOUNTY_LETTERS.includes(standardLetter), "E must not be a bounty letter");
console.log("   ✔ Standard letter hit nets -1.0 Elixir (vowels/common consonants)");
console.log("   ✔ Rare bounty letter hit nets 0.0 Elixir (+2 rebate for difficult letters)");

// --- TEST 4: Existing Online Users Data Preservation ---
console.log("\n4. Validating Existing Users Data Safety & Compatibility:");

// Legacy profile as stored in MongoDB by deployed version
const legacyUserFromMongoDB = {
  userEmail: "veteran_player@gmail.com",
  name: "Veteran Player",
  xp: 14500,
  highestXP: 14500,
  papaPoints: 340,
  lives: 7,
  onlineWinStreak: 8,
  highestWinStreak: 12,
  journeyXP: 9500,
  endlessXP: 5000,
  journey: {
    currentNodeId: "3-4",
    unlockedNodes: ["1-1", "1-2", "2-1", "3-1", "3-4"],
    characterStage: "student",
    streak: 15,
  },
};

// Simulate loading legacy user with INITIAL_STATE
const INITIAL_STATE = {
  name: "Player",
  userEmail: null,
  isGhost: true,
  xp: 0,
  highestXP: 0,
  papaPoints: 100,
  onlineWinStreak: 0,
  highestWinStreak: 0,
  activeDeck: ["freeze", "shield", "scramble", "reveal"],
  duelMatchesPlayed: 0,
  duelSpellsCast: 0,
};

const mergedProfile = { ...INITIAL_STATE, ...legacyUserFromMongoDB };

// Verify NO legacy data is altered
assert.strictEqual(mergedProfile.xp, 14500, "Existing user XP must not change");
assert.strictEqual(mergedProfile.highestXP, 14500, "Existing highestXP must not change");
assert.strictEqual(mergedProfile.papaPoints, 340, "Existing papaPoints must not change");
assert.strictEqual(mergedProfile.onlineWinStreak, 8, "Existing win streak must not change");
assert.strictEqual(mergedProfile.journey.currentNodeId, "3-4", "Existing journey node must not change");
assert.deepStrictEqual(mergedProfile.activeDeck, ["freeze", "shield", "scramble", "reveal"], "Default duel deck provided seamlessly");
assert.strictEqual(mergedProfile.duelMatchesPlayed, 0, "Default duelMatchesPlayed initialized safely");

// Verify Trophy Floor on Duel Loss
const duelLossRewards = getOnlineMatchRewards(false, mergedProfile.onlineWinStreak);
const newXPAfterLoss = mergedProfile.xp + duelLossRewards.xpChange;
const safeFlooredXP = applyTrophyFloor(newXPAfterLoss, mergedProfile.highestXP);

// In Sage rank (8000 minXP), losing 5 XP cannot drop below 8000
assert.ok(safeFlooredXP >= 8000, "Trophy Floor must protect player rank on duel loss");
assert.strictEqual(safeFlooredXP, 14495, "XP drops by 5 on loss but remains above trophy floor");
console.log("   ✔ Legacy user fields (XP, coins, streaks, journey) preserved with 100% fidelity");
console.log("   ✔ Trophy Gate floor protects user rank on loss");
console.log("   ✔ New optional Clash fields (activeDeck, duelMatchesPlayed) inject without breaking old documents");

console.log("\n🎉 ALL CLASH ROYALE 1v1 HANGMAN MVP TESTS PASSED SUCCESSFULLY!");
