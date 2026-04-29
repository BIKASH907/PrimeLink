// =====================================================
// POST /api/bhat/clients/bulk-stage
// Body: { ids: [clientId, ...], stage: 'flight_ticket' }
// Moves multiple clients to a target pipeline stage at once.
// =====================================================
import connectDB from '../../../../lib/db';
import BhatClient from '../../../../models/BhatClient';
import BhatTimeline from '../../../../models/BhatTimeline';
import { requireApiUser } from '../../../../lib/bhatAuth';
import { STAGE_BY_KEY } from '../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const { ids = [], stage } = req.body || {};
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids required (non-empty array)' });
  }
  const meta = STAGE_BY_KEY[stage];
  if (!meta) return res.status(400).json({ error: 'Invalid stage' });

  await connectDB();

  const clients = await BhatClient.find({ _id: { $in: ids } });
  const updates = [];
  const events  = [];

  for (const c of clients) {
    if (c.stage === stage) continue;
    const oldKey = c.stage;
    c.stage = meta.key;
    c.progress = meta.index + 1;
    c.stageEnteredAt = new Date();
    updates.push(c.save());
    events.push(BhatTimeline.create({
      client: c._id, actor: user.id, actorName: user.name,
      eventType: 'stage_advanced_bulk',
      description: `Bulk update: ${STAGE_BY_KEY[oldKey].label} → ${meta.label}`,
    }));
  }

  await Promise.all([...updates, ...events]);

  return res.status(200).json({
    ok: true,
    updated: updates.length,
    skipped: clients.length - updates.length,
    notFound: ids.length - clients.length,
  });
}
