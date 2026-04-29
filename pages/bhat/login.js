// =====================================================
// Login page — country-aware
// =====================================================
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { COUNTRIES } from '../../lib/bhatConstants';
import { BhatStyles } from '../../components/bhat/BhatLayout';

const ROLE_TABS = [
  { key: 'super_admin', label: 'Super Admin', hint: 'Full access — pipeline, documents, users, CV builder, settings.' },
  { key: 'admin',       label: 'Admin',       hint: 'Pipeline + Documents + CV Builder. Cannot manage Super Admin accounts.' },
  { key: 'sub_admin',   label: 'Sub-Admin',   hint: 'Documents & CV Builder only — for assigned clients.' },
];

const SEED_EMAILS = {
  RO: { super_admin: 'bikash.ro@bhatoverseas.com', admin: 'anita.ro@bhatoverseas.com', sub_admin: 'ravi.ro@bhatoverseas.com' },
  TR: { super_admin: 'bikash.tr@bhatoverseas.com', admin: 'anita.tr@bhatoverseas.com', sub_admin: 'ravi.tr@bhatoverseas.com' },
};

export default function BhatLogin() {
  const router = useRouter();
  const country = (router.query.country || 'TR').toString().toUpperCase();
  const meta = COUNTRIES[country] || COUNTRIES.TR;

  const [role,     setRole]     = useState('super_admin');
  const [email,    setEmail]    = useState(SEED_EMAILS[country]?.super_admin || '');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);

  function pickRole(r) {
    setRole(r);
    setEmail(SEED_EMAILS[country]?.[r] || '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await fetch('/api/bhat/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, country }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      // Redirect: sub-admin → /bhat/sub, others → /bhat/pipeline
      router.push(data.role === 'sub_admin' ? '/bhat/sub' : '/bhat/pipeline');
    } catch (err) {
      setError('Network error — try again');
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>{meta.name} Login — BHAT Overseas</title></Head>
      <BhatStyles />
      <div className="bhat-gate">
        <form className="bhat-login-box" onSubmit={handleSubmit}>
          <Link href="/bhat" className="bhat-login-back">← Change country</Link>
          <div className="bhat-gate-brand" style={{ marginBottom:0 }}>
            <div className="bhat-gate-logo" style={{ width:38, height:38, fontSize:14, borderRadius:9 }}>BO</div>
            <div>
              <div className="bhat-login-title">{meta.name} System Login {meta.flag}</div>
              <div className="bhat-login-sub">Bhat Overseas — {meta.name} Operations</div>
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <div className="bhat-role-tabs">
              {ROLE_TABS.map(t => (
                <button
                  type="button" key={t.key}
                  className={`bhat-role-tab ${role === t.key ? 'active' : ''}`}
                  onClick={() => pickRole(t.key)}
                >{t.label}</button>
              ))}
            </div>

            <div className="bhat-form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="bhat-form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {error && <div className="bhat-error">{error}</div>}

            <button className="bhat-btn bhat-btn-primary bhat-btn-block" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In Securely'}
            </button>

            <div className="bhat-login-hint">
              <strong style={{ color:'#a6b4cc' }}>{ROLE_TABS.find(t => t.key === role)?.label}:</strong>
              {' ' + ROLE_TABS.find(t => t.key === role)?.hint}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
