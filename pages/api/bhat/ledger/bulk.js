// =====================================================
// POST /api/bhat/ledger/bulk
// Body: {
//   ids: [clientId, ...],
//   type:        'visa_fee_in' | 'service_fee' | ... ,
//   amount:      number,                        // amount per candidate
//   currency:    'NPR',
//   description: 'Group VFS fee',
//   paidAt:      'YYYY-MM-DD',
// }
// Creates ONE income ledger entry per selected candidate. Useful for:
//   - Group VFS fee
//   - Group flight ticket
//   - Group medical deposit
// =====================================================
import connectDB from '../../../../lib/db';
import BhatClient from '../../../../models/BhatClient';
import BhatLedger from '../../../../models/BhatLedger';
import BhatTimeline from '../../../../models/BhatTimeline';
import { requireApiUser } from '../../../../lib/bhatAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const { ids = [], type = 'service_fee', amount, currency = 'NPR', description, paidAt } = req.body || {};

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids required (non-empty array)' });
  }
  if (!Number.isFinite(+amount) || +amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  await connectDB();
  const clients = await BhatClient.find({ _id: { $in: ids } });

  const created = [];
  const events  = [];
  const date = paidAt ? new Date(paidAt) : new Date();
  const cur  = (currency || 'NPR').toUpperCase();

  for (const c of clients) {
    const entry = await BhatLedger.create({
      client:      c._id,
      direction:   'in',
      type,
      amount:      Math.round(+amount * 100) / 100,
      currency:    cur,
      description: description || `Group ${type.replace(/_/g, ' ')}`,
      paidAt:      date,
      recordedBy:  user.id,
    });
    created.push(entry._id);
    events.push(BhatTimeline.create({
      client:     c._id,
      actor:      user.id,
      actorName:  user.name,
      eventType:  'group_payment',
      description: `Group payment recorded: ${cur} ${(+amount).toLocaleString()} (${type.replace(/_/g, ' ')})`,
    }));
  }
  await Promise.all(events);

  return res.status(200).json({
    ok: true,
    created: created.length,
    notFound: ids.length - clients.length,
    perCandidateAmount: +amount,
    totalAmount: +amount * created.length,
  });
}
