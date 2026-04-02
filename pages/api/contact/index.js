import connectDB from '../../../lib/db';
import Contact from '../../../models/Contact';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { name, email, phone, company, subject, message, type } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    }

    const contact = await Contact.create({ name, email, phone, company, subject, message, type });
    return res.status(201).json({ success: true, id: contact._id });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
