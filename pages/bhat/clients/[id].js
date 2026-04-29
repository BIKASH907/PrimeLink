// =====================================================
// /bhat/clients/[id] — full client detail
// =====================================================
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import connectDB from '../../../lib/db';
import BhatClient from '../../../models/BhatClient';
import BhatDocument from '../../../models/BhatDocument';
import BhatNote from '../../../models/BhatNote';
import BhatTimeline from '../../../models/BhatTimeline';
import BhatLayout from '../../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../../lib/bhatAuth';
import { PIPELINE_STAGES, STAGE_BY_KEY, COUNTRIES } from '../../../lib/bhatConstants';

export default function ClientDetail({ user, client, documents, notes, timeline }) {
  const router = useRouter();
  const [noteBody, setNoteBody] = useState('');
  const stageMeta = STAGE_BY_KEY[client.stage] || { label: client.stage, index: 0 };

  async function advance() {
    await fetch(`/api/bhat/clients/${client.id}/advance`, { method: 'POST' });
    router.replace(router.asPath);
  }
  async function flagUrgent() {
    await fetch(`/api/bhat/clients/${client.id}/flag`, { method: 'POST' });
    router.replace(router.asPath);
  }
  async function addNote(e) {
    e.preventDefault();
    if (!noteBody.trim()) return;
    await fetch(`/api/bhat/clients/${client.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: noteBody }),
    });
    setNoteBody('');
    router.replace(router.asPath);
  }

  return (
    <BhatLayout user={user} active="pipeline">
      <Head><title>{client.fullName} — BHAT Overseas</title></Head>

      <div className="bhat-page-head">
        <Link href="/bhat/pipeline" style={{ color:'var(--text-3)', fontSize:12 }}>← Back to Pipeline</Link>
        <div style={{ marginLeft:12 }}>
          <div className="bhat-page-title">{client.fullName}</div>
          <div className="bhat-page-sub">
            {client.refNo} • {COUNTRIES[client.country]?.flag} {COUNTRIES[client.country]?.name} •
            <strong> {stageMeta.label}</strong>
          </div>
        </div>
        <div className="bhat-page-actions">
          <button className="bhat-btn bhat-btn-ghost" onClick={flagUrgent}>
            {client.isUrgent ? '★ Unflag' : '🚩 Flag Urgent'}
          </button>
          {client.progress < 14 && (
            <button className="bhat-btn bhat-btn-primary" onClick={advance}>Move to Next Step →</button>
          )}
        </div>
      </div>

      <div style={{ padding:'22px 24px', display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20 }}>
        <div>
          <div className="bhat-panel" style={{ marginBottom:16 }}>
            <div className="bhat-panel-title">Client Information</div>
            <div className="bhat-info-grid">
              <Field lbl="Company"      val={client.company || '—'} />
              <Field lbl="Agent"        val={client.agentName || '—'} />
              <Field lbl="Position"     val={client.position || '—'} />
              <Field lbl="Days in stage" val={`${client.daysInStage} days`} />
              <Field lbl="Created"      val={client.createdHuman} />
              <Field lbl="Last updated" val={client.updatedHuman} />
            </div>
            <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.6px', marginTop:14, marginBottom:8 }}>
              Pipeline Progress ({client.progress}/14)
            </div>
            <div className="bhat-stage-bar">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className={`bhat-stage-dot ${i < stageMeta.index ? 'done' : (i === stageMeta.index ? 'current' : '')}`}></div>
              ))}
            </div>
          </div>

          <div className="bhat-panel" style={{ marginBottom:16 }}>
            <div className="bhat-panel-title">
              Documents
              <span style={{ marginLeft:'auto' }}>
                <Link href={`/bhat/documents?clientId=${client.id}`} className="bhat-btn bhat-btn-ghost" style={{ padding:'4px 10px', fontSize:11 }}>+ Upload</Link>
              </span>
            </div>
            <div className="bhat-doc-list">
              {documents.length === 0 && <div className="bhat-tt">No documents yet — upload one to get started.</div>}
              {documents.map(d => (
                <div className="bhat-doc-row" key={d.id}>
                  <div className={`bhat-doc-status ${d.status === 'ok' ? 'ok' : d.status === 'expiring' ? 'exp' : 'miss'}`}>
                    {d.status === 'ok' ? '✔' : d.status === 'expiring' ? '⚠' : '✕'}
                  </div>
                  <div style={{ flex:1, fontSize:13 }}>
                    {d.label}
                    {d.expiry && <span className="bhat-tt"> — expires {d.expiry}</span>}
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-3)' }}>{d.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bhat-panel">
            <div className="bhat-panel-title">Notes</div>
            <form onSubmit={addNote}>
              <textarea
                value={noteBody} onChange={e => setNoteBody(e.target.value)}
                placeholder="Add a note…" rows="3"
                style={{ width:'100%', resize:'vertical', minHeight:60 }}
              />
              <button className="bhat-btn bhat-btn-primary" type="submit" style={{ marginTop:8 }}>Save Note</button>
            </form>
            <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:8 }}>
              {notes.map(n => (
                <div key={n.id} style={{ padding:'10px 12px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:6, fontSize:12 }}>
                  {n.body}
                  <div style={{ fontSize:10, color:'var(--text-3)', marginTop:4 }}>{n.author} • {n.when}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bhat-panel">
            <div className="bhat-panel-title">Timeline</div>
            <div style={{ position:'relative', paddingLeft:22 }}>
              <div style={{ position:'absolute', left:6, top:4, bottom:4, width:2, background:'var(--border)' }}></div>
              {timeline.map(t => (
                <div key={t.id} style={{ position:'relative', paddingBottom:14 }}>
                  <div style={{
                    position:'absolute', left:-19, top:5, width:10, height:10, borderRadius:'50%',
                    background:'var(--bg-1)', border:`2px solid ${t.isSystem ? 'var(--purple)' : 'var(--accent)'}`,
                  }}></div>
                  <div style={{ fontSize:12 }}>
                    {t.description}
                    {t.isSystem && <span style={{
                      marginLeft:6, fontSize:9, padding:'1px 6px', borderRadius:3,
                      background:'var(--purple)', color:'white', textTransform:'uppercase', letterSpacing:'.3px',
                    }}>Auto</span>}
                  </div>
                  <div style={{ fontSize:10, color:'var(--text-3)', marginTop:2 }}>{t.when} {t.actor && `• ${t.actor}`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BhatLayout>
  );
}

function Field({ lbl, val }) {
  return (
    <div>
      <div className="bhat-field-lbl">{lbl}</div>
      <div className="bhat-field-val">{val}</div>
    </div>
  );
}

const human = d => {
  if (!d) return '—';
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const STATUS_LABEL = { ok:'Verified', expiring:'Expiring', missing:'Missing', expired:'Expired' };

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx);
  if (guard.redirect) return { redirect: guard.redirect };
  const user = guard.user;

  await connectDB();
  const c = await BhatClient.findById(ctx.params.id).lean();
  if (!c) return { notFound: true };

  // Sub-admin can only see assigned clients
  if (user.role === 'sub_admin') {
    const me = await (await import('../../../models/BhatUser')).default.findById(user.id).lean();
    const assignedIds = (me?.assignedClients || []).map(x => x.toString());
    if (!assignedIds.includes(c._id.toString())) {
      return { redirect: { destination: '/bhat/sub', permanent: false } };
    }
  }

  const docs = await BhatDocument.find({ client: c._id }).lean();
  const notesRaw = await BhatNote.find({ client: c._id }).sort({ createdAt: -1 }).lean();
  const tl = await BhatTimeline.find({ client: c._id }).sort({ createdAt: -1 }).lean();

  const daysInStage = c.stageEnteredAt
    ? Math.floor((Date.now() - new Date(c.stageEnteredAt).getTime()) / 86400000) : 0;

  return {
    props: {
      user,
      client: {
        id: c._id.toString(),
        fullName: c.fullName, refNo: c.refNo, country: c.country,
        company: c.company || null, agentName: c.agentName || null,
        position: c.position || null, stage: c.stage,
        progress: c.progress, isUrgent: c.isUrgent,
        daysInStage,
        createdHuman: human(c.createdAt),
        updatedHuman: human(c.updatedAt),
      },
      documents: docs.map(d => ({
        id: d._id.toString(),
        label: d.docType.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()),
        status: d.status,
        expiry: d.expiryDate ? new Date(d.expiryDate).toISOString().slice(0,10) : null,
        note: STATUS_LABEL[d.status] || '—',
      })),
      notes: notesRaw.map(n => ({
        id: n._id.toString(), body: n.body,
        author: n.authorName || 'Staff', when: human(n.createdAt),
      })),
      timeline: tl.map(t => ({
        id: t._id.toString(), description: t.description,
        isSystem: t.isSystem, actor: t.actorName || (t.isSystem ? 'Auto' : 'Staff'),
        when: human(t.createdAt),
      })),
    },
  };
}
