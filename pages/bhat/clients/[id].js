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
import DocumentUploader from '../../../components/bhat/DocumentUploader';
import { requireBhatUser } from '../../../lib/bhatAuth';
import { PIPELINE_STAGES, STAGE_BY_KEY, COUNTRIES } from '../../../lib/bhatConstants';
import { alertsForClient } from '../../../lib/bhatExpiry';

export default function ClientDetail({ user, client, documents, notes, timeline, alerts = [] }) {
  const router = useRouter();
  const [noteBody, setNoteBody] = useState('');
  const [editing, setEditing]   = useState(false);
  const [edit, setEdit] = useState({
    fullName: client.fullName,
    company:  client.company || '',
    agentName:client.agentName || '',
    position: client.position || '',
    stage:    client.stage,
  });
  const stageMeta  = STAGE_BY_KEY[client.stage] || { label: client.stage, index: 0 };
  const canEdit    = user.role === 'super_admin' || user.role === 'admin';
  const canDelete  = user.role === 'super_admin';

  async function advance() {
    await fetch(`/api/bhat/clients/${client.id}/advance`, { method: 'POST' });
    router.replace(router.asPath);
  }
  async function jumpToStage(newStage) {
    if (!newStage || newStage === client.stage) return;
    if (!confirm(`Move ${client.fullName} to "${PIPELINE_STAGES.find(s => s.key === newStage)?.label}"?`)) return;
    const r = await fetch(`/api/bhat/clients/${client.id}/stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    });
    if (r.ok) router.replace(router.asPath);
    else alert((await r.json()).error || 'Stage change failed');
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
  async function saveEdit() {
    const r = await fetch(`/api/bhat/clients/${client.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit),
    });
    if (r.ok) {
      setEditing(false);
      router.replace(router.asPath);
    } else {
      const data = await r.json();
      alert(data.error || 'Update failed');
    }
  }
  async function deleteClient() {
    const ok = confirm(`Permanently delete ${client.fullName} (${client.refNo}) and all related documents, notes, and timeline events? This cannot be undone.`);
    if (!ok) return;
    const r = await fetch(`/api/bhat/clients/${client.id}`, { method: 'DELETE' });
    if (r.ok) {
      router.push('/bhat/pipeline');
    } else {
      const data = await r.json();
      alert(data.error || 'Delete failed');
    }
  }

  // ---- Mark as rejected / refunded ----
  async function markOutcome(outcome) {
    const reason = prompt(`Reason for ${outcome.toUpperCase()}? (optional)`) ?? '';
    if (!confirm(`Mark ${client.fullName} as ${outcome.toUpperCase()}? This moves them out of the active pipeline.`)) return;
    const r = await fetch(`/api/bhat/clients/${client.id}/outcome`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome, reason }),
    });
    if (r.ok) {
      router.replace(router.asPath);
    } else {
      alert((await r.json()).error || 'Failed');
    }
  }

  // ---- Quick payment recording ----
  const [showPay, setShowPay] = useState(false);
  const [pay, setPay] = useState({
    type: 'advance', amount: '', currency: 'NPR',
    description: '', paidAt: new Date().toISOString().slice(0,10),
  });
  async function recordPayment(e) {
    e.preventDefault();
    if (!pay.amount) return alert('Enter amount');
    const r = await fetch('/api/bhat/ledger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: client.id,
        direction: 'in',
        ...pay,
      }),
    });
    if (r.ok) {
      setShowPay(false);
      setPay({ type:'advance', amount:'', currency:'NPR', description:'', paidAt: new Date().toISOString().slice(0,10) });
      alert('✔ Payment recorded — see Finance page for ledger view');
      router.replace(router.asPath);
    } else {
      alert((await r.json()).error || 'Failed to record payment');
    }
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
          {canEdit && (
            <button className="bhat-btn bhat-btn-ghost" onClick={() => setEditing(v => !v)}>
              {editing ? 'Cancel Edit' : '✏ Edit'}
            </button>
          )}
          {canEdit && (
            <button className="bhat-btn bhat-btn-ghost" onClick={() => setShowPay(v => !v)}
              style={{ background:'var(--green-dim)', color:'var(--green)', borderColor:'var(--green)' }}>
              💵 {showPay ? 'Cancel Payment' : 'Record Payment'}
            </button>
          )}
          {canDelete && (
            <button className="bhat-btn bhat-btn-ghost" onClick={deleteClient}
              style={{ background:'var(--red-dim)', color:'var(--red)', borderColor:'var(--red)' }}>
              🗑 Delete
            </button>
          )}
          <button className="bhat-btn bhat-btn-ghost" onClick={flagUrgent}>
            {client.isUrgent ? '★ Unflag' : '🚩 Flag Urgent'}
          </button>
          {canEdit && !['rejected','refunded','departed'].includes(client.stage) && (
            <>
              <button className="bhat-btn bhat-btn-ghost" onClick={() => markOutcome('rejected')}
                style={{ background:'var(--red-dim)', color:'var(--red)', borderColor:'var(--red)' }}>
                ✕ Mark Rejected
              </button>
              <button className="bhat-btn bhat-btn-ghost" onClick={() => markOutcome('refunded')}
                style={{ background:'var(--orange-dim)', color:'var(--orange)', borderColor:'var(--orange)' }}>
                ↺ Mark Refunded
              </button>
              {/* Mark Departed only when at flight_status (last active stage) */}
              {client.stage === 'flight_status' && (
                <button className="bhat-btn bhat-btn-ghost" onClick={() => markOutcome('departed')}
                  style={{ background:'var(--green-dim)', color:'var(--green)', borderColor:'var(--green)' }}>
                  ✈ Mark Departed
                </button>
              )}
            </>
          )}
          {client.progress < 14 && !['rejected','refunded','departed'].includes(client.stage) && (
            <button className="bhat-btn bhat-btn-primary" onClick={advance}>Move to Next Step →</button>
          )}
          {canEdit && (
            <select value=""
              onChange={e => jumpToStage(e.target.value)}
              style={{ padding:'8px 10px', fontSize:13, background:'var(--bg-2)',
                       border:'1px solid var(--border)', borderRadius:7, color:'var(--text-1)' }}>
              <option value="">⇢ Jump to stage…</option>
              {PIPELINE_STAGES.map(s => (
                <option key={s.key} value={s.key} disabled={s.key === client.stage}>
                  {s.terminal ? (s.color === 'red' ? '✕ ' : '↺ ') : ''}{s.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {showPay && canEdit && (
        <div style={{ padding:'14px 24px' }}>
          <form onSubmit={recordPayment} className="bhat-panel" style={{ borderLeft:'3px solid var(--green)' }}>
            <div className="bhat-panel-title">💵 Quick Record Payment for {client.fullName}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12 }}>
              <div className="bhat-form-group">
                <label>Type</label>
                <select value={pay.type} onChange={e => setPay(p => ({ ...p, type: e.target.value }))}>
                  <option value="advance">Advance</option>
                  <option value="service_fee">Service Fee</option>
                  <option value="medical">Medical</option>
                  <option value="visa_fee_in">Visa Fee</option>
                  <option value="other_in">Other</option>
                </select>
              </div>
              <div className="bhat-form-group">
                <label>Amount</label>
                <input type="number" step="0.01" min="0" required
                  value={pay.amount} onChange={e => setPay(p => ({ ...p, amount: e.target.value }))} />
              </div>
              <div className="bhat-form-group">
                <label>Currency</label>
                <select value={pay.currency} onChange={e => setPay(p => ({ ...p, currency: e.target.value }))}>
                  <option>NPR</option><option>INR</option><option>EUR</option>
                  <option>USD</option><option>TRY</option>
                </select>
              </div>
              <div className="bhat-form-group">
                <label>Date</label>
                <input type="date" value={pay.paidAt}
                  onChange={e => setPay(p => ({ ...p, paidAt: e.target.value }))} />
              </div>
            </div>
            <div className="bhat-form-group">
              <label>Description (optional)</label>
              <input type="text" value={pay.description}
                onChange={e => setPay(p => ({ ...p, description: e.target.value }))}
                placeholder="e.g. cash deposit at office" />
            </div>
            <button className="bhat-btn bhat-btn-primary" type="submit">Save to Ledger</button>
          </form>
        </div>
      )}

      {alerts.length > 0 && (
        <div style={{ padding:'14px 24px', display:'flex', flexDirection:'column', gap:8 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              padding:'10px 14px', borderRadius:8, fontSize:13,
              display:'flex', alignItems:'center', gap:10,
              background: a.severity === 'danger' ? 'var(--red-dim)' : 'var(--orange-dim)',
              borderLeft: `3px solid ${a.severity === 'danger' ? 'var(--red)' : 'var(--orange)'}`,
              color: a.severity === 'danger' ? 'var(--red)' : 'var(--orange)',
            }}>
              <span style={{ fontSize:18 }}>⚠</span>
              <strong>{a.kind === 'passport_expiry' ? 'Passport' : 'Police Report'}:</strong>
              <span>{a.message}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding:'22px 24px', display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20 }}>
        <div>
          <div className="bhat-panel" style={{ marginBottom:16 }}>
            <div className="bhat-panel-title">Client Information</div>

            {editing ? (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <EditField lbl="Full Name" val={edit.fullName}
                  onChange={v => setEdit(p => ({ ...p, fullName: v }))} />
                <EditField lbl="Company"   val={edit.company}
                  onChange={v => setEdit(p => ({ ...p, company: v }))} />
                <EditField lbl="Agent"     val={edit.agentName}
                  onChange={v => setEdit(p => ({ ...p, agentName: v }))} />
                <EditField lbl="Position"  val={edit.position}
                  onChange={v => setEdit(p => ({ ...p, position: v }))} />
                <div style={{ gridColumn:'1 / span 2' }}>
                  <div className="bhat-field-lbl">Stage</div>
                  <select value={edit.stage}
                    onChange={e => setEdit(p => ({ ...p, stage: e.target.value }))}
                    style={{ width:'100%' }}>
                    {PIPELINE_STAGES.map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn:'1 / span 2', display:'flex', gap:8, marginTop:8 }}>
                  <button className="bhat-btn bhat-btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="bhat-btn bhat-btn-primary" onClick={saveEdit}>Save Changes</button>
                </div>
              </div>
            ) : (
              <div className="bhat-info-grid">
                <Field lbl="Company"      val={client.company || '—'} />
                <Field lbl="Agent"        val={client.agentName || '—'} />
                <Field lbl="Position"     val={client.position || '—'} />
                <Field lbl="Days in stage" val={`${client.daysInStage} days`} />
                <Field lbl="Created"      val={client.createdHuman} />
                <Field lbl="Last updated" val={client.updatedHuman} />
              </div>
            )}
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
            <div className="bhat-panel-title">Documents</div>
            <div className="bhat-doc-list">
              {documents.length === 0 && <div className="bhat-tt">No documents yet — upload one below.</div>}
              {documents.map(d => (
                <div className="bhat-doc-row" key={d.id}>
                  <div className={`bhat-doc-status ${d.status === 'ok' ? 'ok' : (d.status === 'expiring' || d.status === 'needs_review') ? 'exp' : 'miss'}`}>
                    {d.status === 'ok' ? '✔'
                      : d.status === 'expiring' ? '⚠'
                      : d.status === 'needs_review' ? '?' : '✕'}
                  </div>
                  <div style={{ flex:1, fontSize:13 }}>
                    {d.fileUrl
                      ? <a href={d.fileUrl} target="_blank" rel="noreferrer" style={{ color:'var(--accent)' }}>{d.label}</a>
                      : d.label}
                    {d.expiry && <span className="bhat-tt"> — expires {d.expiry}</span>}
                    {d.needsReview && (
                      <span style={{ marginLeft:8, fontSize:10, padding:'1px 6px', borderRadius:3,
                        background:'var(--orange-dim)', color:'var(--orange)' }}>
                        Needs Review · {d.confidence ?? '—'}%
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-3)' }}>{d.note}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14 }}>
              <DocumentUploader
                clientId={client.id}
                defaultDocType="passport"
                onUploaded={() => router.replace(router.asPath)}
              />
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

function EditField({ lbl, val, onChange }) {
  return (
    <div>
      <div className="bhat-field-lbl">{lbl}</div>
      <input type="text" value={val} onChange={e => onChange(e.target.value)} style={{ width:'100%' }} />
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

const STATUS_LABEL = {
  ok:'Verified', expiring:'Expiring', missing:'Missing', expired:'Expired',
  needs_review:'Needs Review',
};

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

  // Only show non-archived documents on the detail page
  const docs = await BhatDocument.find({ client: c._id, archivedAt: null }).lean();
  const expiryAlerts = alertsForClient(c, docs);
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
        fileUrl: d.fileUrl || null,
        confidence: d.ocrConfidence ?? null,
        needsReview: !!d.needsReview,
      })),
      alerts: expiryAlerts.map(a => ({ kind: a.kind, severity: a.severity, message: a.message })),
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
