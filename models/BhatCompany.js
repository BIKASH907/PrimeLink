// =====================================================
// BhatCompany — destination companies (employers in TR/RO)
//
// Soft-delete model: setting archivedAt = <date> hides the company from
// the active Documents grid but preserves all data + lets admin restore it.
// Permanent delete requires Super-Admin + explicit type-to-confirm.
// =====================================================
import mongoose from 'mongoose';

const BhatCompanySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  country: { type: String, enum: ['RO', 'TR'], required: true, index: true },
  contact: { type: String },
  email:   { type: String },
  phone:   { type: String },
  address: { type: String },
  notes:   { type: String },

  // Soft-delete
  archivedAt:     { type: Date, default: null, index: true },
  archivedReason: { type: String, default: null },
  archivedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'BhatUser' },
}, { timestamps: true });

BhatCompanySchema.index({ country: 1, name: 1 }, { unique: true });

export default mongoose.models.BhatCompany || mongoose.model('BhatCompany', BhatCompanySchema);
