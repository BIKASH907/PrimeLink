import connectDB from '../../../../../lib/db';
import BhatClient from '../../../../../models/BhatClient';
import BhatTimeline from '../../../../../models/BhatTimeline';
import { requireApiUser } from '../../../../../lib/bhatAuth';
import { PIPELINE_STAGES, STAGE_BY_KEY } from '../../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  await connectDB();
  const c = await BhatClient.findById(req.query.id);
  if (!c) return res.status(404).json({ error: 'Not found' });

  const idx = STAGE_BY_KEY[c.stage]?.index ?? 0;
  if (idx >= PIPELINE_STAGES.length - 1) {
    return res.status(400).json({ error: 'Already at final stage' });
  }

  const oldKey = c.stage;
  c.stage          = PIPELINE_STAGES[idx + 1].key;
  c.progress       = idx + 2;
  c.stageEnteredAt = new Date();
  await c.save();

  await BhatTimeline.create({
    client: c._id, actor: user.id, actorName: user.name,
    eventType: 'stage_advanced',
    description: `${STAGE_BY_KEY[oldKey].label} → ${PIPELINE_STAGES[idx + 1].label}`,
  });

  return res.status(200).json({ ok: true, stage: c.stage, progress: c.progress });
}
