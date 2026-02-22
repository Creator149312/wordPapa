import { NextResponse } from "next/server";
import Word from "@models/word";
import { connectMongoDB } from "@lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const word = searchParams.get("word");

  await connectMongoDB();
  const wordData = await Word.findOne({ word });

  if (!wordData) {
    return NextResponse.json({ error: "Word not found" }, { status: 404 });
  }

  return NextResponse.json(wordData);
}
