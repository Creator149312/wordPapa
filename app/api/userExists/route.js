import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { validateEmail } from "@utils/Validator";
import { NextResponse } from "next/server";

const validateForm = async (data) => {
  let errors = {};
  data.email = "jakldfj"
  console.log("Inside user exists");
  console.log(data.email);

  let ve = validateEmail(data.email);

  if(ve.length !== 0) errors.email = ve;

  console.log(ve)
  return errors;
};

export async function POST(req) {
  try {
    const { email} = await req.json();

    let validationErrors = await validateForm({ email });

    if (Object.keys(validationErrors).length === 0) {
      await connectMongoDB();
      const user = await User.findOne({ email }).select("_id");

      return NextResponse.json({ user });
    }
    
    return NextResponse.json({});
  } catch (error) {
    console.log("Error Occured in UserExists Route");
    return;
  }
}
