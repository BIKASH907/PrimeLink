// =====================================================
// POST /api/bhat/companies/rename
// Body: { country, oldName, newName }
// Renames a company everywhere:
//   - Updates BhatCompany row (if it exists)
//   - Cascades update to all BhatClient rows where company === oldName
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

  const { country, oldName, newName } = req.body || {};
  if (!COUNTRIES[country])  return res.status(400).json({ error: 'Invalid country' });
  if (!oldName?.trim())     return res.status(400).json({ error: 'oldName required' });
  if (!newName?.trim())     return res.status(400).json({ error: 'newName required' });
  if (oldName.trim() === newName.trim()) {
    return res.status(200).json({ ok: true, unchanged: true });
  }

  await connectDB();

  // Update or create the BhatCompany row with the new name
  const existing = await BhatCompany.findOne({ country, name: oldName.trim() });
  if (existing) {
    existing.name = newName.trim();
    await existing.save();
  } else {
    // Make sure the new-name record exists so it shows on the list
    await BhatCompany.findOneAndUpdate(
      { country, name: newName.trim() },
      { $setOnInsert: { country, name: newName.trim() } },
      { upsert: true, new: true }
    );
  }

  // Cascade: update all clients
  const result = await BhatClient.updateMany(
    { country, company: oldName.trim() },
    { $set: { company: newName.trim() } }
  );

  // Audit on each affected client's timeline
  const clientIds = (await BhatClient.find({ country, company: newName.trim() }, '_id').lean())
    .map(c => c._id);
  await Promise.all(clientIds.map(id => BhatTimeline.create({
    client: id,
    actor: user.id, actorName: user.name,
    eventType: 'company_renamed',
    description: `Company renamed: "${oldName}" → "${newName}"`,
  })));

  return res.status(200).json({
    ok: true,
    clientsUpdated: result.modifiedCount,
    oldName, newName,
  });
}
