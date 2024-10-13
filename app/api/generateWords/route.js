import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure to set your API key in environment variables
});

export async function POST(req) {
  try {
    const { queryType, prompt } = await req.json();

    // console.log("Query Type = ", queryType);
    // console.log("Query Prompt = ", prompt);

    // Define prompts based on query type
    const queryPrompts = {
      adjective: `Give a list of 10 adjective words to describe: "${prompt}". without numbering`,
      rhymes: `Give an array of 10 words that rhymes with: "${prompt}". without numbering`,
    };

    // Choose the appropriate prompt based on queryType, default to 'tool'
    const chosenPrompt = queryPrompts[queryType] || queryPrompts["adjective"];

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: chosenPrompt }],
      max_tokens: 50,
    });

    // Get the text from OpenAI response
    const completion = response.choices[0]?.message?.content || "";

    // Ensure it's split into words
    const words = completion
      .split(",")
      .map((word) => word.trim())
      .slice(0, 8); // Ensure we only take 6 words

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
