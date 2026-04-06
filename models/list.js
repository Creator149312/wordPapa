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
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    practiceCount: {
      type: Number,
      default: 0,
    },
    // System-managed lists that users cannot delete (e.g., "Tough Nuts")
    isSystemList: {
      type: Boolean,
      default: false,
      index: true,
    },
    isToughNuts: {
      type: Boolean,
      default: false,
    },
    // System tags used to hide lists from the public browse page.
    // Values: "journey-node" (assigned to a Journey node), "tough-nuts" (spaced repetition list).
    // Lists with any systemTag are excluded from /lists unless explicitly requested.
    systemTags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const List = models.List || mongoose.model("List", listSchema);

// Index for the default browse sort (createdAt: -1) combined with the systemTags filter.
// Without this, every /api/list request does a full collection scan before sorting.
listSchema.index({ systemTags: 1, createdAt: -1 });

export default List;
