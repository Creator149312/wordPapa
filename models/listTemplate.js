import mongoose from 'mongoose';

const ListTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  context: {
    type: String,
    required: true,
    description: "Context/topic for AI to generate words e.g., 'vegetables and fruits'"
  },
  wordCount: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  level: {
    type: String,
    enum: ['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'mastery'],
    default: 'beginner'
  },
  rank: {
    type: Number,
    min: 1,
    max: 8,
    description: "Journey rank (1-8)"
  },
  node: {
    type: Number,
    min: 1,
    max: 5,
    description: "Node within the rank (1-5)"
  },
  category: {
    type: String,
    default: '',
    description: "Category/topic for organization"
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'created', 'failed'],
    default: 'draft'
  },
  createdListId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  },
  generatedWords: {
    type: [String],
    default: []
  },
  error: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ListTemplateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.ListTemplate || mongoose.model('ListTemplate', ListTemplateSchema);
