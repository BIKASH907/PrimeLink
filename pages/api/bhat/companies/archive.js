// =====================================================
// POST /api/bhat/companies/archive
// Body: { country, name, reason? }
// Soft-deletes a company:
//   - Marks BhatCompany.archivedAt = now
//   - Candidates KEEP their company link (reversible)
//   - Filtered out of the default Documents view but visible under "Archived"
// =====================================================
import connectDB from '../../../../lib/db';
import BhatCompany from '../../../../models/BhatCompany';
import BhatTimeline from '../../../../models/BhatTimeline';
import BhatClient from '../../../../models/BhatClient';
import { requireApiUser } from '../../../../lib/bhatAuth';
import { COUNTRIES } from '../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const { country, name, reason } = req.body || {};
  if (!COUNTRIES[country]) return res.status(400).json({ error: 'Invalid country' });
  if (!name?.trim())       return res.status(400).json({ error: 'Company name required' });

  await connectDB();

  // Upsert + archive in one go (creates the row if it didn't exist as a record yet)
  const co = await BhatCompany.findOneAndUpdate(
    { country, name: name.trim() },
    {
      $set: {
        archivedAt:     new Date(),
        archivedReason: reason || null,
        archivedBy:     user.id,
      },
      $setOnInsert: { country, name: name.trim() },
    },
    { upsert: true, new: true }
  );

  // Audit each candidate's timeline
  const clients = await BhatClient.find({ country, company: name.trim() }, '_id').lean();
  await Promise.all(clients.map(c => BhatTimeline.create({
    client:    c._id,
    actor:     user.id,
    actorName: user.name,
    eventType: 'company_archived',
    description: `Company "${name}" archived${reason ? ` — Reason: ${reason}` : ''}`,
  })));

  return res.status(200).json({
    ok: true,
    archivedAt: co.archivedAt,
    affectedCandidates: clients.length,
  });
}
