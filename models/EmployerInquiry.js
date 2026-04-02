import mongoose from 'mongoose';

const EmployerInquirySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  cui: { type: String },
  industry: { type: String, required: true },
  workersNeeded: { type: Number },
  positions: { type: String },
  startDate: { type: String },
  duration: { type: String },
  location: { type: String },
  accommodation: { type: String, enum: ['provided', 'not-provided', 'partial'] },
  salaryRange: { type: String },
  message: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'negotiating', 'contracted', 'fulfilled', 'closed'], default: 'new' },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.EmployerInquiry || mongoose.model('EmployerInquiry', EmployerInquirySchema);
