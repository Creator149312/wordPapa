import { connectMongoDB } from "@lib/mongodb";
import List from "@models/list";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;
  const { newTitle: title, newDescription: description, newWords: words } = await request.json();
  await connectMongoDB();
  await List.findByIdAndUpdate(id, { title, description, words });
  return NextResponse.json({ message: "List updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { createdBy } = params;
  await connectMongoDB();
  const lists = await List.find({ createdBy: createdBy });
  return NextResponse.json({ lists }, { status: 200 });
}