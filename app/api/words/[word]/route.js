import { connectMongoDB } from "@/lib/mongodb";
import Word from "@models/word";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const decodedWord = decodeURIComponent(params.word).toUpperCase();
    const wordData = await Word.findOne({ word: decodedWord });

    if (!wordData) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(wordData);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}