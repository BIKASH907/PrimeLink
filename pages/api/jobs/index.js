import connectDB from '../../../lib/db';
import Job from '../../../models/Job';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { active, featured, industry } = req.query;
      const filter = {};
      if (active === 'true') filter.isActive = true;
      if (featured === 'true') filter.isFeatured = true;
      if (industry) filter.industry = industry;

      const jobs = await Job.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, jobs });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const job = await Job.create(req.body);
      return res.status(201).json({ success: true, job });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create job' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
