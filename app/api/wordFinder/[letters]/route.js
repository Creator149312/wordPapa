import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import path from 'path';

// export async function GET(request, { params }) {
//   console.log("inside get request");
//   const { letters } = params;
//   const filePath = path.join(process.cwd(), '/app/api/word-finder/words.txt'); // Replace with your file path

//   console.log("complete filePath = " + filePath);

//   const fileContents = await fs.readFile(filePath, 'utf-8');
//   const lines = fileContents.split('\n');

//   // const regex = new RegExp(`^[${letters}]+$`, "i");

//   // const matchingLines = lines.filter((word)=> regex.test(word));

//   console.log(lines);

//   return NextResponse.json({ lines }, { status: 200 });
// }


//get all the lists
export async function GET(request, {params}) {
  console.log("Request received from Client");
  const lists = ["prime","time","crime","lime"];
  console.log(lists);
  return NextResponse.json({ lists }, {status: 200});
}