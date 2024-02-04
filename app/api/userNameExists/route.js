import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { name } = await req.json();
    const userName = await User.findOne({ name }).select("_id");

    return NextResponse.json({ userName });
  } catch (error) {
    console.log(error);
  }
}
