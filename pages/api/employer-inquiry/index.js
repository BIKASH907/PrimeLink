import connectDB from '../../../lib/db';
import EmployerInquiry from '../../../models/EmployerInquiry';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { companyName, contactPerson, email, phone, cui, industry, workersNeeded, positions, startDate, duration, location, accommodation, salaryRange, message } = req.body;

    if (!companyName || !contactPerson || !email || !phone || !industry) {
      return res.status(400).json({ error: 'Company name, contact person, email, phone, and industry are required.' });
    }

    const inquiry = await EmployerInquiry.create({
      companyName, contactPerson, email, phone, cui, industry,
      workersNeeded: workersNeeded ? parseInt(workersNeeded) : undefined,
      positions, startDate, duration, location, accommodation, salaryRange, message
    });

    return res.status(201).json({ success: true, id: inquiry._id });
  } catch (error) {
    console.error('Employer inquiry API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
