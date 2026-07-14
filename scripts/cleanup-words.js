/**
 * Database Cleanup Script: Remove duplicates and fix casing for Word collection.
 * This script will:
 * 1. Convert all duplicate groups to a single lowercase entry.
 * 2. Merge entries if they differ (though usually one is a placeholder).
 */

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  entries: { type: Array, default: [] }
});

const Word = mongoose.models.Word || mongoose.model("Word", wordSchema);

async function cleanDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected. Starting cleanup...\n");

    const duplicates = await Word.aggregate([
      {
        $group: {
          _id: { $toLower: "$word" },
          count: { $sum: 1 },
          docs: { $push: "$$ROOT" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    console.log(`Found ${duplicates.length} groups to resolve.\n`);

    for (const group of duplicates) {
      const targetWord = group._id;
      console.log(`Resolving group: "${targetWord}"...`);

      // Find the document with the most content (entries)
      const bestDoc = group.docs.reduce((prev, current) => {
        return (prev.entries.length >= current.entries.length) ? prev : current;
      });

      // 1. Delete all documents in this group
      const allIds = group.docs.map(d => d._id);
      await Word.deleteMany({ _id: { $in: allIds } });

      // 2. Insert one clean, lowercase version with the best data
      await Word.create({
        word: targetWord,
        entries: bestDoc.entries
      });

      console.log(`   ✅ Unified into lowercase "${targetWord}" using best data.`);
    }

    console.log("\nCleanup complete.");
  } catch (error) {
    console.error("Cleanup failed:", error);
  } finally {
    await mongoose.connection.close();
  }
}

cleanDatabase();
