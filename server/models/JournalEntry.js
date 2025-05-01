import mongoose from "mongoose"

const journalEntrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      enum: ['happy', 'sad', 'anxious', 'neutral', 'angry', 'excited', 'tired'],
      default: 'neutral',
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const journalModel = mongoose.models.journalModel || mongoose.model('journalModel', journalEntrySchema);

export default journalModel;