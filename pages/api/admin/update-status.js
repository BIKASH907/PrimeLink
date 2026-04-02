import connectDB from '../../../lib/db';
import { verifyAdmin } from '../../../lib/adminAuth';
import Application from '../../../models/Application';
import EmployerInquiry from '../../../models/EmployerInquiry';
import Contact from '../../../models/Contact';

const modelMap = {
  application: Application,
  inquiry: EmployerInquiry,
  contact: Contact,
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  const admin = verifyAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await connectDB();
    const { id, type, status, notes } = req.body;

    if (!id || !type || !status) {
      return res.status(400).json({ error: 'id, type, and status are required' });
    }

    const Model = modelMap[type];
    if (!Model) return res.status(400).json({ error: 'Invalid type' });

    const update = { status };
    if (notes !== undefined) update.notes = notes;

    const doc = await Model.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
