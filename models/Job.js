import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  country: { type: String, default: 'Romania' },
  description: { type: String, required: true },
  requirements: { type: String },
  benefits: { type: String },
  salaryRange: { type: String },
  positions: { type: Number, default: 1 },
  contractType: { type: String, enum: ['temporary', 'permanent', 'seasonal'], default: 'temporary' },
  duration: { type: String },
  accommodation: { type: Boolean, default: false },
  transportation: { type: Boolean, default: false },
  startDate: { type: String },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  employer: { type: String },
}, { timestamps: true });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
