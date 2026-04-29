import connectDB from '../../../../../lib/db';
import BhatNote from '../../../../../models/BhatNote';
import { requireApiUser } from '../../../../../lib/bhatAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res);
  if (!user) return;

  const { body } = req.body || {};
  if (!body || !body.trim()) return res.status(400).json({ error: 'Note body required' });

  await connectDB();
  const note = await BhatNote.create({
    client: req.query.id,
    author: user.id,
    authorName: user.name,
    body: body.trim(),
  });
  return res.status(200).json({ ok: true, id: note._id });
}
