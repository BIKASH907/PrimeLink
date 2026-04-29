import mongoose from 'mongoose';

const BhatCVSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'BhatClient', required: true, unique: true, index: true },

  // Auto-extracted from passport / bills (OCR)
  autoFullName:        String,
  autoPassportNo:      String,
  autoDob:             Date,
  autoGender:          String,
  autoPassportIssue:   Date,
  autoPassportExpiry:  Date,
  autoFatherName:      String,
  autoMotherName:      String,
  autoAddress:         String,
  autoNationality:     String,

  // Manual fields entered by sub-admin
  maritalStatus:       { type: String, enum: ['single', 'married'], default: 'single' },
  spouseName:          String,
  religion:            String,
  permanentAddress:    String,
  positionApplied:     String,
  yearsExperience:     Number,
  languages:           String,

  generatedPdfUrl:     String,
}, { timestamps: true });

export default mongoose.models.BhatCV || mongoose.model('BhatCV', BhatCVSchema);
