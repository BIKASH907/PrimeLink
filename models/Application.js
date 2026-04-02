import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  nationality: { type: String, required: true },
  country: { type: String, required: true },
  dateOfBirth: { type: String },
  passportNumber: { type: String },
  education: { type: String },
  experience: { type: String },
  skills: { type: String },
  preferredIndustry: { type: String },
  englishLevel: { type: String, enum: ['none', 'basic', 'intermediate', 'advanced', 'fluent'] },
  availableFrom: { type: String },
  resumeUrl: { type: String },
  photoUrl: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'reviewing', 'shortlisted', 'approved', 'rejected', 'placed'], default: 'pending' },
  notes: { type: String },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
