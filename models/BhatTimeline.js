import mongoose from 'mongoose';

const BhatTimelineSchema = new mongoose.Schema({
  client:      { type: mongoose.Schema.Types.ObjectId, ref: 'BhatClient', required: true, index: true },
  actor:       { type: mongoose.Schema.Types.ObjectId, ref: 'BhatUser' },
  actorName:   { type: String },
  isSystem:    { type: Boolean, default: false },         // auto-generated
  eventType:   { type: String },                          // stage_advanced / doc_uploaded / etc.
  description: { type: String },
}, { timestamps: true });

BhatTimelineSchema.index({ client: 1, createdAt: -1 });

export default mongoose.models.BhatTimeline || mongoose.model('BhatTimeline', BhatTimelineSchema);
