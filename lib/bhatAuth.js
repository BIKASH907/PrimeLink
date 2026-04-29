// =====================================================
// BHAT OVERSEAS — Auth helpers (separate from prime-link's adminAuth)
// =====================================================
// Uses HTTP-only cookies for browser sessions, JWT for tokens.
// No external cookie library — uses Next.js's built-in res.setHeader.

import jwt from 'jsonwebtoken';

const COOKIE_NAME    = 'bhat_session';
const COUNTRY_COOKIE = 'bhat_country';
const SECRET         = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'change-me-in-prod';
const TOKEN_HOURS    = 12;

// ---------- token ----------
export function signBhatToken(user) {
  return jwt.sign(
    {
      id:      user._id?.toString() || user.id,
      email:   user.email,
      role:    user.role,
      country: user.country || null,
      name:    user.name,
    },
    SECRET,
    { expiresIn: `${TOKEN_HOURS}h` }
  );
}

export function verifyBhatToken(token) {
  try { return jwt.verify(token, SECRET); }
  catch { return null; }
}

// ---------- cookie helpers (no library) ----------
function buildCookie(name, value, maxAge) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    `HttpOnly`,
    `SameSite=Lax`,
  ];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
}

function parseCookies(cookieHeader = '') {
  const out = {};
  cookieHeader.split(';').forEach(p => {
    const [k, ...v] = p.trim().split('=');
    if (!k) return;
    out[k] = decodeURIComponent(v.join('='));
  });
  return out;
}

// ---------- public API ----------
export function setBhatCookies(res, token, country) {
  const maxAge = 60 * 60 * TOKEN_HOURS;
  const cookies = [buildCookie(COOKIE_NAME, token, maxAge)];
  if (country) cookies.push(buildCookie(COUNTRY_COOKIE, country, maxAge));
  res.setHeader('Set-Cookie', cookies);
}

export function clearBhatCookies(res) {
  res.setHeader('Set-Cookie', [
    buildCookie(COOKIE_NAME, '', 0),
    buildCookie(COUNTRY_COOKIE, '', 0),
  ]);
}

export function getBhatUser(req) {
  const cookies = parseCookies(req.headers?.cookie);
  const token   = cookies[COOKIE_NAME];
  if (!token) return null;
  const decoded = verifyBhatToken(token);
  if (!decoded) return null;
  return { ...decoded, currentCountry: cookies[COUNTRY_COOKIE] || decoded.country };
}

// ---------- guards ----------
export function requireBhatUser(ctx, opts = {}) {
  const user = getBhatUser(ctx.req);
  if (!user) {
    return { redirect: { destination: '/bhat', permanent: false } };
  }
  if (opts.minRole === 'admin' && user.role === 'sub_admin') {
    return { redirect: { destination: '/bhat/sub', permanent: false } };
  }
  if (opts.minRole === 'super_admin' && user.role !== 'super_admin') {
    return { redirect: { destination: '/bhat/pipeline', permanent: false } };
  }
  return { user };
}

export function requireApiUser(req, res, opts = {}) {
  const user = getBhatUser(req);
  if (!user) { res.status(401).json({ error: 'Not authenticated' }); return null; }
  if (opts.minRole === 'admin' && user.role === 'sub_admin') {
    res.status(403).json({ error: 'Admin access required' }); return null;
  }
  if (opts.minRole === 'super_admin' && user.role !== 'super_admin') {
    res.status(403).json({ error: 'Super-Admin access required' }); return null;
  }
  return user;
}
