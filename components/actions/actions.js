"use server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "@lib/mongodb";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import User from "@models/user";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

const validateForm = (formData) => {
  let error = {};
  if (formData.currentPassword.length < 8)
    error.currentPassword = "Password must be at least 8 characters long";
  if (formData.newPassword.length < 8)
    error.newPassword = "Password must be at least 8 characters long";
  if (formData.retypeNewPassword.length < 8) {
    error.retypeNewPassword = "Password must be at least 8 characters long";
  }

  // Client-side validation
  if (formData.newPassword !== formData.retypeNewPassword) {
    error.retypeNewPassword =
      "New password and retyped password do not match";
  }

  return error;
}

export const updateNewPassword = async (formData) => {
  const session = await getServerSession(authOptions);

  console.log(formData[0]);

  const ifErrors = validateForm(formData);
  
  if (Object.keys(ifErrors).length !== 0) {
    return {error: "Error Updating Your Password!"}
  }

  let ifPasswordsMatch = false;
  try {
    if (session && Object.keys(ifErrors).length === 0) {
      await connectMongoDB();
      const userData = await User.find({ email: session.user.email });

      ifPasswordsMatch = await bcrypt.compare(
        formData.get("currentPassword"),
        userData[0].password
      );
      const newhashedPassword = await bcrypt.hash(
        formData.get("newPassword"),
        10
      );

      if (ifPasswordsMatch) {
        const filter = { email: session.user.email };
        const update = { password: newhashedPassword };
        await User.findOneAndUpdate(filter, update);
        console.log("Password Changed Redirecting");
      } else {
        return {
          error: "Please enter the correct Password!",
        };
      }
    } else {
      //send error message to client
      return {
        error: "Please login to change Password!",
      };
    }
  } catch (error) {
    return { error: "Error resetting password" };
  }

  // if (ifPasswordsMatch) {
  //   redirect("/login");
  // }
};

export const deleteUserAccount = async (formData) => {
  const session = await getServerSession(authOptions);
  let isUserDeleted = false;
  try {
    if (session) {
      //delete user record from database
      const result = await User.deleteOne({ email: session.user.email });
      console.log(result); // Log the result of the delete operation
    }
  } catch (error) {
    return { error: "Please login to delete your Account" };
  }

  // if (isUserDeleted) {
  //   redirect("/login");
  // }
};
