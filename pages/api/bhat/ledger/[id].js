// =====================================================
// /api/bhat/ledger/[id]
//   PATCH  edit entry (or trigger refund)
//   DELETE remove entry permanently (super_admin only)
//
// PATCH body { action: 'refund' } marks entry as refunded AND nullifies it
// (the running advance balance for the client drops by that amount).
// =====================================================
import connectDB from '../../../../lib/db';
import BhatLedger from '../../../../models/BhatLedger';
import { requireApiUser } from '../../../../lib/bhatAuth';

export default async function handler(req, res) {
  if (req.method === 'PATCH')  return patch(req, res);
  if (req.method === 'DELETE') return remove(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

async function patch(req, res) {
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;
  await connectDB();

  const entry = await BhatLedger.findById(req.query.id);
  if (!entry) return res.status(404).json({ error: 'Not found' });

  const { action, amount, description, type } = req.body || {};

  if (action === 'refund') {
    // Mark original as refunded + create paired refund entry that cancels the amount.
    if (entry.status === 'refunded') return res.status(400).json({ error: 'Already refunded' });

    entry.status = 'refunded';
    await entry.save();

    const refund = await BhatLedger.create({
      client:      entry.client,
      type:        'refund',
      amount:      -Math.abs(entry.amount),
      currency:    entry.currency,
      description: `Refund of ${entry.description || entry.type} (entry ${entry._id})`,
      recordedBy:  user.id,
      status:      'active',
      refundedBy:  entry._id,
    });

    return res.status(200).json({ ok: true, refundId: refund._id.toString() });
  }

  // Generic edit
  if (typeof amount !== 'undefined')      entry.amount      = +amount;
  if (typeof description !== 'undefined') entry.description = description;
  if (typeof type !== 'undefined')        entry.type        = type;
  await entry.save();
  return res.status(200).json({ ok: true });
}

async function remove(req, res) {
  const user = requireApiUser(req, res, { minRole: 'super_admin' });
  if (!user) return;
  await connectDB();
  const r = await BhatLedger.findByIdAndDelete(req.query.id);
  if (!r) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json({ ok: true });
}
