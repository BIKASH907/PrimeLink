import connectDB from '../../lib/db';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, createdAt: { type: Date, default: Date.now } });
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export default async function handler(req, res) {
  await connectDB();
  const hash = await bcrypt.hash('Primelink@2026', 10);
  await Admin.findOneAndUpdate({ email: 'admin@primelinkhumancapital.com' }, { name: 'Bikash', email: 'admin@primelinkhumancapital.com', password: hash, role: 'super_admin' }, { upsert: true });
  res.json({ success: true, message: 'Admin created', email: 'admin@primelinkhumancapital.com' });
}
