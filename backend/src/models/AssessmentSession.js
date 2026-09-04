import mongoose from 'mongoose';

const conversationTurnSchema = new mongoose.Schema({
  questionPrompt: { type: String, default: '' },
  userAnswer: { type: String, default: '' },
  acknowledgement: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const assessmentSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    current_question_index: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    transcript: [conversationTurnSchema],
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const AssessmentSession = mongoose.model('AssessmentSession', assessmentSessionSchema);
export default AssessmentSession;
