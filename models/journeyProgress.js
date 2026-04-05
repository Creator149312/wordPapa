import mongoose from 'mongoose';

const ListProgressSchema = new mongoose.Schema({
  listId: String,  // MongoDB ObjectId as string
  percent: { type: Number, default: 0 }
});

const NodeProgressSchema = new mongoose.Schema({
  nodeId: Number,
  lists: [ListProgressSchema],
  nodePercent: { type: Number, default: 0 }
});

const RankProgressSchema = new mongoose.Schema({
  rankId: Number,
  nodes: [NodeProgressSchema]
});

const JourneyProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  progress: [RankProgressSchema]
});

export default mongoose.models.JourneyProgress || mongoose.model('JourneyProgress', JourneyProgressSchema);
