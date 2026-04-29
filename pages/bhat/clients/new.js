// =====================================================
// /bhat/clients/new — create a new client
// Admin / Super-Admin only. Sub-Admin redirected away.
// =====================================================
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import BhatLayout from '../../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../../lib/bhatAuth';
import { COUNTRIES, PIPELINE_STAGES } from '../../../lib/bhatConstants';

export default function NewClient({ user }) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    country: user.currentCountry || 'TR',
    company: '',
    agentName: '',
    position: '',
    stage: 'doc_collection',
    isUrgent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      const r = await fetch('/api/bhat/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || 'Failed to create client');
        setSubmitting(false);
        return;
      }
      router.push(`/bhat/clients/${data.id}`);
    } catch (err) {
      setError('Network error — try again');
      setSubmitting(false);
    }
  }

  return (
    <BhatLayout user={user} active="pipeline">
      <Head><title>New Client — BHAT Overseas</title></Head>
      <div className="bhat-page-head">
        <Link href="/bhat/pipeline" style={{ color:'var(--text-3)', fontSize:12 }}>← Back to Pipeline</Link>
        <div style={{ marginLeft:12 }}>
          <div className="bhat-page-title">+ New Client</div>
          <div className="bhat-page-sub">Add a candidate to the recruitment pipeline</div>
        </div>
      </div>

      <div style={{ padding:'22px 24px', maxWidth:680 }}>
        <form onSubmit={submit} className="bhat-panel">
          <div className="bhat-form-group">
            <label>Full Name *</label>
            <input type="text" required
              value={form.fullName}
              onChange={e => set('fullName', e.target.value)}
              placeholder="e.g. Bikram Thapa" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div className="bhat-form-group">
              <label>Destination Country *</label>
              <select value={form.country} onChange={e => set('country', e.target.value)} required>
                {Object.values(COUNTRIES).map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="bhat-form-group">
              <label>Starting Stage</label>
              <select value={form.stage} onChange={e => set('stage', e.target.value)}>
                {PIPELINE_STAGES.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div className="bhat-form-group">
              <label>Company (receiving)</label>
              <input type="text"
                value={form.company}
                onChange={e => set('company', e.target.value)}
                placeholder="e.g. Anatolia Construction Ltd." />
            </div>
            <div className="bhat-form-group">
              <label>Agent Name</label>
              <input type="text"
                value={form.agentName}
                onChange={e => set('agentName', e.target.value)}
                placeholder="e.g. Ramesh Kumar" />
            </div>
          </div>

          <div className="bhat-form-group">
            <label>Position Applied</label>
            <input type="text"
              value={form.position}
              onChange={e => set('position', e.target.value)}
              placeholder="e.g. Welder / Construction Worker" />
          </div>

          <div className="bhat-form-group">
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
              <input type="checkbox"
                checked={form.isUrgent}
                onChange={e => set('isUrgent', e.target.checked)}
                style={{ width:'auto' }} />
              <span style={{ fontSize:13 }}>🚩 Mark as Urgent</span>
            </label>
          </div>

          {error && <div className="bhat-error">{error}</div>}

          <div style={{ display:'flex', gap:8, marginTop:18 }}>
            <Link href="/bhat/pipeline" className="bhat-btn bhat-btn-ghost">Cancel</Link>
            <button type="submit" className="bhat-btn bhat-btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : '+ Create Client'}
            </button>
          </div>
        </form>
      </div>
    </BhatLayout>
  );
}

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx, { minRole: 'admin' });
  if (guard.redirect) return { redirect: guard.redirect };
  return { props: { user: guard.user } };
}
