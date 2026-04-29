// =====================================================
// /api/bhat/ledger
//   GET  list entries (filter by clientId, country, or direction)
//   POST create new entry (income OR expense)
// =====================================================
import connectDB from '../../../../lib/db';
import BhatLedger from '../../../../models/BhatLedger';
import BhatClient from '../../../../models/BhatClient';
import { requireApiUser } from '../../../../lib/bhatAuth';

export default async function handler(req, res) {
  if (req.method === 'GET')  return list(req, res);
  if (req.method === 'POST') return create(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

async function list(req, res) {
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;
  await connectDB();

  const filter = {};
  if (req.query.clientId)  filter.client    = req.query.clientId;
  if (req.query.direction) filter.direction = req.query.direction;     // 'in' | 'out'

  let entries = await BhatLedger.find(filter)
    .sort({ paidAt: -1 })
    .populate('client', 'fullName refNo country company')
    .lean();

  // Optional country filter via populated client
  if (req.query.country) {
    entries = entries.filter(e => e.client?.country === req.query.country || !e.client);
  }

  return res.status(200).json(entries.map(e => ({
    id:                 e._id.toString(),
    direction:          e.direction || 'in',
    client:             e.client ? {
      id:       e.client._id.toString(),
      name:     e.client.fullName,
      refNo:    e.client.refNo,
      country:  e.client.country,
      company:  e.client.company || null,
    } : null,
    type:               e.type,
    amount:             e.amount,
    currency:           e.currency,
    description:        e.description,
    paidAt:             e.paidAt,
    status:             e.status,
    bankAccountHolder:  e.bankAccountHolder || null,
    bankName:           e.bankName || null,
    bankAccountNumber:  e.bankAccountNumber || null,
    vendor:             e.vendor || null,
    refundedBy:         e.refundedBy?.toString() || null,
  })));
}

async function create(req, res) {
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const {
    clientId, direction = 'in', type, amount, currency = 'NPR',
    description, paidAt,
    bankAccountHolder, bankName, bankAccountNumber, vendor,
  } = req.body || {};

  if (!Number.isFinite(+amount) || +amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number' });
  }
  if (!['in', 'out'].includes(direction)) {
    return res.status(400).json({ error: "direction must be 'in' or 'out'" });
  }

  // Income entries should be tied to a client; expenses can be standalone
  if (direction === 'in' && !clientId) {
    return res.status(400).json({ error: 'Client required for income entries' });
  }
  // Expenses should at least have a vendor or bank holder name for traceability
  if (direction === 'out' && !bankAccountHolder?.trim() && !vendor?.trim()) {
    return res.status(400).json({ error: 'Provide either Bank Account Holder or Vendor name' });
  }

  await connectDB();

  let client = null;
  if (clientId) {
    client = await BhatClient.findById(clientId);
    if (!client) return res.status(404).json({ error: 'Client not found' });
  }

  // Default type if missing
  const fallbackType = direction === 'in' ? 'advance' : 'other_out';
  const finalType    = type || fallbackType;

  const entry = await BhatLedger.create({
    client:    client?._id || null,
    direction,
    type:      finalType,
    amount:    Math.round(+amount * 100) / 100,
    currency:  (currency || 'NPR').toUpperCase(),
    description: description?.trim() || null,
    paidAt:    paidAt ? new Date(paidAt) : new Date(),

    bankAccountHolder: bankAccountHolder?.trim() || null,
    bankName:          bankName?.trim() || null,
    bankAccountNumber: bankAccountNumber?.trim() || null,
    vendor:            vendor?.trim() || null,

    recordedBy: user.id,
  });

  return res.status(200).json({ ok: true, id: entry._id.toString() });
}
