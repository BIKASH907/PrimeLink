import connectDB from '../../../lib/db';
import Job from '../../../models/Job';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      return res.status(200).json({ success: true, job });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch job' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const job = await Job.findByIdAndUpdate(id, req.body, { new: true });
      if (!job) return res.status(404).json({ error: 'Job not found' });
      return res.status(200).json({ success: true, job });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update job' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await Job.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete job' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
