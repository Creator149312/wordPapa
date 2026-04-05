import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Enriches words with definitions using OpenAI API
 * Returns an array of word objects with full entries for DB storage
 * @param {string[]} words - Array of words to enrich
 * @returns {Promise<Array<{word: string, entries: Array, source: string}>>}
 */
export async function enrichWordsWithAI(words) {
  if (!words || words.length === 0) return [];

  const enrichedWords = [];

  for (const word of words) {
    try {
      const prompt = `
    For the word "${word}", provide definitions grouped by part of speech (POS).
    For each POS, include:
    - POS (noun, verb, adjective, etc.)
    - A simple definition
    - 3 short example sentences

    Output as JSON:
    {
      "entries": [
        {
          "pos": "noun|verb|adjective|...",
          "definition": "...",
          "examples": ["...", "...", "..."]
        }
      ]
    }
    `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const responseText = response.choices[0].message.content;
      const parsed = JSON.parse(responseText);

      if (parsed && Array.isArray(parsed.entries)) {
        enrichedWords.push({
          word: word.toLowerCase(),
          entries: parsed.entries,
          source: "ai-openai",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error enriching word "${word}":`, error);
      // Fallback: Create placeholder entry
      enrichedWords.push({
        word: word.toLowerCase(),
        entries: [{
          pos: "noun",
          definition: `Definition for "${word}" (generated)`,
          examples: [`Example sentence with ${word}.`, `Another example using ${word}.`, `Third example featuring ${word}.`]
        }],
        source: "fallback",
      });
    }
  }

  return enrichedWords;
}

/**
 * Alternative enrichment using Gemini API (if you want to switch)
 * Uncomment this if you have Google Gemini API key
 */
export async function enrichWordsWithGemini(words) {
  // This is a template for Gemini integration
  // npm install @google/generative-ai
  // const { GoogleGenerativeAI } = require("@google/generative-ai");
  // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  // Implementation would go here
  throw new Error("Gemini enrichment not yet configured");
}
