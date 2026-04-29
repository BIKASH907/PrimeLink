// =====================================================
// BHAT OVERSEAS — Expiry rules
// Two checks:
//   1. Passport: warn if expiry is within the next 6 months
//   2. Police Report (PCC): warn if it will be > 30 days old at VFS
//      (we treat any client at or before vfs_appointment stage as 'before VFS')
// =====================================================

import { STAGE_BY_KEY } from './bhatConstants';

const SIX_MONTHS_MS = 6 * 30 * 86400000;
const THIRTY_DAYS   = 30;

/**
 * @param {Object} doc  BhatDocument lean object
 * @returns {{ severity: 'ok'|'warn'|'danger', message: string }|null}
 */
export function passportAlert(doc) {
  if (!doc?.expiryDate) return null;
  const expiry = new Date(doc.expiryDate);
  const now    = new Date();
  if (expiry < now) {
    return { severity: 'danger', message: `Passport EXPIRED on ${expiry.toISOString().slice(0,10)}` };
  }
  if (expiry.getTime() - now.getTime() < SIX_MONTHS_MS) {
    const days = Math.floor((expiry - now) / 86400000);
    return { severity: 'warn', message: `Passport expires in ${days} days (${expiry.toISOString().slice(0,10)}) — under 6 months` };
  }
  return null;
}

/**
 * @param {Object} doc     BhatDocument (police_report)
 * @param {Object} client  BhatClient — to check current stage
 */
export function pccAlert(doc, client) {
  if (!doc?.issueDate) return null;
  const stage = STAGE_BY_KEY[client?.stage];
  const vfsIdx = STAGE_BY_KEY['vfs_appointment'].index;
  // Only relevant when client is at/before VFS
  if (!stage || stage.index > vfsIdx) return null;

  const issueDate = new Date(doc.issueDate);
  const ageDays   = Math.floor((Date.now() - issueDate.getTime()) / 86400000);

  if (ageDays > THIRTY_DAYS) {
    return {
      severity: 'danger',
      message: `PCC expired (${ageDays} days old). Reapply required before VFS.`,
    };
  }
  if (ageDays > 23) {                          // 7-day pre-warn
    return {
      severity: 'warn',
      message: `PCC is ${ageDays} days old — only ${30 - ageDays} day(s) left before invalid at VFS.`,
    };
  }
  return null;
}

/**
 * Run all expiry rules over a client's documents and return the worst-severity alert
 * for each rule that applies. Used to render warning banners on client detail pages.
 */
export function alertsForClient(client, documents) {
  const alerts = [];
  for (const d of documents) {
    if (d.docType === 'passport') {
      const a = passportAlert(d);
      if (a) alerts.push({ ...a, kind: 'passport_expiry', docId: d._id || d.id });
    }
    if (d.docType === 'police_report') {
      const a = pccAlert(d, client);
      if (a) alerts.push({ ...a, kind: 'pcc_30d', docId: d._id || d.id });
    }
  }
  return alerts;
}
