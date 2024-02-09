import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { validateUsername } from "@utils/Validator";
import { NextResponse } from "next/server";

const validateForm = async (data) => {
  let errors = {};

  // // Validate username
  // const usernameRegex = /^[a-zA-Z0-9]+$/;
  // if (!data.name.trim()) {
  //   errors.name = "Username is required";
  // } else if (!usernameRegex.test(data.name)) {
  //   errors.name = "Username must contain only letters and digits";
  // }

  let vu = validateUsername(data.name);
  if (vu.length !== 0) errors.name = vu;

  return errors;
};

export async function POST(req) {
  try {
    const { name } = await req.json();
    let validationErrors = await validateForm({ name });

    if (Object.keys(validationErrors).length === 0) {
      await connectMongoDB();
      const userName = await User.findOne({ name }).select("_id");

      return NextResponse.json({ userName });
    }

    return NextResponse.json({ });
  } catch (error) {
    
    console.log("Error Occured in UserNameExists Route");
    return;
  }
}
