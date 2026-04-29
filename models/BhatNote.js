import mongoose from 'mongoose';

const BhatNoteSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'BhatClient', required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'BhatUser' },
  authorName: { type: String },
  body:   { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.BhatNote || mongoose.model('BhatNote', BhatNoteSchema);
