import mongoose from 'mongoose';

const beneficiaryProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    age: {
      type: Number,
    },
    education: {
      type: String,
      trim: true,
    },
    employment_status: {
      type: String,
      trim: true,
    },
    work_experience: {
      type: String,
      trim: true,
    },
    preferred_location: {
      type: String,
      trim: true,
    },
    willing_to_relocate: {
      type: Boolean,
      default: false,
    },
    employment_preference: {
      type: String,
      trim: true,
    },
    preferred_sector: {
      type: String,
      trim: true,
    },
    profile_completion: {
      type: Number,
      default: 0,
    },
    skills: [
      {
        name: { type: String, required: true },
        category: { type: String, default: 'General' },
        proficiency_level: { type: String, default: 'Beginner' },
      },
    ],
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
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

export const BeneficiaryProfile = mongoose.model('BeneficiaryProfile', beneficiaryProfileSchema);
export default BeneficiaryProfile;
