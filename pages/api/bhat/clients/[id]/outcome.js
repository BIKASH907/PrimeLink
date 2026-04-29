// =====================================================
// POST /api/bhat/clients/:id/outcome
// body: { outcome: 'rejected' | 'refunded', reason?: string }
// Marks a client as rejected or refunded — moves them to the terminal stage
// and logs the reason on the timeline.
//
// IMPORTANT (per spec): If outcome === 'refunded', AUTO-CREATE refund entries
// for every active 'in' payment (advance, service fee, etc.) so the client's
// balance zeroes out. We DO NOT delete original entries — they stay as
// historical records with status='refunded'.
// =====================================================
import connectDB from '../../../../../lib/db';
import BhatClient from '../../../../../models/BhatClient';
import BhatTimeline from '../../../../../models/BhatTimeline';
import BhatLedger from '../../../../../models/BhatLedger';
import { requireApiUser } from '../../../../../lib/bhatAuth';
import { TERMINAL_STAGE_KEYS, STAGE_BY_KEY } from '../../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const { outcome, reason } = req.body || {};
  if (!TERMINAL_STAGE_KEYS.has(outcome)) {
    return res.status(400).json({ error: 'outcome must be "rejected" or "refunded"' });
  }

  await connectDB();
  const client = await BhatClient.findById(req.query.id);
  if (!client) return res.status(404).json({ error: 'Not found' });

  const oldStage = client.stage;
  client.stage          = outcome;
  client.stageEnteredAt = new Date();
  // progress stays as the last active progress so the client's history is preserved
  await client.save();

  await BhatTimeline.create({
    client:      client._id,
    actor:       user.id,
    actorName:   user.name,
    eventType:   `marked_${outcome}`,
    description: `Marked as ${outcome.toUpperCase()}${reason ? ` — Reason: ${reason}` : ''} (was at ${STAGE_BY_KEY[oldStage]?.label || oldStage})`,
  });

  // ---- AUTO-REFUND on outcome=refunded ----
  let refundCount = 0;
  let refundedTotal = 0;
  if (outcome === 'refunded') {
    const activePayments = await BhatLedger.find({
      client: client._id,
      direction: 'in',
      status: 'active',
      type: { $ne: 'refund' },
    });
    for (const p of activePayments) {
      // Mark original as refunded
      p.status = 'refunded';
      await p.save();
      // Create paired refund entry that nets out the amount
      const refund = await BhatLedger.create({
        client:      client._id,
        direction:   'in',
        type:        'refund',
        amount:      -Math.abs(p.amount),
        currency:    p.currency,
        description: `Auto-refund (client marked refunded${reason ? `: ${reason}` : ''})`,
        recordedBy:  user.id,
        status:      'active',
        refundedBy:  p._id,
      });
      refundCount += 1;
      refundedTotal += Math.abs(p.amount);
    }
    if (refundCount > 0) {
      await BhatTimeline.create({
        client:    client._id,
        isSystem:  true,
        eventType: 'auto_refund',
        description: `Auto-refunded ${refundCount} payment(s) totaling ${refundedTotal.toLocaleString()} ${activePayments[0]?.currency || ''}`,
      });
    }
  }

  return res.status(200).json({
    ok: true,
    outcome,
    autoRefund: outcome === 'refunded' ? { count: refundCount, total: refundedTotal } : null,
  });
}
