#!/usr/bin/env node

/**
 * Offline One-Time Backfill Script:
 * Migrates existing legacy `Journey` documents into the consolidated `GameProfile.journey` sub-document.
 *
 * Guarantees:
 *  1. Non-destructive: Reads legacy data, merges with existing GameProfile without lowering any stats.
 *  2. Unlocked nodes are merged (union of sets) so no player ever loses an unlocked node.
 *  3. Supports `--dry-run` to preview changes without writing to the database.
 *
 * Usage:
 *   node scripts/backfill-journey-to-gameprofile.js --dry-run
 *   node scripts/backfill-journey-to-gameprofile.js
 */

require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment, .env, or .env.local");
    process.exit(1);
  }

  console.log("=================================================");
  console.log("  WordPapa: Journey → GameProfile Backfill");
  console.log(`  Mode: ${DRY_RUN ? "🔍 DRY RUN (no writes)" : "⚡ LIVE RUN (writing to database)"}`);
  console.log("=================================================\n");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB successfully.\n");

  const db = mongoose.connection.db;
  const journeysCollection = db.collection("journeys");
  const gameProfilesCollection = db.collection("gameprofiles");

  const totalJourneys = await journeysCollection.countDocuments();
  console.log(`Found ${totalJourneys} total Journey documents to inspect.\n`);

  if (totalJourneys === 0) {
    console.log("No legacy journeys to migrate. Done!");
    await mongoose.disconnect();
    return;
  }

  const cursor = journeysCollection.find({});
  let inspected = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  while (await cursor.hasNext()) {
    const journey = await cursor.next();
    inspected++;

    const userEmail = journey.userEmail;
    if (!userEmail) {
      skipped++;
      continue;
    }

    try {
      const profile = await gameProfilesCollection.findOne({ userEmail });

      const legacyUnlocked = Array.isArray(journey.unlockedNodes) ? journey.unlockedNodes : ["1-1"];
      const legacyCurrentNode = journey.currentNodeId || (legacyUnlocked[legacyUnlocked.length - 1] || "1-1");
      const legacyCharacterStage = journey.characterStage || "infant";
      const legacyStreak = journey.streak || 0;
      const legacyStreakShields = journey.streakShields || 0;
      const legacyLastPracticeDay = journey.lastPracticeDay || null;

      // Extract nodeWordProgress map/object
      let legacyNodeWordProgress = {};
      if (journey.nodeWordProgress) {
        if (journey.nodeWordProgress instanceof Map) {
          legacyNodeWordProgress = Object.fromEntries(journey.nodeWordProgress);
        } else if (typeof journey.nodeWordProgress === "object") {
          legacyNodeWordProgress = journey.nodeWordProgress;
        }
      }

      if (!profile) {
        // No GameProfile existed yet: prepare a new document with this user's journey
        console.log(`[CREATE PROFILE] ${userEmail} (Current Node: ${legacyCurrentNode}, Unlocked: ${legacyUnlocked.join(", ")})`);

        if (!DRY_RUN) {
          await gameProfilesCollection.insertOne({
            userEmail,
            name: "Player",
            isGhost: false,
            xp: journey.xp || 0,
            journeyXP: journey.xp || 0,
            endlessXP: 0,
            papaPoints: 100,
            totalWordsSolved: 0,
            journey: {
              currentNodeId: legacyCurrentNode,
              unlockedNodes: legacyUnlocked,
              characterStage: legacyCharacterStage,
              nodeWordProgress: legacyNodeWordProgress,
              streak: legacyStreak,
              lastPracticeDay: legacyLastPracticeDay,
              streakShields: legacyStreakShields,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        updated++;
      } else {
        // Merge into existing profile
        const existingJourney = profile.journey || {};
        const existingUnlocked = Array.isArray(existingJourney.unlockedNodes)
          ? existingJourney.unlockedNodes
          : ["1-1"];

        const mergedUnlocked = Array.from(new Set([...existingUnlocked, ...legacyUnlocked]));
        const mergedCurrentNode = existingJourney.currentNodeId || legacyCurrentNode;
        const mergedCharacterStage = existingJourney.characterStage || legacyCharacterStage;
        const mergedStreak = Math.max(existingJourney.streak || 0, legacyStreak);
        const mergedStreakShields = Math.max(existingJourney.streakShields || 0, legacyStreakShields);
        const mergedLastPracticeDay = existingJourney.lastPracticeDay || legacyLastPracticeDay;

        // Merge nodeWordProgress objects
        const existingNodeProgress = existingJourney.nodeWordProgress || {};
        const mergedNodeProgress = {
          ...legacyNodeWordProgress,
          ...existingNodeProgress,
        };

        const needsUpdate =
          !profile.journey ||
          mergedUnlocked.length !== existingUnlocked.length ||
          !existingJourney.currentNodeId;

        if (needsUpdate) {
          console.log(`[UPDATE] ${userEmail}: Merged ${mergedUnlocked.length} unlocked nodes (Current: ${mergedCurrentNode})`);

          if (!DRY_RUN) {
            await gameProfilesCollection.updateOne(
              { userEmail },
              {
                $set: {
                  "journey.currentNodeId": mergedCurrentNode,
                  "journey.unlockedNodes": mergedUnlocked,
                  "journey.characterStage": mergedCharacterStage,
                  "journey.nodeWordProgress": mergedNodeProgress,
                  "journey.streak": mergedStreak,
                  "journey.lastPracticeDay": mergedLastPracticeDay,
                  "journey.streakShields": mergedStreakShields,
                  updatedAt: new Date(),
                },
              }
            );
          }
          updated++;
        } else {
          skipped++;
        }
      }
    } catch (err) {
      console.error(`❌ Error migrating ${userEmail}:`, err.message);
      errors++;
    }
  }

  console.log("\n=================================================");
  console.log("  Migration Summary");
  console.log(`  Inspected: ${inspected}`);
  console.log(`  Updated / Created: ${updated}`);
  console.log(`  Already Up-to-Date: ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log("=================================================\n");

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB. Done.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
