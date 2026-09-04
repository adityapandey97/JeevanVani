import mongoose from 'mongoose';

const careerStepSchema = new mongoose.Schema({
  stage: { type: Number, required: true },
  title: { type: String, required: true },
  experience: { type: String, default: '' },
  wage_range: { type: String, default: '' },
  description: { type: String, default: '' },
});

const jobRoleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sector: {
      type: String,
      required: true,
      trim: true,
    },
    nsqf_level: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    required_education: {
      type: String,
      required: true,
    },
    training_duration: {
      type: String,
      required: true,
    },
    skills: [
      {
        name: { type: String, required: true },
        category: { type: String, default: 'Technical' },
      },
    ],
    career_path: [careerStepSchema],
    is_active: {
      type: Boolean,
      default: true,
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

export const JobRole = mongoose.model('JobRole', jobRoleSchema);
export default JobRole;
