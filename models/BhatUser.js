import mongoose from 'mongoose';

const BhatUserSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name:     { type: String, required: true },
  role:     {
    type: String,
    enum: ['super_admin', 'admin', 'sub_admin'],
    default: 'sub_admin',
  },
  // Country scope: 'RO' or 'TR'. Super-Admin without country sees both.
  country:           { type: String, enum: ['RO', 'TR', null], default: null },
  assignedClients:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'BhatClient' }],
  isActive:          { type: Boolean, default: true },
  lastLoginAt:       { type: Date },
}, { timestamps: true });

BhatUserSchema.index({ email: 1 });
BhatUserSchema.index({ role: 1, country: 1 });

export default mongoose.models.BhatUser || mongoose.model('BhatUser', BhatUserSchema);
