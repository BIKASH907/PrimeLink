import connectDB from '../../../lib/db';
import { verifyAdmin } from '../../../lib/adminAuth';
import EmployerInquiry from '../../../models/EmployerInquiry';

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
      const [inquiries, total] = await Promise.all([
        EmployerInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
        EmployerInquiry.countDocuments(filter)
      ]);
      return res.status(200).json({ success: true, inquiries, total, pages: Math.ceil(total / parseInt(limit)) });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
