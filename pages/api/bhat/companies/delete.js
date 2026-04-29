// =====================================================
// POST /api/bhat/companies/delete   (Super-Admin only)
// PERMANENT delete — only allowed via this strict flow:
//   1. Caller must be Super-Admin
//   2. Body must include `confirmName` matching the company's name exactly
//   3. Company should already be archived (defensive — prevents accidental hard delete)
// All clients linked to the company are unset (NEVER auto-deleted).
// =====================================================
import connectDB from '../../../../lib/db';
import BhatCompany from '../../../../models/BhatCompany';
import BhatClient from '../../../../models/BhatClient';
import BhatTimeline from '../../../../models/BhatTimeline';
import { requireApiUser } from '../../../../lib/bhatAuth';
import { COUNTRIES } from '../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'super_admin' });
  if (!user) return;

  const { country, name, confirmName, reassignTo } = req.body || {};
  if (!COUNTRIES[country]) return res.status(400).json({ error: 'Invalid country' });
  if (!name?.trim())       return res.status(400).json({ error: 'Company name required' });
  if (confirmName !== name) {
    return res.status(400).json({ error: 'confirmName must match the company name exactly' });
  }

  await connectDB();

  const co = await BhatCompany.findOne({ country, name: name.trim() });
  // Defensive: only allow permanent delete if company is already archived
  if (co && !co.archivedAt) {
    return res.status(400).json({
      error: 'Archive the company first before permanent delete.',
    });
  }

  // Reassign or unset clients
  const update = reassignTo?.trim()
    ? { $set: { company: reassignTo.trim() } }
    : { $unset: { company: '' } };

  const before = await BhatClient.find({ country, company: name.trim() }, '_id').lean();
  await BhatClient.updateMany({ country, company: name.trim() }, update);

  await Promise.all(before.map(c => BhatTimeline.create({
    client:    c._id,
    actor:     user.id,
    actorName: user.name,
    eventType: 'company_permanent_deleted',
    description: reassignTo?.trim()
      ? `Company "${name}" PERMANENTLY DELETED — clients reassigned to "${reassignTo}"`
      : `Company "${name}" PERMANENTLY DELETED — clients set to Unassigned`,
  })));

  if (co) await BhatCompany.deleteOne({ _id: co._id });

  return res.status(200).json({
    ok: true,
    affectedCandidates: before.length,
    reassignedTo: reassignTo || null,
  });
}
