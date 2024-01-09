import mongoose, { Schema, models } from "mongoose";

const listSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    words:  {
      type: [String],
      default: []
    }, // Array of strings
    createdBy: {
      type: String,
      required: true
    } //includes email of user who created the list
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // }
  },
  {
    timestamps: true,
  }
);

const List = models.List || mongoose.model("List", listSchema);

export default List;