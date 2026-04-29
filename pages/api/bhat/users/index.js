// =====================================================
// /api/bhat/users
//   GET   list users (admin+)
//   POST  create new user (super_admin only for super_admin role)
// =====================================================
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import BhatUser from '../../../../models/BhatUser';
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
  const all = await BhatUser.find().select('-password').lean();
  return res.status(200).json(all.map(u => ({
    id: u._id.toString(),
    name: u.name, email: u.email, role: u.role, country: u.country,
    isActive: u.isActive,
    lastLoginAt: u.lastLoginAt,
  })));
}

async function create(req, res) {
  const actor = requireApiUser(req, res, { minRole: 'admin' });
  if (!actor) return;

  const { name, email, password, role = 'sub_admin', country } = req.body || {};
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  if (!['super_admin','admin','sub_admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (role === 'super_admin' && actor.role !== 'super_admin') {
    return res.status(403).json({ error: 'Only Super-Admin can create Super-Admin users' });
  }
  if (country && !['RO','TR'].includes(country)) {
    return res.status(400).json({ error: 'Invalid country' });
  }

  await connectDB();
  const exists = await BhatUser.findOne({ email: email.trim().toLowerCase() });
  if (exists) return res.status(400).json({ error: 'Email already in use' });

  const user = await BhatUser.create({
    name:     name.trim(),
    email:    email.trim().toLowerCase(),
    password: await bcrypt.hash(password, 10),
    role,
    country:  country || null,
  });

  return res.status(200).json({ ok: true, id: user._id.toString() });
}
