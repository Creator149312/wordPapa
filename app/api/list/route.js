import { connectMongoDB } from "@lib/mongodb";
import List from "@models/list";
import { validateListTitle } from "@utils/Validator";
import { NextResponse } from "next/server";

// Create a new list
export async function POST(request) {
  try {
    const { title, description, createdBy } = await request.json();
    let error = "";

    const vlt = validateListTitle(title);
    if (vlt.length !== 0) error = vlt;

    if (error.length === 0) {
      await connectMongoDB();
      await List.create({ title, description, createdBy });
      return NextResponse.json({ message: "List Created Successfully" }, { status: 201 });
    } else {
      return NextResponse.json({ error }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: "Error creating list", details: e.message }, { status: 500 });
  }
}

// Get all lists
export async function GET() {
  await connectMongoDB();
  const lists = await List.find();
  return NextResponse.json({ lists }, { status: 200 });
}

// Delete a list by ID
export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await List.findByIdAndDelete(id);
  return NextResponse.json({ message: "List deleted" }, { status: 200 });
}
