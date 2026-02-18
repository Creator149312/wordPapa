import mongoose, { Schema, models } from "mongoose";

// Define the schema for the object inside the array
const wordDataObject = new mongoose.Schema({
  word: String,
  wordData: String,
});

const listSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    words: {
      type: [wordDataObject],
      default: [],
    }, // Array of wordDataObjects
    createdBy: {
      type: String,
      required: true,
    }, //includes email of user who created the list
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // }
  },
  {
    timestamps: true,
  },
);

const List = models.List || mongoose.model("List", listSchema);

export default List;
