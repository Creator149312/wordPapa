import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Enriches words with definitions using OpenAI API
 * Returns an array of word objects with definitions
 * @param {string[]} words - Array of words to enrich
 * @returns {Promise<Array<{word: string, wordData: string, source: string}>>}
 */
export async function enrichWordsWithAI(words) {
  if (!words || words.length === 0) return [];

  // Batch words into chunks (OpenAI has token limits)
  const batchSize = 15; // Process 15 words at a time
  const batches = [];

  for (let i = 0; i < words.length; i += batchSize) {
    batches.push(words.slice(i, i + batchSize));
  }

  const enrichedWords = [];

  for (const batch of batches) {
    try {
      const prompt = buildEnrichmentPrompt(batch);

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      // Parse the response
      const responseText = response.choices[0].message.content;
      const parsedWords = parseEnrichmentResponse(responseText, batch);

      enrichedWords.push(...parsedWords);
    } catch (batchError) {
      console.error("Error enriching batch:", batchError);

      // Fallback: Create placeholder entries for failed batch
      batch.forEach((word) => {
        enrichedWords.push({
          word,
          wordData: `A word: "${word}"`,
          source: "fallback",
        });
      });
    }
  }

  return enrichedWords;
}

/**
 * Builds an optimized prompt for word enrichment
 * @param {string[]} words - Array of words to enrich
 * @returns {string}
 */
function buildEnrichmentPrompt(words) {
  const wordList = words.join(", ");

  return `Act as a professional lexicographer. For each word in the following list, provide a concise definition with part of speech and one example sentence.

IMPORTANT: Return your response as valid JSON only, with no markdown formatting or extra text. The JSON must be an array of objects with this exact structure:
[
  {
    "word": "example",
    "definition": "(noun) A thing characteristic of its kind or illustrating a general rule; a specimen.",
    "example": "Our company is an example of a successful startup."
  },
  ...
]

Words to define: ${wordList}

Return ONLY the JSON array, no additional text or markdown formatting.`;
}

/**
 * Parses the enrichment response from OpenAI
 * @param {string} responseText - Raw response from OpenAI
 * @param {string[]} originalWords - Original words that were sent
 * @returns {Array<{word: string, wordData: string, source: string}>}
 */
function parseEnrichmentResponse(responseText, originalWords) {
  const enrichedWords = [];

  try {
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in response");

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed)) throw new Error("Response is not an array");

    parsed.forEach((item) => {
      if (item.word && item.definition) {
        const wordData =
          item.definition +
          (item.example ? ` Example: ${item.example}` : "");

        enrichedWords.push({
          word: item.word.toLowerCase(),
          wordData,
          source: "ai-openai",
        });
      }
    });

    // Add any words that weren't in the response (safety fallback)
    const returnedWords = new Set(parsed.map((w) => w.word.toLowerCase()));

    originalWords.forEach((word) => {
      if (!returnedWords.has(word.toLowerCase())) {
        enrichedWords.push({
          word,
          wordData: `Definition for "${word}" (generated)`,
          source: "ai-fallback",
        });
      }
    });

    return enrichedWords;
  } catch (parseError) {
    console.error("Error parsing enrichment response:", parseError);

    // Return placeholder entries for each word
    return originalWords.map((word) => ({
      word,
      wordData: `Definition generated for: ${word}`,
      source: "fallback",
    }));
  }
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
