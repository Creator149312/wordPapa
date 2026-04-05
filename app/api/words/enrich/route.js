import { connectMongoDB } from "@lib/mongodb";
import Word from "@models/word";
import { enrichWordsWithAI } from "@utils/wordEnricher";
import { NextResponse } from "next/server";

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

    // Fetch existing words from database
    const existingWords = await Word.find({
      word: { $in: words.map(w => w.toLowerCase()) }
    });

    // Create map of existing words
    const existingWordMap = {};
    existingWords.forEach((wordDoc) => {
      existingWordMap[wordDoc.word.toLowerCase()] = wordDoc.entries;
    });

    // Find words that need enrichment
    const wordsToEnrich = words.filter(
      w => !existingWordMap[w.toLowerCase()]
    );

    let enrichedWords = {};

    // Enrich words not found in database
    if (wordsToEnrich.length > 0) {
      const enrichmentResult = await enrichWordsWithAI(wordsToEnrich);
      enrichmentResult.forEach((item) => {
        enrichedWords[item.word.toLowerCase()] = item.entries;
      });
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
