import { connectMongoDB } from "@lib/mongodb";
import Word from "@models/word";
import { enrichWordsWithAI } from "@utils/wordEnricher";
import { NextResponse } from "next/server";
import { WORDMAP } from "../../../define/WORDMAP";

/**
 * GET or enrich words with definitions
 * Takes array of words and returns their definitions from DB or AI enrichment
 */
export async function POST(request) {
  try {
    const { words } = await request.json();

    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        { error: "Words array is required and must not be empty" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // 1. Filter input: Only allow words that exist in our WORDMAP to prevent DB bloat
    const validWords = words.filter(w => {
      const cleanKey = w.toLowerCase().replace(/[ -]/g, "");
      return !!WORDMAP[cleanKey];
    });

    if (validWords.length === 0) {
      return NextResponse.json({ words: [] }, { status: 200 });
    }

    // Fetch existing words from database
    const existingWords = await Word.find({
      word: { $in: validWords.map(w => w.toLowerCase()) }
    });

    // Create map of existing words
    const existingWordMap = {};
    existingWords.forEach((wordDoc) => {
      existingWordMap[wordDoc.word.toLowerCase()] = wordDoc.entries;
    });

    // Find words that need enrichment
    const wordsToEnrich = validWords.filter(
      w => !existingWordMap[w.toLowerCase()]
    );

    let enrichedWords = {};

    // Enrich words not found in database
    if (wordsToEnrich.length > 0) {
      const enrichmentResult = await enrichWordsWithAI(wordsToEnrich);
      enrichmentResult.forEach((item) => {
        enrichedWords[item.word.toLowerCase()] = item.entries;
      });

      // Persist enriched words to DB so subsequent visits hit the cache
      const docsToInsert = enrichmentResult
        .filter((item) => item.entries && item.entries.length > 0 && item.source !== "fallback")
        .map((item) => ({ word: item.word.toLowerCase(), entries: item.entries }));

      if (docsToInsert.length > 0) {
        await Word.insertMany(docsToInsert, { ordered: false }).catch(() => {
          // Ignore duplicate key errors in case of a race condition
        });
      }
    }

    // Build response with word data
    const result = words.map((word) => {
      const lowercaseWord = word.toLowerCase();
      const entries = existingWordMap[lowercaseWord] || enrichedWords[lowercaseWord];
      
      if (entries && entries.length > 0) {
        const firstEntry = entries[0];
        return {
          word,
          wordData: firstEntry.definition || "Definition not available",
          entries: entries, // Full entries if needed
        };
      }

      return {
        word,
        wordData: "Definition not available",
        entries: [],
      };
    });

    return NextResponse.json({ words: result }, { status: 200 });
  } catch (error) {
    console.error("Word enrichment error:", error);
    return NextResponse.json(
      { error: "Error enriching words", details: error.message },
      { status: 500 }
    );
  }
}
