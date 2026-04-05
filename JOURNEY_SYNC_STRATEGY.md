# Journey Sync Strategy

This document describes the JourneyMode sync model used by Hangman.

## Goals

- Keep player progress safe during long sessions and abrupt exits.
- Avoid hammering MongoDB with per-word writes.
- Preserve correctness for XP, coins, words solved, and node progression.
- Keep the UI optimistic and responsive even when the network is slow.

## Core Model

JourneyMode now uses a smart batch queue with strategic flushes.

### Session Baseline

At the start of a Journey session, the mode captures a stable baseline:

- `xp`
- `journeyXP`
- `papaPoints`
- `totalWordsSolved`

This baseline is stored in refs and does not depend on later profile merges from `syncToDatabase()`.

Why this matters:

- mid-session DB syncs can update the shared profile context
- if JourneyMode keeps using the live profile object as the base, later flushes can double-count absolute fields
- the stable baseline prevents that drift

### Ref-Backed Accumulators

JourneyMode keeps ref-backed session counters for:

- earned XP
- earned coins
- spent coins
- words solved
- queued Tough Nuts

These refs are the source of truth for flushes. State is still used for rendering, but flush math reads from refs so it is never blocked by React state batching.

## Strategic Flush Triggers

The mode no longer syncs on every word. Instead, it flushes at higher-value checkpoints.

### 1. Level-Up Flush

When the session rank increases:

- show the level-up UI
- checkpoint local progress immediately
- flush the latest absolute progress and unsynced XP

Purpose:

- avoids losing a big milestone if the tab closes after the level-up modal

### 2. Revive Flush

When the player spends coins on revive:

- record the spend in the session accumulator
- flush immediately

Purpose:

- coin spend is a high-value state change
- keeps the cloud state close to reality during recovery moments

### 3. Node Completion Flush

When the word pool is exhausted:

- persist node progress to `/api/journey/node-progress`
- apply node bonus and arena bonus to the session accumulator
- flush profile progress immediately after node state is saved

Purpose:

- node completion is the natural checkpoint for Journey
- keeps node unlocks and profile progression aligned

### 4. Final Flush

When the run ends or the revive window expires:

- flush any remaining progress
- flush the queued Tough Nuts batch
- mark the result as claimed only after the flush succeeds locally
- retry remote sync if needed

Purpose:

- guarantees the end-of-run snapshot is attempted once as the authoritative checkpoint

### 5. Periodic Fallback Flush

While the run is active and the user is signed in:

- run a 75 second fallback timer
- flush only if there is unpersisted state

Purpose:

- protects long sessions from browser crashes or accidental closes
- long enough to avoid DB spam

### 6. Unmount Rescue

On unmount:

- send `node-progress` with `keepalive: true` if the node was in progress
- send `hangman/sync` with `keepalive: true` if XP or absolute profile state is still unsynced

Purpose:

- last-resort recovery for tab closes, refreshes, and navigation away

## XP Safety Model

XP is handled as a delta, not an absolute overwrite.

JourneyMode tracks:

- total session XP earned
- last XP amount successfully synced to remote
- last XP amount applied to local profile context

Each flush computes:

`unsyncedXP = totalEarnedXP - lastRemoteSyncedXP`

Only `unsyncedXP` is sent to `/api/games/hangman/sync` as `journeyXPDelta`.

Why this matters:

- multiple mid-session flushes are now safe
- final sync does not double-count XP already written by a previous flush
- optimistic local checkpoints can happen without corrupting remote totals

## Tough Nuts Batching

Tough Nuts are no longer written per word.

JourneyMode now:

- queues tough-nut candidates in memory during play
- flushes them as one batch at final checkpoint(s)

The API at `/api/journey/tough-nuts` now accepts either:

- a single word payload
- a batched `words` array payload

Why this matters:

- reduces request volume significantly in high-mistake sessions
- keeps the behavior idempotent because the server still deduplicates by word

## Optimistic UI Rules

The UI updates immediately on:

- earned XP
- earned coins
- spent coins
- words solved

The player never waits for the DB to see progress move.

The flush layer is responsible for persistence, not the render layer.

## Rebase Between Journey Segments

When the player restarts a node or continues to the next node, JourneyMode rebases its session baseline:

- fold the completed session totals into the baseline
- reset the per-node accumulators to zero
- keep future flushes relative to the new baseline

Why this matters:

- the next node starts from the correct absolute totals
- the mode avoids carrying stale deltas into the next segment

## Current Phase Status

### Phase 1: Foundation

Implemented:

- stable session baseline refs
- ref-backed accumulators
- fixed periodic sync strategy
- keepalive unmount rescue

### Phase 2: Strategic Flushes

Implemented:

- level-up flush
- revive flush
- node completion flush
- final flush with retry tick

### Phase 3: Optimization

Implemented:

- Tough Nuts batching
- shared checkpoint flush helper
- optimistic local checkpointing separated from remote delta sync

## Practical Outcome

Compared with the old model:

- per-word profile sync is gone
- the broken timer reset loop is gone
- abrupt exits now attempt both node and profile rescue
- XP is no longer vulnerable to being lost purely because the tab closed before final sync
- repeated cloud syncs no longer depend on the mutable shared profile object as their base

## Files Involved

- `app/games/hangman/modes/JourneyMode.js`
- `app/games/hangman/Hangman.js`
- `app/api/journey/tough-nuts/route.js`

## Runtime Verification

You can verify every Journey sync trigger without guessing by enabling the debug channel.

### Enable Debug Mode

Open the browser console and run:

```js
localStorage.setItem("journey-sync-debug", "1");
```

Refresh the page afterward.

To disable it later:

```js
localStorage.removeItem("journey-sync-debug");
```

### What You Will See

In the browser console, JourneyMode now logs events prefixed with:

- `[JourneySync]`

In the server console, API routes now log events prefixed with:

- `[JourneySync][server]`

This gives you end-to-end confirmation for:

- local checkpoint creation
- profile flush requests
- skipped flushes
- queued flushes
- final sync trigger
- periodic fallback ticks
- node-progress writes
- tough-nuts batch writes

### Verification Checklist

#### 1. Word Completion Does Not Hit DB Immediately

Action:

- solve one word normally

Expected browser logs:

- `word.completed`

Expected absence:

- no immediate `node-progress.request`
- no forced `hangman.sync` unless a level-up happened

Purpose:

- confirms per-word DB hammering is gone

#### 2. Level-Up Flush Works

Action:

- keep playing until rank increases

Expected browser logs:

- `local.checkpoint`
- `profile.flush.requested`
- `profile.flush.start`
- `profile.flush.success`

Expected server logs:

- `hangman.sync.request`
- `hangman.sync.success`

Purpose:

- confirms level-up checkpoint sync exists and is not only local UI

#### 3. Revive Spend Flush Works

Action:

- fail enough letters to trigger revive
- choose revive

Expected browser logs:

- `revive.flush`
- `profile.flush.requested`
- `profile.flush.success`

Expected result:

- reloading after revive should preserve the reduced papaPoints

#### 4. Node Completion Writes Both Node Progress And Profile Progress

Action:

- finish every word in the node

Expected browser logs:

- `node.complete.pending`
- `profile.flush.requested`
- `profile.flush.success`

Expected server logs:

- `node-progress.request`
- `node-progress.success`
- `hangman.sync.request`
- `hangman.sync.success`

Expected result:

- next node unlock persists after refresh
- XP and coins persist after refresh

#### 5. Arena Completion Bonus Is Persisted Once

Action:

- complete the final node in an arena

Expected server logs:

- one `node-progress.success` showing `arenaCompleted: true`
- one `hangman.sync.success` with updated totals

Purpose:

- confirms arena bonus is applied through the shared checkpoint path
- check that totals are not duplicated across refreshes

#### 6. Final Sync Fires On Run End / Revive Timeout

Action:

- end the run or let revive countdown expire

Expected browser logs:

- `final-sync.triggered`
- `profile.flush.requested`
- `tough-nuts.flush.start` if queue is non-empty

Expected server logs:

- `hangman.sync.request`
- `tough-nuts.success` if batch present

Purpose:

- confirms end-of-run checkpoint is active

#### 7. Periodic Fallback Actually Fires

Action:

- keep a Journey session open for more than 75 seconds without ending the run

Expected browser logs:

- `periodic-sync.tick`
- then either `profile.flush.skipped` or `profile.flush.success`

Purpose:

- confirms the old timer-reset bug is gone

#### 8. Tab Close / Refresh Rescue Works

Action:

- earn XP mid-node
- refresh or close tab before finishing

Expected browser logs right before unload may be limited, but server logs should show:

- `node-progress.request`
- `hangman.sync.request`

Expected result after reopening:

- node progress should be partially saved
- earned XP should not be lost

### Fast Pass Acceptance Criteria

JourneyMode sync can be treated as verified when all of these are true:

- word solves no longer produce per-word DB writes
- level-up produces one profile flush
- revive coin spend survives reload
- node completion persists unlock + totals
- final sync persists totals once
- periodic fallback fires after 75 seconds
- refresh/tab-close rescue preserves mid-run XP
