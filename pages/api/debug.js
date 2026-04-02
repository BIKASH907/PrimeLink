import connectDB from '../../lib/db';
import mongoose from 'mongoose';
const JobSchema = new mongoose.Schema({ title: String, industry: String, location: String, positions: Number, duration: String, accommodation: Boolean, salary: String, status: String, createdAt: Date });
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
export default async function handler(req, res) {
  await connectDB();
  const count = await Job.countDocuments();
  const sample = await Job.find().limit(3);
  const collections = await mongoose.connection.db.listCollections().toArray();
  res.json({ jobCount: count, collections: collections.map(c => c.name), sample });
}
