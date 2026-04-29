// =====================================================
// POST /api/bhat/companies/delete
// Body: {
//   country,
//   name,
//   reassignTo?: string  // optional — move clients to this company
// }
// Removes the company. Behavior:
//   - If reassignTo is provided → all clients move to that company
//   - Otherwise → clients keep their data but company field is set to null (Unassigned)
// Clients are NEVER auto-deleted — only company-folder is removed.
// =====================================================
import connectDB from '../../../../lib/db';
import BhatCompany from '../../../../models/BhatCompany';
import BhatClient from '../../../../models/BhatClient';
import BhatTimeline from '../../../../models/BhatTimeline';
import { requireApiUser } from '../../../../lib/bhatAuth';
import { COUNTRIES } from '../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const { country, name, reassignTo } = req.body || {};
  if (!COUNTRIES[country])  return res.status(400).json({ error: 'Invalid country' });
  if (!name?.trim())        return res.status(400).json({ error: 'Company name required' });

  await connectDB();

  // Reassign or unset clients
  const update = reassignTo?.trim()
    ? { $set: { company: reassignTo.trim() } }
    : { $unset: { company: '' } };

  const before = await BhatClient.find({ country, company: name.trim() }, '_id').lean();
  await BhatClient.updateMany({ country, company: name.trim() }, update);

  // Audit on each affected client
  await Promise.all(before.map(c => BhatTimeline.create({
    client: c._id,
    actor: user.id, actorName: user.name,
    eventType: 'company_removed',
    description: reassignTo?.trim()
      ? `Company "${name}" deleted — reassigned to "${reassignTo}"`
      : `Company "${name}" deleted — set to Unassigned`,
  })));

  // If a registered BhatCompany row exists for the OLD name, remove it
  await BhatCompany.deleteOne({ country, name: name.trim() });

  return res.status(200).json({
    ok: true,
    clientsAffected: before.length,
    reassignedTo: reassignTo || null,
  });
}
