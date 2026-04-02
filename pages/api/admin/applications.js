import connectDB from '../../../lib/db';
import { verifyAdmin } from '../../../lib/adminAuth';
import Application from '../../../models/Application';

export default async function handler(req, res) {
  const admin = verifyAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  await connectDB();

  if (req.method === 'GET') {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const filter = {};
      if (status) filter.status = status;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [applications, total] = await Promise.all([
        Application.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
        Application.countDocuments(filter)
      ]);
      return res.status(200).json({ success: true, applications, total, pages: Math.ceil(total / parseInt(limit)) });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch applications' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
