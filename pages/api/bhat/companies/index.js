// =====================================================
// /api/bhat/companies
//   GET  list companies (BhatCompany rows + companies derived from clients)
//   POST create a new company { name, country, contact?, email?, phone?, address?, notes? }
// =====================================================
import connectDB from '../../../../lib/db';
import BhatCompany from '../../../../models/BhatCompany';
import BhatClient from '../../../../models/BhatClient';
import { requireApiUser } from '../../../../lib/bhatAuth';
import { COUNTRIES } from '../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method === 'GET')  return list(req, res);
  if (req.method === 'POST') return create(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

async function list(req, res) {
  const user = requireApiUser(req, res);
  if (!user) return;
  await connectDB();

  const country = req.query.country || user.currentCountry;
  const filter  = country ? { country } : {};

  // Companies stored as records
  const records = await BhatCompany.find(filter).lean();

  // Companies derived from clients (legacy / quick-added)
  const clients = await BhatClient.find(filter).select('company country').lean();
  const derived = {};
  for (const c of clients) {
    if (!c.company) continue;
    const key = `${c.country}::${c.company}`;
    derived[key] = { name: c.company, country: c.country };
  }

  // Merge: known company records win; derived ones added if missing
  const map = {};
  for (const r of records) {
    map[`${r.country}::${r.name}`] = {
      id: r._id.toString(),
      name: r.name, country: r.country,
      contact: r.contact, email: r.email, phone: r.phone,
      address: r.address, notes: r.notes,
      registered: true,
    };
  }
  for (const k in derived) {
    if (!map[k]) {
      map[k] = { id: null, ...derived[k], registered: false };
    }
  }

  return res.status(200).json(Object.values(map).sort((a, b) => a.name.localeCompare(b.name)));
}

async function create(req, res) {
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const { name, country, contact, email, phone, address, notes } = req.body || {};
  if (!name?.trim())            return res.status(400).json({ error: 'Company name required' });
  if (!COUNTRIES[country])      return res.status(400).json({ error: 'Invalid country' });

  await connectDB();

  // Idempotent: if a company with the same name+country already exists, return it
  const existing = await BhatCompany.findOne({ name: name.trim(), country });
  if (existing) {
    return res.status(200).json({ ok: true, id: existing._id.toString(), unchanged: true });
  }

  const co = await BhatCompany.create({
    name: name.trim(), country,
    contact: contact?.trim() || null,
    email:   email?.trim() || null,
    phone:   phone?.trim() || null,
    address: address?.trim() || null,
    notes:   notes?.trim() || null,
  });

  return res.status(200).json({ ok: true, id: co._id.toString() });
}
