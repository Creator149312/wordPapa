import mongoose from "mongoose";

const NodeListSchema = new mongoose.Schema(
  {
    rank: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    node: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    order: {
      type: Number,
      default: 0, // For sorting lists within a node
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate assignments
NodeListSchema.index({ rank: 1, node: 1, listId: 1 }, { unique: true });

const NodeList =
  mongoose.models.NodeList || mongoose.model("NodeList", NodeListSchema);

export default NodeList;
