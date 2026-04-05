# WordPapa: Progression, XP Allocation & Leaderboard System

## Overview

WordPapa is a multi-mode word game where users earn XP through different gameplay styles (Journey mode for structured learning, Endless Run for skill mastery). Users progress through **8 ranks** determined by cumulative XP. The leaderboard system uses **four independent tabs** to surface different player archetypes — inspired by Clash Royale's trophy system and Duolingo's weekly leagues.

---

## Part 1: The Modes

### Mode 1: Journey Mode (Structured Learning)

**Concept**: A node-based progression path where users unlock nodes sequentially through a rank system. Each node contains word lists that must be dominated before advancing.

**How it Works**:
1. Users start at **Rank 1, Node 1** (e.g., "1-1")
2. Each node contains **5 word lists** (e.g., animals, colors, common verbs)
3. User plays **Classic Hangman** on each list — winning = list "mastered"
4. When all 5 lists in a node are mastered → **node complete** → Next node unlocked
5. When all 5 nodes in a rank are completed → **rank complete (Arena cleared)** → Rank bonus XP awarded → Next rank unlocked

**Visual Progression**:
```
Rank 1                  Rank 2                   Rank 3
├─ Node 1-1            ├─ Node 2-1
│  ├─ List A (50%)     │  ├─ List A ✓
│  ├─ List B ✓         │  ├─ List B ✓
│  ├─ List C ✓         │  ├─ List C (0%)
│  ├─ List D (100%)    │  ├─ List D ✓
│  └─ List E (75%)     │  └─ List E ✓
│                       │
├─ Node 1-2 (locked)   ├─ Node 2-2 → Node 2-5
│                       │
└─ Currently Playing   └─ [2/5 nodes done]

Legend: ✓ = mastered | (X%) = progress on current play session | (locked) = unlocked after previous node
```

**XP Formula (per word solved)**:
```
XP per word = (word_length × 8) + (current_rank_id × 12)

Example (Rank 3, solving 6-letter word):
  = (6 × 8) + (3 × 12)
  = 48 + 36
  = 84 XP
```

**Bonus XP**:
- **Node Clear Bonus**: 0 (just unlocks next node)
- **Rank Clear (Arena) Bonus**: `500 × rank_id`
  - Rank 1 arena clear = +500 XP
  - Rank 5 arena clear = +2,500 XP
  - Rank 8 arena clear = +4,000 XP

**Why This Formula**:
- Base (×8) is lower than Endless to reward consistency over intensity
- Rank multiplier (+rankId ×12) incentivizes progressing through the game's content
- Arena bonuses are front-loaded to reward clearing early ranks and keep players engaged

---

### Mode 2: Endless Run (Skill Mastery)

**Concept**: Infinite survival mode where you keep solving words until you hit **3 global mistakes** (lives). How long you survive defines your score.

**How it Works**:
1. Game starts with **3 lives** (global mistake limit)
2. Words spawn infinitely, each with difficulty scaling
3. Solve word = +1 word count, +XP earned
4. Wrong letter guess = +1 local mistake (on that word)
5. All letters guessed wrong (word lost) = -1 global life
6. 3 global lives lost = Game Over
7. **Optional**: Spend **papa coins** to revive mid-game

**Game State Tracking**:
```
Session Start:
  Lives: 3
  Global Mistakes: 0
  Words Solved: 0
  XP Earned: 0
  Best Run: Track in localStorage for visual display

During Play:
  Word 1: 5 letters, 2 wrong guesses → SOLVED
    XP += (5 × 10) + (wordLevel × 15)
  Word 2: 6 letters, all wrong → LOST (life -1)
    Lives: 2, Global Mistakes: 1
  Word 3-7: All solved
  ...continue until Lives = 0

Session End:
  Save: highestEndlessXP = max(previous, totalXPEarned)
  Save: highestEndlessRun = max(words solved)
  Save: global xp += totalXPEarned
```

**XP Formula (per word solved)**:
```
XP per word = (word_length × 10) + (word_level × 15)
Health bonus (per remaining life at session end) = ?

Example (6-letter word, level 4, 1 life remaining):
  = (6 × 10) + (4 × 15)
  = 60 + 60
  = 120 XP (plus applied once, based on health)
```

**Word Level System**:
- Auto-scales based on player's current rank
- Level 1 (Rank 1): Easy words (3–5 letters)
- Level 5 (Rank 5): Medium words (6–8 letters)
- Level 10 (Rank 8): Hard words (8–10 letters)

**Bonus XP**:
- **Health Bonus**: Remaining lives × bonus per life
  - This is applied at session end, rewarding survival skill
  - Encourages defensive play ( few wrong guesses)

**Why This Formula**:
- Base (×10 vs ×8) is higher than Journey to reward pure word knowledge
- Word level multiplier (×15) peaks at level 10, creating a skill ceiling
- No sequential bonuses (unlike Journey's arena bonus) — XP is earned, not gifted

---

## Part 2: XP Collection & Sync

### Local State (Client-Side)

Every game mode updates a **local profile object** stored in browser `localStorage`:

```javascript
{
  xp: 0,                    // Global XP from all sources
  journeyXP: 0,             // Cumulative XP from Journey mode only
  weeklyXP: 0,              // This week's XP (reset Monday server-side)
  highestEndlessXP: 0,      // Best single Endless Run XP
  highestEndlessRun: 0,     // Most words in one Endless session
  totalWordsSolved: 0,      // Lifetime words across all modes
  papaPoints: 50,           // In-game currency for power-ups
  
  totalStreak: 0,           // Consecutive Classic wins
  onlineWinStreak: 0,       // PvP wins in a row
  
  dailyStreak: 0,           // Days played consecutively
  lastDailyDate: "2026-04-02"
}
```

### Sync Process (Client → Server)

**When does sync happen?**

1. **Game End** (syncLock prevents double-fire):
   - Both modes call sync with final snapshot
   - Delta fields sent: `journeyXPDelta`, `weeklyXPDelta` (not absolute values)

2. **Arena Completion** (Journey only):
   - Immediate sync when rank cleared
   - Omits delta fields to prevent double-counting

3. **Periodic** (Every 30s if data changed):
   - Logged-in users only
   - Sends only `xp`, `totalWordsSolved`, `papaPoints`
   - Prevents loss if browser crashes mid-session

**What Gets Sent to `/api/games/hangman/sync`**:

```javascript
// Endless Run – Final Sync
{
  xp: 8500,                 // Absolute: what profile.xp should become
  totalWordsSolved: 523,    // Absolute: lifetime total
  papaPoints: 142,          // Absolute: current coins
  highestEndlessXP: 850,    // Absolute: best run
  highestEndlessRun: 42,    // Absolute: word record
  weeklyXPDelta: 850        // DELTA: this session's XP
}

// Journey Mode – Final Sync
{
  xp: 12400,                // Absolute: cumulative total
  journeyXPDelta: 600,      // DELTA: this session from Journey only
  weeklyXPDelta: 600,       // DELTA: this session's XP
  totalWordsSolved: 512,    // Absolute
  papaPoints: 89
}
```

### Server Update (MongoDB)

The sync route applies updates using **strategic operators**:

```javascript
// High-score fields use $max (can't go backwards)
$max: {
  xp: 8500,              // Never decrease
  highestEndlessXP: 850,
  highestEndlessRun: 42,
  highestStreak: 12
}

// Journey XP uses $inc (delta-based, prevents cache loss)
$inc: {
  journeyXP: 600
}

// Weekly XP uses atomic $cond pipeline (resets on new week)
$set: {
  weeklyXP = (storedWeekKey === thisWeek) ? weeklyXP + delta : delta,
  weekKey = thisWeek
}
```

**Why this architecture?**

- **`$max` for xp**: A stale cache can't lower it. Best outcome wins.
- **`$inc` for journeyXP**: Always adds earned delta, never overwrites with a stale total.
- **`$cond` for weeklyXP**: Server controls reset timing (Monday UTC), immune to client clock tricks.

---

## Part 3: Rank System & Progression

### Current Rank Structure (Test RANKS)

```
Rank ID | Min XP  | Max XP  | Arena Theme    | Notes
--------|---------|---------|----------------|------------------------------------------
   1    |    0    |   250   | Classic        | Starting rank
   2    |   250   |   500   | Forest         | Tier 1 unlock
   3    |   500   |   750   | Ocean          | 
   4    |   750   |  1000   | Volcano        | Mid-game
   5    |  1000   |  1250   | Mountain       | 
   6    |  1250   |  1500   | Cyber          | 
   7    |  1500   |  1750   | Space          | 
   8    |  1750   |  2250   | Ultimate       | Final rank / Endgame
```

*(Production RANKS commented out in constants.js go up to 210,000 XP)*

### How Rank is Calculated

```javascript
// From useWordPapaProfile.js
const calculateLevel = (xp) => {
  // Find the highest rank tier where earned XP >= minXP
  const currentRank = [...RANKS]
    .reverse()  // Start from highest
    .find(rank => xp >= rank.minXP) || RANKS[0];
  
  return {
    ...currentRank,
    level: currentRank.rankId,  // e.g. 3
    colorCode: currentRank.color,
    theme: ARENAS[currentRank.arenaId]
  };
};

// Examples:
calculateLevel(300)   → Rank 2 (300 >= 250 && 300 < 500)
calculateLevel(1200)  → Rank 5 (1200 >= 1000 && 1200 < 1250)
calculateLevel(2100)  → Rank 8 (2100 >= 1750)
```

### Rank Progress Bar

On every game end, the progress percent is shown:

```javascript
const currentRank = calculateLevel(profile.xp);
const nextRank = RANKS.find(r => r.minXP > profile.xp);

if (!nextRank) progress = 100;  // Already at max rank

else {
  const range = nextRank.minXP - currentRank.minXP;
  const progress_so_far = profile.xp - currentRank.minXP;
  
  progress = Math.round((progress_so_far / range) * 100);
}

// Example: Rank 4 (750–1000), currently at 875 XP
// range = 1000 - 750 = 250
// progress_so_far = 875 - 750 = 125
// percent = (125 / 250) * 100 = 50%
```

### Rank Up Events

When `newRank.level > oldRank.level`:
1. **Visual**: "Level Up" modal appears with rank name
2. **Reward**: Arena unlock bonus = `rankLevel × 100` papa coins
   - Rank 2 levelup = +200 coins
   - Rank 5 levelup = +500 coins
3. **Journey Impact**: Unlocks new rank's node path (e.g., Rank 5 unlocks nodes 5-1 through 5-5)

---

## Part 4: Leaderboard System (Four Tabs)

### Tab 1: **Global** (Lifetime Achievement)

**Sort By**: `xp + floor(highestEndlessXP × 0.3)`

**Why Composite Score?**
- Rewards career grind (pure XP from all modes)
- Gives 30% bonus for Endless mastery (peak performance)
- Player with 5000 XP + best run 500 = `5000 + floor(500 × 0.3) = 5150`

**Who Sees It**: Everyone, always visible

**Use Case**: "I've been grinding — am I still competitive?"

---

### Tab 2: **This Week** (Duolingo-style Urgency)

**Sort By**: `weeklyXP` (Resets Every Monday UTC)

**Reset Mechanics**:
```javascript
// In sync route, every POST request:
const currentWeekKey = getWeekKey();  // e.g., "2026-W15"

if (weeklyXPDelta > 0) {
  // Atomic update: conditional reset
  await GameProfile.updateOne(
    { userEmail },
    [
      {
        $set: {
          weeklyXP: {
            $cond: {
              if: { $eq: ["$weekKey", currentWeekKey] },  // Same week?
              then: { $add: ["$weeklyXP", weeklyXPDelta] },  // Accumulate
              else: weeklyXPDelta  // New week: fresh start
            }
          },
          weekKey: currentWeekKey
        }
      }
    ]
  );
}
```

**Key Design**: Only players with `weeklyXP > 0` appear (no past-week hangers-on)

**Who Sees It**: Players interested in weekly competition

**Use Case**: "Who played the most this week?" (Duolingo effect: re-engagement via fresh start)

---

### Tab 3: **Endless** (Pure Skill)

**Sort By**: `highestEndlessXP` (Best Single Run)

**Rank Calculation**: How many players have a better single run?

**Who Sees It**: Endless grinders, speedrunners, mastery-focused

**Use Case**: "Who's the survival specialist?"

---

### Tab 4: **Journey** (Structured Progress)

**Sort By**: `journeyXP` (Cumulative from structured mode only)

**Why Separate Journey XP?**
- A player grinding Journey arenas gets huge bonuses (`500 × rankId`)
- Endless grinder with many 100+ XP runs wouldn't show on Journey board
- Rewards players who completed all structured content

**Rank Calculation**: How many players have more Journey XP?

**Who Sees It**: Structured learners, curriculum completionists

**Use Case**: "Who's the best Journey learner?"

---

## Part 5: Example Player Journeys

### Player A: Journey Completionist

**Day 1–3**: Plays Journey only
- Rank 1, Node 1-1 → Complete with 500 XP
- Rank 1 arena clear → `500 × 1 = 500 bonus` → Total: 1000 XP → **Rank 2**
- Each node: ~200 XP + arena bonus → ramp up

**After 1 week**:
- Rank 5 unlocked (4500 XP)
- **Stats**:
  - `xp`: 4500 (from Journey only)
  - `journeyXP`: 4500 (100% from Journey)
  - `weeklyXP`: 2100 (this week's plays)
  - `highestEndlessXP`: 0 (never plays Endless)

**Leaderboard Positions**:
- **Global**: Rank 4500 (no Endless bonus) → Mid-tier
- **Journey**: Rank 1 or 2 (if dedicated grinding) → Top tier
- **This Week**: Rank 1–5 (depending on others' play)
- **Endless**: Not on board (0 best run)

---

### Player B: Endless Grinder

**Day 1**: Tries Journey once, gets bored. Discovers Endless Run.

**Day 1–7**: Plays Endless daily
- Session 1: Survive 20 words → 1200 XP
- Session 2: Survive 18 words → 980 XP
- Session 3: Survive 35 words → 2100 XP (best run)
- ...more sessions...

**After 1 week**:
- Total sessions accumulated: 8500 XP
- Best single run: 2100 XP
- **Stats**:
  - `xp`: 8500 (from Endless)
  - `journeyXP`: 0 (never played)
  - `weeklyXP`: 8500 (all from this week)
  - `highestEndlessXP`: 2100

**Calculated Rank**: `8500 >= 1750` → **Rank 8** (final tier!)

**Leaderboard Positions**:
- **Global**: `8500 + floor(2100 × 0.3)` = `8500 + 630` = **9130 Score** → Top tier (beats Player A)
- **Endless**: `2100` → Top tier (best run is high)
- **This Week**: `8500` → Top tier
- **Journey**: Not on board (0 journeyXP)

---

### Player C: Balanced Player

**All week**: Mixes both modes

**Journey**: Ranks 1–3 completed (1500 XP from Journey)
**Endless**: 5–6 runs per day, best run 1200 XP (4200 total XP from Endless)

**After 1 week**:
- **Stats**:
  - `xp`: 5700 (1500 Journey + 4200 Endless)
  - `journeyXP`: 1500
  - `weeklyXP`: 5700
  - `highestEndlessXP`: 1200

**Calculated Rank**: `5700 >= 1750` → **Rank 4**

**Leaderboard Positions**:
- **Global**: `5700 + floor(1200 × 0.3)` = `5700 + 360` = **6060 Score** → Mid-to-high
- **Endless**: `1200` → Mid-tier (not a specialist)
- **This Week**: `5700` → Mid-tier
- **Journey**: `1500` → Low-tier (not a specialist)

---

## Part 6: Sync Failure & Data Safety

### Scenario: Browser Crashes After Endless Run

**Session Result**: 600 XP earned

**Timeline**:
1. Game ends (syncLock = true)
2. Snapshot prepared: `{ xp: 8500, weeklyXPDelta: 600, ... }`
3. **Browser crash** before sync completes
4. localStorage still has old profile: `{ xp: 8000, ...}`
5. User refreshes and returns

**Recovery**:
- `useWordPapaProfile` loads from localStorage → `xp: 8000`
- On login, `/api/games/hangman/sync` GET fetches DB → `xp: 8000`
- User lost 600 XP session

**Fix Applied (Periodic Sync)**:
- Every 30s during gameplay, a background sync fires with just `xp` (absolute)
- If browser crashed 25s after game end, the periodic sync already sent the highest XP
- On reload, DB has `xp: 8500` (because `$max` kept the highest value)

---

### Scenario: Stale localStorage on Two Devices

**Device A (Laptop)**:
- Last sync: offline, earned 400 XP in Endless
- localStorage: `{ xp: 8000, journeyXP: 1500 }`

**Device B (Phone)**:
- Just synced: 800 XP in Journey
- DB now has: `{ xp: 8800, journeyXP: 2300 }`

**Laptop comes back online**:
- Sends: `{ xp: 8400, journeyXPDelta: 400, ... }` (400 old Endless run)
- Server receives: OLD absolute xp (8400) but NEW journeyXPDelta (400)

**Server-side Update**:
```javascript
// Absolute fields use $max
$max: { xp: 8400 }  // DB has 8800 → stays at 8800 ✓

// Delta fields use $inc
$inc: { journeyXP: 400 }  // DB has 2300 → becomes 2700 ✓
```

**Result**: Both 800 XP (Journey on phone) and 400 XP (Endless on laptop) are kept. ✓

---

## Part 7: Leaderboard Update Frequency

### Real-time vs Cached

**API Response Format**:
```javascript
{
  tab: "global",
  leaderboard: [
    {
      rank: 1,
      name: "EndlessChampion",
      xp: 12500,
      compositeScore: 13400,
      highestEndlessXP: 2000,
      journeyXP: 0,
      weeklyXP: 12500,
      totalWordsSolved: 1240,
      journeyRank: { rankName: "Rank 8", rankColor: "#ff6b00" }
    },
    ...
  ],
  currentUserEntry: { rank: 47, ... }  // Only if outside top 50
}
```

**Sync Timing**:
- **First load**: Fetched from DB (real-time)
- **Tab switch**: Fetched once per tab, then cached in state
- **Refresh**: Re-fetches all tabs

**Update During Gameplay**:
- Leaderboards are **not real-time** (don't poll every sync)
- User sees own progress on profile immediately (local state)
- Leaderboard updates next time they load the page

---

## Summary Table: XP Sources

| Source | Formula | Rank Cap | Mode | Example |
|---|---|---|---|---|
| Journey word | `(len × 8) + (rankId × 12)` | Tied to current rank | Journey | 6 letters, rank 3 = 84 XP |
| Endless word | `(len × 10) + (level × 15)` | Tied to word level | Endless | 6 letters, level 4 = 120 XP |
| Journey arena bonus | `500 × rankId` | 4000 (rank 8) | Journey | Rank 5 = 2500 XP (one-time) |
| Rank levelup bonus | `rankId × 100` papa coins | 800 (rank 8) | Both | Rank 5 = 500 papa coins |

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      GAME SESSION                           │
│ (Journey Node or Endless Run)                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
              ┌──────────────────────┐
              │  Word Solved Event   │
              │  +XP to session      │
              │  (localStorage only) │
              └──────────────────────┘
                         │
                         ↓
              ┌──────────────────────┐
              │  Session Complete    │
              │  (Game Over)         │
              └──────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │   Final Sync Triggered          │
        │  (syncLock guards double-fire)  │
        └────────┬───────────────────────┘
                 │
                 ↓
     ┌───────────────────────────────┐
     │  POST /api/games/hangman/sync │
     │  Sends:                       │
     │  - xp (absolute)              │
     │  - journeyXPDelta (delta)     │
     │  - weeklyXPDelta (delta)      │
     │  - highestEndlessXP (max)     │
     └────────┬────────────────────┘
              │
              ↓
     ┌─────────────────────────────────────┐
     │  MongoDB Update (Atomic)            │
     │  - $max xp, highestEndlessXP, etc. │
     │  - $inc journeyXP (delta)           │
     │  - $cond weeklyXP (reset on week)   │
     └────────┬────────────────────────────┘
              │
              ↓
     ┌─────────────────────────────┐
     │  Profile Updated in DB      │
     │ calculateLevel(xp) triggers │
     │ rank increase if threshold  │
     │ is crossed                  │
     └────────┬────────────────────┘
              │
              ↓
     ┌──────────────────────────────┐
     │ Leaderboard Database Updated │
     │ (fetched next page load)     │
     │                              │
     │ Each tab queries against:    │
     │ - global: composite score    │
     │ - endless: highestEndlessXP  │
     │ - journey: journeyXP         │
     │ - weekly: weeklyXP + weekKey │
     └──────────────────────────────┘
```

---

## Key Takeaways

1. **Two Distinct Modes**:
   - **Journey**: Structured, cumulative, bonus-driven, rank-blocking
   - **Endless**: Skill-based, session-focused, survival-oriented

2. **XP is Separated by Source**:
   - `xp` (global) = sum of all modes
   - `journeyXP` = Journey mode only (delta-based)
   - `weeklyXP` = This week's plays (atomic reset)
   - `highestEndlessXP` = Best single Endless run

3. **Rank is Single-Threaded**:
   - `xp` threshold alone determines rank
   - Reaching rank N requires completing all prior ranks' story content in Journey
   - Rank unlocks are natural player progression gates

4. **Leaderboard is Multi-Faceted**:
   - Global rewards grinders + peak performers
   - Weekly creates urgency (Duolingo effect)
   - Endless rewards pure skill
   - Journey rewards curriculum completion

5. **Data Safety**:
   - Delta fields (`$inc`) can't be overwritten by stale caches
   - Absolute fields (`$max`) always keep the highest value
   - Periodic sync prevents progress loss on crash
   - Server-side weekly reset is atomic and immune to client tampering
