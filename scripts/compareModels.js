require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4o-mini-2024-07-18",
  "gpt-5.4-nano",
  "gpt-5.4-mini"
];

async function testModel(word, model) {
  console.log(`\n--- Testing Model: ${model} for word: "${word}" ---`);
  const start = Date.now();
  
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
      model: model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const duration = Date.now() - start;
    const content = JSON.parse(response.choices[0].message.content);
    
    console.log(`Status: Success`);
    console.log(`Latency: ${duration}ms`);
    console.log(`Tokens: ${response.usage.total_tokens} (Prompt: ${response.usage.prompt_tokens}, Completion: ${response.usage.completion_tokens})`);
    console.log(`Output Snippet:\n`, JSON.stringify(content.entries[0], null, 2));
    
    return { model, duration, tokens: response.usage.total_tokens, success: true };
  } catch (error) {
    console.error(`Status: Failed`);
    console.error(`Error: ${error.message}`);
    return { model, success: false };
  }
}

async function runComparison() {
  const word = process.argv[2] || "serendipity";
  console.log(`Comparing models for word: ${word}`);
  
  const results = [];
  for (const model of MODELS) {
    results.push(await testModel(word, model));
  }

  console.log("\n\n=== FINAL COMPARISON SUMMARY ===");
  console.table(results);
}

runComparison();
