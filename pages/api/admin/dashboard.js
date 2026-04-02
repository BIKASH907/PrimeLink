import connectDB from '../../../lib/db';
import { verifyAdmin } from '../../../lib/adminAuth';
import Contact from '../../../models/Contact';
import Application from '../../../models/Application';
import EmployerInquiry from '../../../models/EmployerInquiry';
import Job from '../../../models/Job';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const admin = verifyAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await connectDB();

    const [contacts, applications, inquiries, jobs] = await Promise.all([
      Contact.countDocuments(),
      Application.countDocuments(),
      EmployerInquiry.countDocuments(),
      Job.countDocuments(),
    ]);

    const [newContacts, newApplications, newInquiries] = await Promise.all([
      Contact.countDocuments({ status: 'new' }),
      Application.countDocuments({ status: 'pending' }),
      EmployerInquiry.countDocuments({ status: 'new' }),
    ]);

    const recentApplications = await Application.find().sort({ createdAt: -1 }).limit(10);
    const recentInquiries = await EmployerInquiry.find().sort({ createdAt: -1 }).limit(10);
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(10);

    return res.status(200).json({
      success: true,
      stats: {
        totalContacts: contacts,
        totalApplications: applications,
        totalInquiries: inquiries,
        activeJobs: jobs,
        newContacts,
        newApplications,
        newInquiries,
      },
      recent: {
        applications: recentApplications,
        inquiries: recentInquiries,
        contacts: recentContacts,
      }
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
