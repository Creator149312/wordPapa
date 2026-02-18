import { NextResponse } from "next/server";
import OpenAI from "openai";
import mongoose from "mongoose";
import Word from "@models/word";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// MongoDB connection
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI);
}

export async function POST(req) {
  const { words } = await req.json();
  const results = [];

  for (const word of words) {
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
          "examples": ["...", "...", "...", "..."]
        }
      ]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    // Save to MongoDB using updated schema
    await Word.updateOne(
      { word },
      { $set: { word, entries: parsed.entries } },
      { upsert: true },
    );

    results.push({ word, entries: parsed.entries });
  }

  return NextResponse.json({ saved: results });
}
