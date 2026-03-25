import { connectMongoDB } from "@lib/mongodb";
import List from "@models/list";
import Word from "@models/word";
import { validateListTitle } from "@utils/Validator";
import { NextResponse } from "next/server";
import { enrichWordsWithAI } from "@utils/wordEnricher";

export async function POST(request) {
  try {
    const { title, description, words, createdBy } = await request.json();
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

    await connectMongoDB();

    // Step 1: Check database for existing words
    const existingWords = await Word.find({ word: { $in: words } });
    const existingWordMap = {};

    existingWords.forEach((wordDoc) => {
      existingWordMap[wordDoc.word] = wordDoc;
    });

    // Step 2: Separate words into two groups
    const wordsWithData = []; // Found in DB
    const wordsNeedingEnrichment = []; // Not in DB, need AI

    words.forEach((word) => {
      if (existingWordMap[word]) {
        const wordDoc = existingWordMap[word];
        // Format the word data from DB (combine all entries)
        const definitions = wordDoc.entries
          .map(
            (entry) =>
              `(${entry.pos}) ${entry.definition} ${
                entry.examples ? `Example: ${entry.examples[0]}` : ""
              }`
          )
          .join(" | ");

        wordsWithData.push({
          word,
          wordData: definitions,
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
      } catch (aiError) {
        console.error("AI Enrichment Error:", aiError);
        // Continue with whatever data we have from DB
        // Add AI-failed words with placeholder
        wordsEnrichedByAI = wordsNeedingEnrichment.map((word) => ({
          word,
          wordData: `[Definition not available for: ${word}]`,
          source: "placeholder",
        }));
      }
    }

    // Step 4: Combine all words
    const allWordsForList = [...wordsWithData, ...wordsEnrichedByAI];

    // Step 5: Create the list
    const newList = await List.create({
      title,
      description: description || "Bulk imported list",
      words: allWordsForList.map(({ word, wordData }) => ({
        word,
        wordData,
      })),
      createdBy,
    });

    return NextResponse.json(
      {
        message: "List created successfully",
        list: newList,
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
