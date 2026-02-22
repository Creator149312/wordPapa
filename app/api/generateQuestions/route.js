import { NextResponse } from "next/server";
// Example using OpenAI (pseudo-code)
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { word } = await req.json();

  const prompt = `Generate 1 simple multiple-choice quiz questions for the word "${word}" for kids to practice. 
  Each question should have 1 correct option and 2 incorrect distractors. 
  Return JSON with {questions:[{prompt, options:[{text, correct}]}]}.`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  //   console.log(completion.choices[0].message.content);
  const data = JSON.parse(completion.choices[0].message.content);
  console.log("Question = " + data.questions[0].prompt);

  return NextResponse.json({ questions: data.questions });
}
