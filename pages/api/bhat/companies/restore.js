// =====================================================
// POST /api/bhat/companies/restore
// Body: { country, name }
// Un-archives a previously archived company.
// =====================================================
import connectDB from '../../../../lib/db';
import BhatCompany from '../../../../models/BhatCompany';
import BhatTimeline from '../../../../models/BhatTimeline';
import BhatClient from '../../../../models/BhatClient';
import { requireApiUser } from '../../../../lib/bhatAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const { country, name } = req.body || {};
  if (!country || !name) return res.status(400).json({ error: 'country and name required' });

  await connectDB();

  const co = await BhatCompany.findOneAndUpdate(
    { country, name },
    { $set: { archivedAt: null, archivedReason: null, archivedBy: null } },
    { new: true }
  );
  if (!co) return res.status(404).json({ error: 'Company not found' });

  // Audit each candidate's timeline
  const clients = await BhatClient.find({ country, company: name }, '_id').lean();
  await Promise.all(clients.map(c => BhatTimeline.create({
    client:    c._id,
    actor:     user.id,
    actorName: user.name,
    eventType: 'company_restored',
    description: `Company "${name}" restored from archive`,
  })));

  return res.status(200).json({ ok: true });
}
