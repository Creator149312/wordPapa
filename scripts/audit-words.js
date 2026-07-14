/**
 * Database Audit Script: Find duplicates and special characters in the Word collection.
 * Run with: node scripts/audit-words.js
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Minimal schema for the Word collection
const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  entries: { type: Array, default: [] }
});

const Word = mongoose.models.Word || mongoose.model("Word", wordSchema);

async function auditDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected. Starting audit...\n");

    // 1. Find Duplicates (Case-Insensitive)
    console.log("--- Checking for Duplicates (Case-Insensitive) ---");
    const duplicates = await Word.aggregate([
      {
        $group: {
          _id: { $toLower: "$word" },
          count: { $sum: 1 },
          originalWords: { $addToSet: "$word" },
          ids: { $push: "$_id" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    if (duplicates.length === 0) {
      console.log("✅ No duplicate words found.");
    } else {
      console.log(`❌ Found ${duplicates.length} duplicate word groups:`);
      duplicates.forEach(group => {
        console.log(`   - "${group._id}": Found ${group.count} times as [${group.originalWords.join(", ")}]`);
      });
    }

    // 2. Find Words with Special Characters
    console.log("\n--- Checking for Special Characters ---");
    // Regex: Matches anything NOT a-z, A-Z, 0-9, space, or hyphen
    const specialCharRegex = /[^a-zA-Z0-9 -]/;
    
    // Using a cursor to handle large datasets without loading everything into memory
    const cursor = Word.find({}).cursor();
    let specialCount = 0;
    const specialSamples = [];

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      if (specialCharRegex.test(doc.word)) {
        specialCount++;
        if (specialSamples.length < 50) {
          specialSamples.push(doc.word);
        }
      }
    }

    if (specialCount === 0) {
      console.log("✅ No words with special characters found.");
    } else {
      console.log(`❌ Found ${specialCount} words containing special characters.`);
      console.log("   First 50 samples:", specialSamples.join(", "));
      console.log("\n   Note: These might be legitimate (e.g., résumé, co-op) or errors.");
    }

    console.log("\nAudit complete.");
  } catch (error) {
    console.error("Audit failed:", error);
  } finally {
    await mongoose.connection.close();
  }
}

auditDatabase();
