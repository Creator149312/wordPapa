"use server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "@lib/mongodb";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import User from "@models/user";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export const updateNewPassword = async (formData) => {
  const session = await getServerSession(authOptions);
  console.log(formData);
  try {
    if (session) {
      await connectMongoDB();
      const userData = await User.find({ email: session.user.email });

      const ifPasswordsMatch = await bcrypt.compare(
        formData.get("currentPassword"),
        userData[0].password
      );
      const newhashedPassword = await bcrypt.hash(
        formData.get("newPassword"),
        10
      );

      // console.log("Do passwords Match? " + ifPasswordsMatch);
      // console.log(newhashedPassword);
      if (ifPasswordsMatch) {
        const filter = { email: session.user.email };
        const update = { password: newhashedPassword };
        await User.findOneAndUpdate(filter, update);
        console.log("Password Changed Redirecting");
        // redirect('/dashboard'); 
      }
    } else {
      //send error message to client
    }
  } catch (error) {
    console.error("Error resetting password:", error);
  }
};

export const deleteUserAccount = async (formData) => {
  const session = await getServerSession(authOptions);
  try {
    if(session){
      //delete user record from database
      console.log("I am going to delete your account");
      const result = await User.deleteOne({ email: session.user.email });
      console.log(result); // Log the result of the delete operation
      // redirect('/login');
    }
  } catch (error) {
    console.error("Error resetting password:", error);
  }
};
