import { connectMongoDB } from "@lib/mongodb";
import List from "@models/list";
import { NextResponse } from "next/server";

//sending request to create a list
export async function POST(request) {
  const { title, description, words, createdBy } = await request.json();
  await connectMongoDB();
  await List.create({ title, description, words, createdBy });
  return NextResponse.json({ message: "List Created with words" }, { status: 201 });
}

//get all the lists
export async function GET() {
    await connectMongoDB();
    const lists = await List.find();
    return NextResponse.json({ lists }, {status: 200});
  }

//   //get all the lists created by a user
// export async function GET(request) {
//   const {createdBy} =  await request.json();
//   console.log("CreatedBy = " + request);
//   await connectMongoDB();
//   const lists = await List.find({ createdBy: createdBy });
//   return NextResponse.json({ lists }, {status: 200});
// }

// to delete a particular List using it's List ID
  export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await List.findByIdAndDelete(id);
    return NextResponse.json({ message: "List deleted" }, { status: 200 });
  }