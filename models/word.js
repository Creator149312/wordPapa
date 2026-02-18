import mongoose, { Schema, models } from "mongoose";

const entrySchema = new Schema(
  {
    pos: {
      type: String,
      required: true,
      enum: ["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection"], 
      trim: true,
    },
    definition: {
      type: String,
      required: true,
    },
    examples: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 4,
        message: "Too many examples provided",
      },
    },
  },
  { _id: false } // prevent automatic _id for subdocuments
);

const wordSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true, // each word stored only once
      trim: true,
    },
    entries: {
      type: [entrySchema], // multiple entries for different POS
      required: true,
    },
  },
  { timestamps: true }
);

const Word = models.Word || mongoose.model("Word", wordSchema);
export default Word;
