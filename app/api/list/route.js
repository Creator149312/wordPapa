import { connectMongoDB } from "@lib/mongodb";
import List from "@models/list";
import { validateListTitle } from "@utils/Validator";
import { NextResponse } from "next/server";

// Create a new list
export async function POST(request) {
  try {
    const { title, description, words, createdBy } = await request.json();
    let error = "";

    const vlt = validateListTitle(title);
    if (vlt.length !== 0) error = vlt;

    if (error.length === 0) {
      await connectMongoDB();

      // Store the result of the creation in a variable
      const newList = await List.create({ 
        title, 
        description: description || "My custom list", 
        words: words || [], // Ensure words is at least an empty array
        createdBy 
      });

      // Return the newList object so the frontend can use data.list
      return NextResponse.json(
        { 
          message: "List Created Successfully", 
          list: newList 
        }, 
        { status: 201 }
      );
    } else {
      return NextResponse.json({ error }, { status: 400 });
    }
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: "Error creating list", details: e.message }, 
      { status: 500 }
    );
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
