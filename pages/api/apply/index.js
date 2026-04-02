import connectDB from '../../../lib/db';
import Application from '../../../models/Application';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { firstName, lastName, email, phone, nationality, country, dateOfBirth, passportNumber, education, experience, skills, preferredIndustry, englishLevel, availableFrom, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !nationality || !country) {
      return res.status(400).json({ error: 'First name, last name, email, phone, nationality, and country are required.' });
    }

    const application = await Application.create({
      firstName, lastName, email, phone, nationality, country, dateOfBirth, passportNumber,
      education, experience, skills, preferredIndustry, englishLevel, availableFrom, message
    });

    return res.status(201).json({ success: true, id: application._id });
  } catch (error) {
    console.error('Application API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
