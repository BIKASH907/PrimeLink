// =====================================================
// POST /api/bhat/clients/:id/stage
// body: { stage: 'flight_ticket' }
// Jumps the client directly to any pipeline stage (not just the next one).
// =====================================================
import connectDB from '../../../../../lib/db';
import BhatClient from '../../../../../models/BhatClient';
import BhatTimeline from '../../../../../models/BhatTimeline';
import { requireApiUser } from '../../../../../lib/bhatAuth';
import { STAGE_BY_KEY } from '../../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const { stage } = req.body || {};
  const meta = STAGE_BY_KEY[stage];
  if (!meta) return res.status(400).json({ error: 'Invalid stage' });

  await connectDB();
  const client = await BhatClient.findById(req.query.id);
  if (!client) return res.status(404).json({ error: 'Not found' });

  if (client.stage === stage) {
    return res.status(200).json({ ok: true, unchanged: true });
  }

  const oldKey = client.stage;
  client.stage = stage;
  // For terminal stages, keep progress as-is (so we know how far they got).
  // For active stages, sync progress to the new stage index.
  if (!meta.terminal) {
    client.progress = meta.index + 1;
  }
  client.stageEnteredAt = new Date();
  await client.save();

  await BhatTimeline.create({
    client:      client._id,
    actor:       user.id,
    actorName:   user.name,
    eventType:   'stage_changed',
    description: `${STAGE_BY_KEY[oldKey]?.label || oldKey} → ${meta.label}`,
  });

  return res.status(200).json({ ok: true, stage, progress: client.progress });
}
