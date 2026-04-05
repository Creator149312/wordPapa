import { connectMongoDB } from "@lib/mongodb";
import List from "@models/list";
import Word from "@models/word";
import { validateListTitle } from "@utils/Validator";
import { NextResponse } from "next/server";
import { enrichWordsWithAI } from "@utils/wordEnricher";

// Utility function to validate single words
function isSingleWord(word) {
  const regex = /^[A-Za-z]+$/; // only alphabetic
  return regex.test(word);
}

// Utility function to validate parsed JSON
function isValidWordData(entries) {
  if (!entries || !Array.isArray(entries)) return false;

  return entries.every(
    (entry) =>
      entry.definition &&
      typeof entry.definition === "string" &&
      Array.isArray(entry.examples) &&
      entry.examples.length > 0,
  );
}

export async function POST(request) {
  try {
    const { title, description, words, createdBy, dryRun, tags } = await request.json();
    let error = "";

    // Validate list title
    const vlt = validateListTitle(title);
    if (vlt.length !== 0) error = vlt;

    if (!words || words.length === 0) {
      error = "At least one word is required";
    }

    if (error.length > 0) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Debug: check if words are properly formatted
    const invalidWordCount = words.filter(w => typeof w !== "string" || w.trim().length === 0).length;
    if (invalidWordCount > 0) {
      console.warn(`[bulk-create] ${invalidWordCount}/${words.length} words are invalid format`);
      console.warn(`[bulk-create] Sample content:`, words.slice(0, 2));
    }

    // Normalize words: ensure all are strings and lowercase
    const normalizedWords = words
      .map(w => (typeof w === "string" ? w.trim().toLowerCase() : String(w).trim().toLowerCase()))
      .filter(w => w.length > 0);

    if (normalizedWords.length === 0) {
      return NextResponse.json({ error: "No valid words provided after normalization" }, { status: 400 });
    }

    await connectMongoDB();

    // Step 1: Check database for existing words
    const existingWords = await Word.find({ word: { $in: normalizedWords } });
    const existingWordMap = {};

    existingWords.forEach((wordDoc) => {
      existingWordMap[wordDoc.word] = wordDoc;
    });

    // Step 2: Separate words into two groups
    const wordsWithData = []; // Found in DB
    const wordsNeedingEnrichment = []; // Not in DB, need AI

    normalizedWords.forEach((word) => {
      if (existingWordMap[word]) {
        const wordDoc = existingWordMap[word];
        // Use the first entry's definition for wordData
        const firstEntry = wordDoc.entries[0];
        const wordData = firstEntry ? firstEntry.definition : "Definition not available";

        wordsWithData.push({
          word,
          wordData,
          entries: wordDoc.entries,
          source: "database",
        });
      } else {
        wordsNeedingEnrichment.push(word);
      }
    });

    // Step 3: Enrich missing words using AI
    let wordsEnrichedByAI = [];
    if (wordsNeedingEnrichment.length > 0) {
      try {
        wordsEnrichedByAI = await enrichWordsWithAI(wordsNeedingEnrichment);

        // Save enriched words to database
        for (const enrichedWord of wordsEnrichedByAI) {
          try {
            if (isValidWordData(enrichedWord.entries) && isSingleWord(enrichedWord.word)) {
              await Word.create({
                word: enrichedWord.word,
                entries: enrichedWord.entries,
              });
            } else {
              console.warn(`Skipping invalid word data for "${enrichedWord.word}"`);
            }
          } catch (saveError) {
            console.error(`Error saving word "${enrichedWord.word}" to DB:`, saveError);
            // Continue with other words
          }
        }
      } catch (aiError) {
        console.error("AI Enrichment Error:", aiError);
        // Continue with whatever data we have from DB
        // Add AI-failed words with placeholder
        wordsEnrichedByAI = wordsNeedingEnrichment.map((word) => ({
          word,
          entries: [{
            pos: "noun",
            definition: `[Definition not available for: ${word}]`,
            examples: []
          }],
          source: "placeholder",
        }));
      }
    }

    // Step 4: Combine all words
    const allWordsForList = [
      ...wordsWithData,
      ...wordsEnrichedByAI.map((item) => ({
        word: item.word,
        wordData: item.entries && item.entries.length > 0 ? item.entries[0].definition : "Definition not available",
        entries: item.entries || [],
        source: item.source,
      }))
    ];

    // Step 5: Save or dry-run
    if (dryRun) {
      return NextResponse.json(
        {
          message: "Dry-run successful",
          words: allWordsForList,
          wordArray: allWordsForList,
          enrichedCount: allWordsForList.length,
          fromDatabase: wordsWithData.length,
          fromAI: wordsEnrichedByAI.length,
        },
        { status: 200 }
      );
    }

    const newList = await List.create({
      title,
      description: description || "Bulk imported list",
      words: allWordsForList.map(({ word, wordData }) => ({
        word,
        wordData,
      })),
      createdBy,
      tags: Array.isArray(tags) ? tags.map(t => t.toLowerCase().trim()).filter(Boolean) : [],
    });

    return NextResponse.json(
      {
        message: "List created successfully",
        list: newList,
        wordArray: allWordsForList,
        enrichedCount: allWordsForList.length,
        fromDatabase: wordsWithData.length,
        fromAI: wordsEnrichedByAI.length,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Bulk Create API Error:", e);
    return NextResponse.json(
      { error: "Error creating list", details: e.message },
      { status: 500 }
    );
  }
}
