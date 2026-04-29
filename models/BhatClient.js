import mongoose from 'mongoose';

const BhatClientSchema = new mongoose.Schema({
  refNo:       { type: String, required: true, unique: true },          // BHAT-REF-001
  fullName:    { type: String, required: true },
  passportNo:  { type: String, default: null, index: true },             // synced from CV/OCR for finance lookup
  country:     { type: String, enum: ['RO', 'TR'], required: true },
  company:     { type: String },                                         // text — no separate Company model
  agentName:   { type: String },                                         // text — no agent login
  position:    { type: String },
  stage:       { type: String, default: 'doc_collection' },
  progress:    { type: Number, default: 1 },                             // 1..14
  isUrgent:    { type: Boolean, default: false },
  stageEnteredAt: { type: Date, default: Date.now },
}, { timestamps: true });

BhatClientSchema.index({ country: 1, stage: 1 });
// refNo already has a unique index from `unique: true` above — no duplicate here
BhatClientSchema.index({ fullName: 'text', passportNo: 'text', refNo: 'text' });

export default mongoose.models.BhatClient || mongoose.model('BhatClient', BhatClientSchema);
