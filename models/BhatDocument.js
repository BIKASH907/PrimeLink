import mongoose from 'mongoose';

const BhatDocumentSchema = new mongoose.Schema({
  client:       { type: mongoose.Schema.Types.ObjectId, ref: 'BhatClient', required: true, index: true },
  docType:      { type: String, required: true },
  fileUrl:      { type: String },                          // Cloudinary URL
  filePublicId: { type: String },                          // Cloudinary public_id
  issueDate:    { type: Date },
  expiryDate:   { type: Date },                            // auto-set from passport OCR
  status: {
    type: String,
    enum: ['ok', 'missing', 'expiring', 'expired'],
    default: 'ok',
  },
  uploadedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'BhatUser' },
  ocrExtracted: { type: mongoose.Schema.Types.Mixed },     // raw OCR JSON
}, { timestamps: true });

BhatDocumentSchema.index({ client: 1, docType: 1 });
BhatDocumentSchema.index({ status: 1, expiryDate: 1 });

export default mongoose.models.BhatDocument || mongoose.model('BhatDocument', BhatDocumentSchema);
