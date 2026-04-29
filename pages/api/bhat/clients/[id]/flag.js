import connectDB from '../../../../../lib/db';
import BhatClient from '../../../../../models/BhatClient';
import { requireApiUser } from '../../../../../lib/bhatAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  await connectDB();
  const c = await BhatClient.findById(req.query.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  c.isUrgent = !c.isUrgent;
  await c.save();
  return res.status(200).json({ ok: true, isUrgent: c.isUrgent });
}
