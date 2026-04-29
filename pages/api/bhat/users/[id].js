// =====================================================
// /api/bhat/users/[id]
//   PATCH  edit user (Super Admin / Admin) or reset password
//          body: { name?, email?, role?, country?, resetPassword?: 'newPwd' }
//   DELETE remove user (Super Admin only)
// =====================================================
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import BhatUser from '../../../../models/BhatUser';
import { requireApiUser } from '../../../../lib/bhatAuth';

export default async function handler(req, res) {
  if (req.method === 'PATCH')  return patch(req, res);
  if (req.method === 'DELETE') return remove(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

async function patch(req, res) {
  const actor = requireApiUser(req, res, { minRole: 'admin' });
  if (!actor) return;
  await connectDB();

  const target = await BhatUser.findById(req.query.id);
  if (!target) return res.status(404).json({ error: 'User not found' });

  // Admin (non-super) can't modify Super Admins
  if (actor.role === 'admin' && target.role === 'super_admin') {
    return res.status(403).json({ error: 'Only Super-Admin can modify Super-Admin accounts' });
  }

  const { name, email, role, country, resetPassword } = req.body || {};
  const changes = [];

  if (typeof name === 'string' && name.trim() && name.trim() !== target.name) {
    target.name = name.trim();
    changes.push('name');
  }

  if (typeof email === 'string' && email.trim().toLowerCase() !== target.email) {
    const newEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const exists = await BhatUser.findOne({ email: newEmail, _id: { $ne: target._id } });
    if (exists) return res.status(400).json({ error: 'Email already in use' });
    target.email = newEmail;
    changes.push('email');
  }

  // Only Super Admin can change roles or country scope
  if (role && role !== target.role) {
    if (actor.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only Super-Admin can change roles' });
    }
    if (!['super_admin','admin','sub_admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    target.role = role;
    changes.push('role');
  }
  if (country !== undefined && country !== target.country) {
    if (actor.role !== 'super_admin') {
      return res.status(403).json({ error: 'Only Super-Admin can change country scope' });
    }
    target.country = country || null;
    changes.push('country');
  }

  // Reset password (admin can reset other users' passwords)
  if (resetPassword) {
    if (resetPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }
    target.password = await bcrypt.hash(resetPassword, 10);
    changes.push('password');
  }

  if (changes.length === 0) return res.status(200).json({ ok: true, unchanged: true });

  await target.save();
  return res.status(200).json({ ok: true, changes });
}

async function remove(req, res) {
  const actor = requireApiUser(req, res, { minRole: 'super_admin' });
  if (!actor) return;
  await connectDB();

  if (req.query.id === actor.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }
  const target = await BhatUser.findByIdAndDelete(req.query.id);
  if (!target) return res.status(404).json({ error: 'User not found' });
  return res.status(200).json({ ok: true });
}
