import mongoose from 'mongoose';

const BhatDocumentSchema = new mongoose.Schema({
  client:       { type: mongoose.Schema.Types.ObjectId, ref: 'BhatClient', required: true, index: true },
  docType:      { type: String, required: true },
  fileUrl:      { type: String },                          // Cloudinary URL
  filePublicId: { type: String },                          // Cloudinary public_id
  folder:       { type: String },                          // company/candidate folder it lives in
  issueDate:    { type: Date },
  expiryDate:   { type: Date },                            // auto-set from passport OCR
  status: {
    type: String,
    enum: ['ok', 'missing', 'expiring', 'expired', 'needs_review'],
    default: 'ok',
  },

  // ---- OCR ----
  ocrExtracted:    { type: mongoose.Schema.Types.Mixed },  // structured fields
  ocrRawText:      { type: String },                       // raw OCR output (preview)
  ocrConfidence:   { type: Number, default: null },        // 0-100 score
  needsReview:     { type: Boolean, default: false },      // true if confidence < threshold or fields incomplete
  reviewedAt:      { type: Date, default: null },
  reviewedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'BhatUser' },

  // ---- Soft-delete (archive) ----
  archivedAt:      { type: Date, default: null, index: true },
  archivedReason:  { type: String, default: null },        // 'auto_cleanup' | 'manual'

  uploadedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'BhatUser' },
}, { timestamps: true });

BhatDocumentSchema.index({ client: 1, docType: 1 });
BhatDocumentSchema.index({ status: 1, expiryDate: 1 });
BhatDocumentSchema.index({ needsReview: 1 });

export default mongoose.models.BhatDocument || mongoose.model('BhatDocument', BhatDocumentSchema);
