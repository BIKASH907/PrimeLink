// =====================================================
// /bhat/pipeline — 14-stage Kanban for the picked country
// =====================================================
import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import connectDB from '../../lib/db';
import BhatClient from '../../models/BhatClient';
import BhatDocument from '../../models/BhatDocument';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { PIPELINE_STAGES, COUNTRIES } from '../../lib/bhatConstants';

export default function PipelinePage({ user, countryCode, stages, stats, counts }) {
  const router = useRouter();
  const country = COUNTRIES[countryCode] || COUNTRIES.TR;
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected]     = useState(new Set());
  const [bulkStage, setBulkStage]   = useState('flight_ticket');
  const [bulkBusy, setBulkBusy]     = useState(false);
  const canBulk = user.role === 'super_admin' || user.role === 'admin';

  function toggleId(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function exitSelect() { setSelectMode(false); setSelected(new Set()); }

  async function applyBulkStage() {
    if (selected.size === 0) return;
    if (!confirm(`Move ${selected.size} clients to "${PIPELINE_STAGES.find(s => s.key === bulkStage)?.label}"?`)) return;
    setBulkBusy(true);
    const r = await fetch('/api/bhat/clients/bulk-stage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selected), stage: bulkStage }),
    });
    const data = await r.json();
    setBulkBusy(false);
    if (r.ok) {
      alert(`Updated ${data.updated} clients (${data.skipped} already in that stage)`);
      exitSelect();
      router.replace(router.asPath);
    } else {
      alert(data.error || 'Bulk update failed');
    }
  }

  return (
    <BhatLayout user={{ ...user, currentCountry: countryCode }} active="pipeline" counts={counts}>
      <Head><title>Pipeline — {country.name}</title></Head>

      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">Recruitment Pipeline — {country.name} {country.flag}</div>
          <div className="bhat-page-sub">14-step workflow • Click a card for full client details</div>
        </div>
        <div className="bhat-page-actions">
          {canBulk && !selectMode && (
            <button className="bhat-btn bhat-btn-ghost" onClick={() => setSelectMode(true)}>☑ Bulk Select</button>
          )}
          <Link href="/bhat/documents" className="bhat-btn bhat-btn-ghost">View Documents</Link>
          <Link href="/bhat/clients/new" className="bhat-btn bhat-btn-primary">+ New Client</Link>
        </div>
      </div>

      {selectMode && (
        <div style={{
          padding:'10px 24px', background:'var(--accent-glow)',
          borderBottom:'1px solid var(--accent)',
          display:'flex', alignItems:'center', gap:12,
        }}>
          <div style={{ fontSize:13 }}>
            <strong>{selected.size}</strong> selected
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:12, color:'var(--text-2)' }}>Move to:</span>
            <select value={bulkStage} onChange={e => setBulkStage(e.target.value)} style={{ padding:'5px 9px' }}>
              {PIPELINE_STAGES.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
            <button className="bhat-btn bhat-btn-primary" onClick={applyBulkStage}
              disabled={bulkBusy || selected.size === 0}>
              {bulkBusy ? 'Updating…' : `Apply to ${selected.size}`}
            </button>
            <button className="bhat-btn bhat-btn-ghost" onClick={exitSelect}>Cancel</button>
          </div>
        </div>
      )}

      <div className="bhat-pipeline-meta">
        <Stat label="Active"        value={stats.total} />
        <Stat label="In Doc Stage"  value={stats.inDoc} />
        <Stat label="Awaiting VFS"  value={stats.vfs} />
        <Stat label="Delayed"       value={stats.delayed}  klass="warn" />
        <Stat label="Urgent"        value={stats.urgent}   klass="danger" />
        <Stat label="Ready to Fly"  value={stats.ready}    klass="good" />
        <Stat label="Departed (30d)" value={stats.departed} />
      </div>

      <div className="bhat-kanban">
        {stages.map((stage, idx) => (
          <div className="bhat-col" key={stage.key}>
            <div className="bhat-col-head">
              <div className="bhat-col-num">{idx + 1}</div>
              <div className="bhat-col-title">{stage.label}</div>
              <div className="bhat-col-count">{stage.clients.length}</div>
            </div>
            <div className="bhat-col-body">
              {stage.clients.length === 0 && (
                <div style={{ padding:16, textAlign:'center', fontSize:11, color:'var(--text-3)' }}>No clients</div>
              )}
              {stage.clients.map(c => {
                const isSel = selected.has(c.id);
                const cardClass = `bhat-card ${c.isUrgent ? 'urgent' : ''} ${isSel ? 'selected' : ''}`;
                const inner = (
                  <>
                    {c.isUrgent && <span className="bhat-urgent-flag">🚩</span>}
                    {selectMode && (
                      <span style={{
                        position:'absolute', top:9, left:9, width:16, height:16,
                        borderRadius:4, border:'2px solid var(--accent)',
                        background: isSel ? 'var(--accent)' : 'transparent',
                        display:'grid', placeItems:'center', fontSize:11, color:'white',
                      }}>{isSel ? '✓' : ''}</span>
                    )}
                    <div className="bhat-card-name" style={selectMode ? { paddingLeft:24 } : null}>{c.fullName}</div>
                    <div className="bhat-card-ref">{c.refNo}</div>
                    <div className="bhat-card-meta">
                      <div className="bhat-card-row"><span className="bhat-card-lbl">Company</span> {c.company || '—'}</div>
                      <div className="bhat-card-row"><span className="bhat-card-lbl">Agent</span> {c.agentName || '—'}</div>
                    </div>
                    <div className="bhat-progress">
                      <div className="bhat-progress-bar"><div className="bhat-progress-fill" style={{ width: `${(c.progress / 14) * 100}%` }}></div></div>
                      <div className="bhat-progress-text">{c.progress}/14</div>
                    </div>
                    <div className="bhat-card-time">Updated {c.updatedHuman}</div>
                  </>
                );
                return selectMode ? (
                  <div key={c.id} className={cardClass}
                    style={{ cursor:'pointer' }} onClick={() => toggleId(c.id)}>
                    {inner}
                  </div>
                ) : (
                  <Link key={c.id} href={`/bhat/clients/${c.id}`} className={cardClass}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </BhatLayout>
  );
}

function Stat({ label, value, klass }) {
  return (
    <div className="bhat-stat">
      <span className="bhat-stat-lbl">{label}</span>
      <span className={`bhat-stat-val ${klass || ''}`}>{value}</span>
    </div>
  );
}

function humanTime(date) {
  if (!date) return '—';
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx);
  if (guard.redirect) return { redirect: guard.redirect };
  const user = guard.user;
  if (user.role === 'sub_admin') {
    return { redirect: { destination: '/bhat/sub', permanent: false } };
  }

  await connectDB();
  const countryCode = user.currentCountry || 'TR';

  const clients = await BhatClient.find({ country: countryCode }).lean();

  const grouped = {};
  PIPELINE_STAGES.forEach(s => grouped[s.key] = []);
  clients.forEach(c => {
    if (!grouped[c.stage]) grouped[c.stage] = [];
    grouped[c.stage].push({
      id: c._id.toString(),
      fullName: c.fullName, refNo: c.refNo,
      company: c.company || null, agentName: c.agentName || null,
      progress: c.progress, isUrgent: c.isUrgent,
      updatedHuman: humanTime(c.updatedAt),
    });
  });

  const stages = PIPELINE_STAGES.map(s => ({
    key: s.key, label: s.label, clients: grouped[s.key] || [],
  }));

  const cutoff = new Date(Date.now() - 14 * 86400000);
  const stats = {
    total:    clients.length,
    inDoc:    clients.filter(c => c.stage === 'doc_collection').length,
    vfs:      clients.filter(c => c.stage === 'vfs_appointment' || c.stage === 'second_vfs').length,
    delayed:  clients.filter(c => c.stageEnteredAt && new Date(c.stageEnteredAt) < cutoff).length,
    urgent:   clients.filter(c => c.isUrgent).length,
    ready:    clients.filter(c => c.stage === 'flight_ticket' || c.stage === 'flight_status').length,
    departed: 12,
  };

  const docCount = await BhatDocument.countDocuments();

  return {
    props: {
      user, countryCode,
      stages, stats,
      counts: { pipeline: clients.length, documents: docCount },
    },
  };
}
