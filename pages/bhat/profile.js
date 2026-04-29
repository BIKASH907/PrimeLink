// =====================================================
// /bhat/profile — change own name, email, password
// =====================================================
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { ROLE_LABELS, COUNTRIES } from '../../lib/bhatConstants';

export default function ProfilePage({ user }) {
  const router = useRouter();
  const [info, setInfo] = useState({ name: user.name, email: user.email });
  const [pwd,  setPwd]  = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [msg,  setMsg]  = useState(null);
  const [err,  setErr]  = useState(null);

  async function saveInfo(e) {
    e.preventDefault(); setBusy(true); setMsg(null); setErr(null);
    const r = await fetch('/api/bhat/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: info.name, email: info.email }),
    });
    const data = await r.json();
    setBusy(false);
    if (!r.ok) return setErr(data.error || 'Update failed');
    setMsg('Profile updated. Refreshing…');
    setTimeout(() => router.replace(router.asPath), 800);
  }

  async function savePassword(e) {
    e.preventDefault(); setBusy(true); setMsg(null); setErr(null);
    if (pwd.next !== pwd.confirm) {
      setBusy(false); return setErr('New password and confirmation don’t match');
    }
    const r = await fetch('/api/bhat/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwd.current, newPassword: pwd.next }),
    });
    const data = await r.json();
    setBusy(false);
    if (!r.ok) return setErr(data.error || 'Password change failed');
    setMsg('Password changed successfully.');
    setPwd({ current: '', next: '', confirm: '' });
  }

  const country = COUNTRIES[user.currentCountry] || {};

  return (
    <BhatLayout user={user} active="profile">
      <Head><title>My Profile — BHAT Overseas</title></Head>

      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">My Profile</div>
          <div className="bhat-page-sub">Update your name, email, and password</div>
        </div>
      </div>

      <div style={{ padding:'22px 24px', maxWidth: 720, display:'grid', gap:16 }}>
        {/* Account info card */}
        <div className="bhat-panel">
          <div className="bhat-panel-title">Account</div>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom: 18 }}>
            <div className="bhat-avatar" style={{ width:48, height:48, fontSize:16 }}>
              {(user.name || '?').split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:600 }}>{user.name}</div>
              <div style={{ fontSize:12, color:'var(--text-3)' }}>
                {ROLE_LABELS[user.role]} • {country.flag} {country.name || 'All countries'}
              </div>
            </div>
          </div>

          <form onSubmit={saveInfo}>
            <div className="bhat-form-group">
              <label>Display Name</label>
              <input type="text" value={info.name}
                onChange={e => setInfo(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="bhat-form-group">
              <label>Email (login)</label>
              <input type="email" value={info.email}
                onChange={e => setInfo(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <button className="bhat-btn bhat-btn-primary" type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password card */}
        <div className="bhat-panel">
          <div className="bhat-panel-title">Change Password</div>
          <form onSubmit={savePassword}>
            <div className="bhat-form-group">
              <label>Current Password</label>
              <input type="password" value={pwd.current}
                onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} required />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="bhat-form-group">
                <label>New Password (min 8 chars)</label>
                <input type="password" value={pwd.next} minLength={8}
                  onChange={e => setPwd(p => ({ ...p, next: e.target.value }))} required />
              </div>
              <div className="bhat-form-group">
                <label>Confirm New Password</label>
                <input type="password" value={pwd.confirm} minLength={8}
                  onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} required />
              </div>
            </div>
            <button className="bhat-btn bhat-btn-primary" type="submit" disabled={busy}>
              {busy ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </div>

        {msg && <div style={{
          padding: '10px 14px', background: 'var(--green-dim)', color: 'var(--green)',
          border: '1px solid var(--green)', borderRadius: 7, fontSize: 13,
        }}>✔ {msg}</div>}
        {err && <div className="bhat-error">{err}</div>}
      </div>
    </BhatLayout>
  );
}

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx);
  if (guard.redirect) return { redirect: guard.redirect };
  return { props: { user: guard.user } };
}
