// =====================================================
// /api/bhat/cron/cleanup
// Runs daily via Vercel Cron Jobs (configured in vercel.json).
//
// Behaviour:
//   - SOFT-deletes (archives) BhatDocuments for clients that are inactive
//     and not yet archived. Files in Cloudinary are NOT removed — only the
//     DB record is marked archivedAt=<now>.
//   - "Inactive client" = client.updatedAt older than retention window AND
//     NOT in an active pipeline stage (we treat all 14 stages as active by
//     default, but you can carve out terminal stages here).
//   - Hard-delete is OFF by default. Set BHAT_CLEANUP_HARD_DELETE=1 to
//     additionally remove Cloudinary assets after archival.
//
// Retention window:
//   BHAT_RETENTION_DAYS env var (default 15)
//
// Auth:
//   - Vercel cron sends Authorization: Bearer ${CRON_SECRET}
//   - Manual trigger: ?key=<CRON_SECRET>
// =====================================================
import connectDB from '../../../../lib/db';
import BhatDocument from '../../../../models/BhatDocument';
import BhatClient from '../../../../models/BhatClient';
import BhatTimeline from '../../../../models/BhatTimeline';
import BhatNote from '../../../../models/BhatNote';
import { deleteAsset } from '../../../../lib/bhatCloudinary';

// Stages we consider "still active" — we won't archive docs for clients here
// even if their record is older than the retention window. Customise as needed.
const ACTIVE_STAGES = new Set([
  'doc_collection','advance_paid','pcc_apply','vfs_appointment','reference_agent_info',
  'amount_paid','entry_approval','kimlik_fee_paid','client_money_paid','second_vfs',
  'passport_collection','sharam','flight_ticket','flight_status',
]);

function isAuthorised(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = req.headers.authorization || '';
  if (header === `Bearer ${secret}`) return true;
  if ((req.query?.key || '') === secret) return true;
  return false;
}

export default async function handler(req, res) {
  if (!isAuthorised(req)) return res.status(401).json({ error: 'Unauthorized' });

  const retentionDays = Math.max(1, parseInt(process.env.BHAT_RETENTION_DAYS || '15', 10));
  const hardDelete    = process.env.BHAT_CLEANUP_HARD_DELETE === '1';

  await connectDB();
  const cutoff = new Date(Date.now() - retentionDays * 86400000);

  // Find non-archived documents older than retention threshold
  const oldDocs = await BhatDocument.find({
    createdAt:  { $lt: cutoff },
    archivedAt: null,
  }).lean();

  let archived = 0, hardDeleted = 0, skipped = 0, errors = 0;

  for (const d of oldDocs) {
    const client = await BhatClient.findById(d.client).lean();
    if (!client) {
      // Client already gone — archive the orphan doc to be safe
      await BhatDocument.updateOne(
        { _id: d._id },
        { $set: { archivedAt: new Date(), archivedReason: 'orphan' } }
      );
      archived++;
      continue;
    }

    // Skip if client is still active (any pipeline stage)
    // OR has been touched recently (notes, timeline, edits)
    if (ACTIVE_STAGES.has(client.stage)) { skipped++; continue; }

    if (new Date(client.updatedAt || 0) >= cutoff) { skipped++; continue; }

    const recentEvent = await BhatTimeline.exists({
      client: d.client, createdAt: { $gte: cutoff },
    });
    const recentNote = await BhatNote.exists({
      client: d.client, createdAt: { $gte: cutoff },
    });
    if (recentEvent || recentNote) { skipped++; continue; }

    // SOFT-delete (archive)
    await BhatDocument.updateOne(
      { _id: d._id },
      { $set: { archivedAt: new Date(), archivedReason: 'auto_cleanup' } }
    );
    archived++;

    // Optional: hard-delete the Cloudinary asset too (configurable)
    if (hardDelete) {
      try {
        await deleteAsset(d.filePublicId);
        hardDeleted++;
      } catch (e) {
        errors++;
      }
    }
  }

  return res.status(200).json({
    ok: true,
    cutoff: cutoff.toISOString(),
    retentionDays,
    examined: oldDocs.length,
    archived,
    hardDeleted,
    skipped,
    errors,
  });
}
