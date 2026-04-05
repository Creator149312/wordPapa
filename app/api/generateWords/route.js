import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure to set your API key in environment variables
});

export async function POST(req) {
  try {
    const { queryType, prompt, wordCount } = await req.json();

    // Cap between 5 and 50 words
    const requestedCount = Math.min(Math.max(parseInt(wordCount, 10) || 20, 5), 50);

    // Define prompts based on query type
    const queryPrompts = {
      adjective: `Give a list of ${requestedCount} adjective words to describe: "${prompt}" (no numbering, one per line).`,
      rhymes: `Give an array of ${requestedCount} words that rhyme with: "${prompt}" (no numbering, one per line).`,
      topic: `Give a list of ${requestedCount} vocabulary words a learner should practice for the topic: "${prompt}" (no numbering, one per line).`,
    };

    // Choose the appropriate prompt based on queryType, default to 'topic'
    const chosenPrompt = queryPrompts[queryType] || queryPrompts["topic"];

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: chosenPrompt }],
      max_tokens: Math.ceil(requestedCount * 12), // ~12 tokens per word entry
    });

    // Get the text from OpenAI response
    const completion = response.choices[0]?.message?.content || "";

    // Parse words: handle multiple formats (comma, newline, dash, numbering)
    const words = completion
      .split(/[\n,]+/)
      .map((word) =>
        word
          .replace(/^[-•*\d.)\s]+/, "") // Remove leading dashes, bullets, numbers
          .trim()
          .toLowerCase()
      )
      .filter((word) => word.length > 0 && /^[a-z\s'-]+$/.test(word))
      .slice(0, requestedCount);

    // Return the list of words as JSON
    return new Response(JSON.stringify({ words }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // console.error("OpenAI API error:", error.message || error);

    return new Response(JSON.stringify({ error: "Failed to generate words" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
