// =====================================================
// /api/bhat/clients/[id]
//   GET     read client
//   PATCH   edit client (admin+ for any field; sub-admin: forbidden)
//   DELETE  remove client + cascade related docs/notes/timeline (super_admin only)
// =====================================================
import connectDB from '../../../../../lib/db';
import BhatClient from '../../../../../models/BhatClient';
import BhatDocument from '../../../../../models/BhatDocument';
import BhatNote from '../../../../../models/BhatNote';
import BhatTimeline from '../../../../../models/BhatTimeline';
import BhatCV from '../../../../../models/BhatCV';
import BhatUser from '../../../../../models/BhatUser';
import { requireApiUser } from '../../../../../lib/bhatAuth';
import { STAGE_BY_KEY } from '../../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method === 'GET')    return read(req, res);
  if (req.method === 'PATCH')  return edit(req, res);
  if (req.method === 'PUT')    return edit(req, res);
  if (req.method === 'DELETE') return remove(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

async function read(req, res) {
  const user = requireApiUser(req, res);
  if (!user) return;
  await connectDB();
  const c = await BhatClient.findById(req.query.id).lean();
  if (!c) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json(c);
}

async function edit(req, res) {
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  await connectDB();
  const c = await BhatClient.findById(req.query.id);
  if (!c) return res.status(404).json({ error: 'Not found' });

  const allowed = ['fullName','company','agentName','position','isUrgent','stage'];
  const changes = [];
  for (const k of allowed) {
    if (k in (req.body || {})) {
      const newVal = req.body[k];
      const oldVal = c[k];
      if (newVal !== oldVal) {
        c[k] = newVal;
        if (k === 'stage') {
          const meta = STAGE_BY_KEY[newVal];
          if (meta) {
            c.progress = meta.index + 1;
            c.stageEnteredAt = new Date();
          }
        }
        changes.push(k);
      }
    }
  }
  if (changes.length === 0) return res.status(200).json({ ok:true, unchanged:true });

  await c.save();

  await BhatTimeline.create({
    client: c._id,
    actor: user.id, actorName: user.name,
    eventType: 'edited',
    description: `Updated ${changes.join(', ')}`,
  });

  return res.status(200).json({ ok:true, changes });
}

async function remove(req, res) {
  const user = requireApiUser(req, res, { minRole: 'super_admin' });
  if (!user) return;

  await connectDB();
  const c = await BhatClient.findById(req.query.id);
  if (!c) return res.status(404).json({ error: 'Not found' });

  // Cascade — remove related records
  await Promise.all([
    BhatDocument.deleteMany({ client: c._id }),
    BhatNote.deleteMany({ client: c._id }),
    BhatTimeline.deleteMany({ client: c._id }),
    BhatCV.deleteMany({ client: c._id }),
    BhatUser.updateMany(
      { assignedClients: c._id },
      { $pull: { assignedClients: c._id } }
    ),
  ]);

  await c.deleteOne();
  return res.status(200).json({ ok:true });
}
