import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job_role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobRole',
      required: true,
    },
    role_name: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      required: true,
    },
    nsqf_level: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    required_education: {
      type: String,
      default: '',
    },
    training_duration: {
      type: String,
      default: '',
    },
    match_score: {
      type: Number,
      required: true,
    },
    why_recommended: [{ type: String }],
    matching_skills: [{ type: String }],
    missing_skills: [{ type: String }],
    career_path: [mongoose.Schema.Types.Mixed],
    generated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.job_role_id = ret.job_role;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
