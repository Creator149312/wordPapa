import { connectMongoDB } from "@lib/mongodb";
import List from "@models/list";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

const validateEmail = async (data) => {
  let errors = {};

  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

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


export async function PUT(request, { params }) {
  const { id } = params;
  const {
    newTitle: title,
    newDescription: description,
    newWords: words,
  } = await request.json();
  await connectMongoDB();
  await List.findByIdAndUpdate(id, { title, description, words });
  return NextResponse.json({ message: "List updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  const { createdBy } = params;
  const validationErrors = validateEmail({ email: createdBy });
  if (Object.keys(validationErrors).length === 0) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      if (createdBy === session.user.email) {
        //if user abc is requesting for data of user abc
        await connectMongoDB();
        const lists = await List.find({ createdBy: createdBy });
        return NextResponse.json({ lists }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  } else {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
