import { connectMongoDB } from "@lib/mongodb";
import List from "@models/list";
import { NextResponse } from "next/server";

// Create a new list
export async function POST(request) {
  try {
    const { title, words, createdBy } = await request.json();
    let error = "";

    const vlt = validateListTitle(title);
    if (vlt.length !== 0) error = vlt;

    if (error.length === 0) {
      await connectMongoDB();
      await List.create({ title, words, createdBy });
      return NextResponse.json({ message: "List Created Successfully" }, { status: 201 });
    } else {
      return NextResponse.json({ error }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Error creating list", details: e.message }, { status: 500 });
  }
}
