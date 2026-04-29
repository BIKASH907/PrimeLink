// =====================================================
// BhatCompany — destination companies (employers in TR/RO)
// Lets admin pre-create empty companies AND store metadata
// (contact, address, notes). Companies on the Documents page
// = union of BhatCompany rows + unique client.company strings.
// =====================================================
import mongoose from 'mongoose';

const BhatCompanySchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  country: { type: String, enum: ['RO', 'TR'], required: true, index: true },
  contact: { type: String },                             // primary contact person
  email:   { type: String },
  phone:   { type: String },
  address: { type: String },
  notes:   { type: String },
}, { timestamps: true });

BhatCompanySchema.index({ country: 1, name: 1 }, { unique: true });

export default mongoose.models.BhatCompany || mongoose.model('BhatCompany', BhatCompanySchema);
