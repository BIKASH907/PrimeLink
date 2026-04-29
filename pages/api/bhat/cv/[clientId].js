import connectDB from '../../../../lib/db';
import BhatCV from '../../../../models/BhatCV';
import BhatClient from '../../../../models/BhatClient';
import BhatUser from '../../../../models/BhatUser';
import { requireApiUser } from '../../../../lib/bhatAuth';

export default async function handler(req, res) {
  const user = requireApiUser(req, res);
  if (!user) return;

  await connectDB();
  const { clientId } = req.query;

  // Sub-admin: check assignment
  if (user.role === 'sub_admin') {
    const me = await BhatUser.findById(user.id).lean();
    const assignedIds = (me?.assignedClients || []).map(x => x.toString());
    if (!assignedIds.includes(clientId)) {
      return res.status(403).json({ error: 'Not assigned to this client' });
    }
  }

  if (req.method === 'GET') {
    const cv = await BhatCV.findOne({ client: clientId }).lean();
    return res.status(200).json(cv || {});
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    const c = await BhatClient.findById(clientId);
    if (!c) return res.status(404).json({ error: 'Client not found' });

    const data = req.body || {};
    if (data.maritalStatus === 'married' && !data.spouseName?.trim()) {
      return res.status(400).json({ error: 'Spouse name required when married' });
    }

    const update = {
      maritalStatus:    data.maritalStatus || 'single',
      spouseName:       data.spouseName || null,
      religion:         data.religion || null,
      permanentAddress: data.permanentAddress || null,
      positionApplied:  data.positionApplied || null,
      yearsExperience:  data.yearsExperience ? Number(data.yearsExperience) : null,
      languages:        data.languages || null,
      autoFullName:     data.autoFullName || null,
      autoPassportNo:   data.autoPassportNo || null,
      autoDob:          data.autoDob ? new Date(data.autoDob) : null,
      autoGender:       data.autoGender || null,
      autoFatherName:   data.autoFatherName || null,
      autoMotherName:   data.autoMotherName || null,
      autoNationality:  data.autoNationality || null,
    };

    const cv = await BhatCV.findOneAndUpdate(
      { client: clientId },
      { $set: update, $setOnInsert: { client: clientId } },
      { upsert: true, new: true }
    );

    return res.status(200).json({ ok: true, cv });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
