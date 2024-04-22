"use server";
import { getServerSession } from "next-auth";
import { connectMongoDB } from "@lib/mongodb";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import User from "@models/user";
import PasswordReset from "@models/passwordreset";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";
import {
  validatePassword,
  validateUsername,
  validateEmail,
} from "@utils/Validator";

export const updateNewPassword = async (formData) => {
  let errorData = { error: "" };
  const session = await getServerSession(authOptions);

  errorData.error = validatePassword(formData.get("currentPassword"));
  errorData.error = validatePassword(formData.get("newPassword"));
  errorData.error = validatePassword(formData.get("retypeNewPassword"));

  if (formData.get("newPassword") !== formData.get("retypeNewPassword"))
    errorData.error = "Passwords do not match";

  if (errorData.error.length !== 0) {
    console.log("Found Errors");
    return errorData;
  }
  let ifPasswordsMatch = false;
  try {
    if (session && errorData.error.length === 0) {
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

export const updateNewPasswordbyToken = async (formData, token) => {
  let errorData = { error: "" };

  let record = await PasswordReset.findOne({ token });

  console.log(record.email);

  errorData.error = validatePassword(formData.get("newPassword"));
  errorData.error = validatePassword(formData.get("retypeNewPassword"));

  if (formData.get("newPassword") !== formData.get("retypeNewPassword"))
    errorData.error = "Passwords do not match";

  if (errorData.error.length !== 0) {
    console.log("Found Errors");
    return errorData;
  }

  try {
    if (errorData.error.length === 0) {
      await connectMongoDB();

      const newhashedPassword = await bcrypt.hash(
        formData.get("newPassword"),
        10
      );

      const filter = { email: record.email };
      const update = { password: newhashedPassword };
      await User.findOneAndUpdate(filter, update);
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
  try {
    if (session) {
      //delete user record from database
      const result = await User.deleteOne({ email: session.user.email });
      //  console.log(result); // Log the result of the delete operation
    }
  } catch (error) {
    return { error: "Please login to delete your Account" };
  }

  // if (isUserDeleted) {
  //   redirect("/login");
  // }
};

// const validateRegistrationForm = (formData) => {

//   console.log("Error Validation in Server ", errorData);
//   return errorData;
// };

export const registerUser = async (formData) => {
  let errorData = { error: "" };

  let vu = validateUsername(formData.get("username"));
  let ve = validateEmail(formData.get("email"));
  let vp = validatePassword(formData.get("password"));

  if (vu.length !== 0) errorData.error = vu;
  if (ve.length !== 0) errorData.error = ve;
  if (vp.length !== 0) errorData.error = vp;

  try {
    console.log("form Data is Server,", formData);

    if (errorData.error.length !== 0) {
      console.log("Found Errors in Form Validation");
      return errorData;
    } else {
      console.log("Validated");
    }

    await connectMongoDB();

    let email = formData.get("email");
    let name = formData.get("username");
    let password = formData.get("password");

    const user = await User.findOne({ email }).select("_id");
    const userName = await User.findOne({ name }).select("_id");

    if (user) {
      return {
        error: "User already exists!",
      };
    } else if (userName) {
      return {
        error: "Username is already taken!",
      };
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      let res = await User.create({ name, email, password: hashedPassword });

      //TODO: send Email for verification

      console.log(res);
    }
  } catch (error) {
    return { error: "Error Registering a User" };
  }
};

export const generatePasswordResetLink = async (formData) => {
  let errorData = { error: "" };
  let token = "";

  let ve = validateEmail(formData.get("email"));

  if (ve.length !== 0) errorData.error = ve;

  try {
    console.log("form Data in Server,", formData);

    if (errorData.error.length !== 0) {
      console.log("Found Errors in Form Validation");
      return errorData;
    } else {
      console.log("Validated");
    }

    await connectMongoDB();

    let email = formData.get("email");

    //const user = await PasswordReset.findOne({ email }).select("_id");
    const user = false;
    if (user) {
      console.log("Existing rows found");

      token = "Whalksjdl fjaldjfaidf"; // we want a unique token on 16 characters

      const filter = { email: email };
      const update = { token: token };
      let res = await PasswordReset.findOneAndUpdate(filter, update);
    } else {
      token = "kjadslfjalduf9202i398239jalkdja9dj"; // we want a unique token on 16 characters

      console.log("No existing rows found");
      let res = await PasswordReset.create({ email, token });
    }

    console.log(`http://localhost:3000/new-password?token=${token}`);
  } catch (error) {
    return { error: "Error Registering a User" };
  }
};
