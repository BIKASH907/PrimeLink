// =====================================================
// /api/bhat/clients
//   POST   create a new client (admin / super_admin)
//   GET    list clients (filtered by current country)
// =====================================================
import connectDB from '../../../../lib/db';
import BhatClient from '../../../../models/BhatClient';
import BhatTimeline from '../../../../models/BhatTimeline';
import { requireApiUser } from '../../../../lib/bhatAuth';
import { STAGE_BY_KEY, COUNTRIES } from '../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method === 'POST') return create(req, res);
  if (req.method === 'GET')  return list(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

async function create(req, res) {
  const user = requireApiUser(req, res, { minRole: 'admin' });
  if (!user) return;

  const {
    fullName, country, company, agentName, position, stage, isUrgent,
  } = req.body || {};

  if (!fullName?.trim()) return res.status(400).json({ error: 'Full name required' });
  if (!COUNTRIES[country]) return res.status(400).json({ error: 'Invalid country' });
  const stageMeta = STAGE_BY_KEY[stage] || STAGE_BY_KEY.doc_collection;

  await connectDB();

  // Auto-generate next ref number (BHAT-REF-001, 002, ...)
  const last = await BhatClient.findOne().sort({ createdAt: -1 }).lean();
  const lastNum = last?.refNo?.match(/(\d+)$/)?.[1] || '0';
  const next = String(parseInt(lastNum, 10) + 1).padStart(3, '0');
  const refNo = `BHAT-REF-${next}`;

  const client = await BhatClient.create({
    refNo,
    fullName: fullName.trim(),
    country,
    company: company?.trim() || null,
    agentName: agentName?.trim() || null,
    position: position?.trim() || null,
    stage: stageMeta.key,
    progress: stageMeta.index + 1,
    isUrgent: !!isUrgent,
    stageEnteredAt: new Date(),
  });

  await BhatTimeline.create({
    client: client._id,
    actor: user.id,
    actorName: user.name,
    eventType: 'created',
    description: `Client ${client.fullName} created by ${user.name}`,
  });

  return res.status(200).json({ id: client._id.toString(), refNo: client.refNo });
}

async function list(req, res) {
  const user = requireApiUser(req, res);
  if (!user) return;

  await connectDB();
  const filter = {};
  const country = (req.query.country || user.currentCountry || '').toString();
  if (country && COUNTRIES[country]) filter.country = country;

  const clients = await BhatClient.find(filter).sort({ updatedAt: -1 }).limit(200).lean();
  return res.status(200).json(clients.map(c => ({
    id: c._id.toString(),
    refNo: c.refNo,
    fullName: c.fullName,
    country: c.country,
    stage: c.stage,
    progress: c.progress,
    isUrgent: c.isUrgent,
    company: c.company,
    agentName: c.agentName,
  })));
}
