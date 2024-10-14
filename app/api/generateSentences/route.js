import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure you set your API key in environment variables
});

export async function POST(req) {
  try {
    const { queryType, word } = await req.json();

    // Define prompts based on query type
    const queryPrompts = {
      defandsentences: `Provide a definition of the word "${word}".
      Then generate between 2 and 3 sentences that use the word "${word}" in context.`,
      sentences: `Give an array of 3 to 5 short sentences that use the word "${word}".`,
    };

    // Simple validation to check if the word is valid (non-empty, alphabetic characters)
    if (!word || typeof word !== "string" || !/^[a-zA-Z]+$/.test(word)) {
      return new Response(
        JSON.stringify({
          error: "Invalid word. Please provide a valid alphabetic word.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create prompt for OpenAI
    const prompt = queryPrompts[queryType] || queryPrompts["defandsentences"];

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300, // Enough tokens to allow for definition and sentences
    });

    const completion = response.choices[0]?.message?.content || "";

    // Response validation: check if OpenAI gave sentences
    const sentences = completion
      .split(".")
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0) // Filter out empty strings
      .slice(0, 5); // Take up to 5 sentences

    // Ensure at least 3 sentences are returned
    if (sentences.length < 3) {
      return new Response(
        JSON.stringify({
          error:
            "Could not generate enough sentences. Try again with a different word.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return definition and sentences
    return new Response(
      JSON.stringify({ definitionAndSentences: completion }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // console.error("OpenAI API error:", error.message || error);

    return new Response(
      JSON.stringify({ error: "Failed to generate sentences" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
