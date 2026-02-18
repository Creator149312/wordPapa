import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // enforce unique email
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String, // profile picture (Google avatar, etc.)
    },
    provider: {
      type: String,
      enum: ["credentials", "google"], // track how user signed up
      default: "credentials",
    },
    password: {
      type: String,
      // only required if provider is "credentials"
      required: function () {
        return this.provider === "credentials";
      },
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
