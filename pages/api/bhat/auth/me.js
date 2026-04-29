// =====================================================
// /api/bhat/auth/me
//   GET    return current user (without password)
//   PATCH  update current user — name, email, OR password
//          body: { name?, email?, currentPassword?, newPassword? }
// =====================================================
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import BhatUser from '../../../../models/BhatUser';
import { requireApiUser, signBhatToken, setBhatCookies } from '../../../../lib/bhatAuth';

export default async function handler(req, res) {
  const sessionUser = requireApiUser(req, res);
  if (!sessionUser) return;

  await connectDB();
  const user = await BhatUser.findById(sessionUser.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (req.method === 'GET') {
    return res.status(200).json({
      id:    user._id.toString(),
      name:  user.name,
      email: user.email,
      role:  user.role,
      country: user.country || null,
    });
  }

  if (req.method === 'PATCH') {
    const { name, email, currentPassword, newPassword } = req.body || {};
    const changes = [];

    // ---- Update name ----
    if (typeof name === 'string' && name.trim() && name.trim() !== user.name) {
      user.name = name.trim();
      changes.push('name');
    }

    // ---- Update email (must be unique) ----
    if (typeof email === 'string' && email.trim().toLowerCase() !== user.email) {
      const newEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      const exists = await BhatUser.findOne({ email: newEmail, _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ error: 'Email already in use' });
      user.email = newEmail;
      changes.push('email');
    }

    // ---- Update password ----
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required to change password' });
      }
      const ok = await bcrypt.compare(currentPassword, user.password);
      if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });
      user.password = await bcrypt.hash(newPassword, 10);
      changes.push('password');
    }

    if (changes.length === 0) {
      return res.status(200).json({ ok: true, unchanged: true });
    }

    await user.save();

    // If email or name changed, refresh the JWT cookie so the topbar updates
    if (changes.includes('email') || changes.includes('name')) {
      const token = signBhatToken({ ...user.toObject(), country: sessionUser.currentCountry });
      setBhatCookies(res, token, sessionUser.currentCountry);
    }

    return res.status(200).json({ ok: true, changed: changes });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
