// =====================================================
// POST /api/bhat/auth/login
// =====================================================
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/db';
import BhatUser from '../../../../models/BhatUser';
import { signBhatToken, setBhatCookies } from '../../../../lib/bhatAuth';
import { seedBhatIfEmpty } from '../../../../lib/bhatSeed';
import { COUNTRIES } from '../../../../lib/bhatConstants';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await connectDB();
    await seedBhatIfEmpty();

    const { email, password, country } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (!COUNTRIES[country])  return res.status(400).json({ error: 'Invalid country' });

    const user = await BhatUser.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // Country authorization: super-admin without country sees both;
    // others must match the chosen country.
    if (user.role !== 'super_admin' || user.country) {
      if (user.country && user.country !== country) {
        return res.status(403).json({ error: `This account is not authorised for ${COUNTRIES[country].name}.` });
      }
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signBhatToken({ ...user.toObject(), country });
    setBhatCookies(res, token, country);

    return res.status(200).json({
      ok: true,
      role: user.role,
      name: user.name,
      country,
    });
  } catch (e) {
    console.error('BHAT login error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
