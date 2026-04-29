// =====================================================
// /bhat/documents — list + filter
// =====================================================
import Link from 'next/link';
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatClient from '../../models/BhatClient';
import BhatDocument from '../../models/BhatDocument';
import BhatUser from '../../models/BhatUser';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { STAGE_BY_KEY } from '../../lib/bhatConstants';

const FILTERS = [
  { key: 'all',  label: 'All Documents' },
  { key: 'miss', label: '❌ Missing Only' },
  { key: 'exp',  label: '⚠ Expiring Soon' },
  { key: 'ok',   label: '✔ Verified' },
];

const STATUS_LABELS = {
  ok: { class:'ok', label:'✔ Verified' },
  expiring: { class:'exp', label:'⚠ Expiring' },
  missing: { class:'miss', label:'❌ Missing' },
};

export default function DocumentsPage({ user, rows, total, filter, counts }) {
  return (
    <BhatLayout user={user} active="documents" counts={counts}>
      <Head><title>Documents — BHAT Overseas</title></Head>
      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">Documents</div>
          <div className="bhat-page-sub">{total} documents tracked across all stages</div>
        </div>
        <div className="bhat-page-actions">
          <Link href="/bhat/cv" className="bhat-btn bhat-btn-primary">+ Upload via CV Builder</Link>
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>
        <div style={{ display:'flex', gap:8, marginBottom:16, alignItems:'center', flexWrap:'wrap' }}>
          {FILTERS.map(f => (
            <Link key={f.key} href={`?filter=${f.key}`}
              className="bhat-btn bhat-btn-ghost"
              style={{ borderRadius:999, padding:'6px 12px', fontSize:12,
                background: filter === f.key ? 'var(--accent)' : 'var(--bg-2)',
                color: filter === f.key ? 'white' : 'var(--text-2)',
                borderColor: filter === f.key ? 'var(--accent)' : 'var(--border)',
              }}>{f.label}</Link>
          ))}
          <div style={{ marginLeft:'auto', fontSize:12, color:'var(--text-3)' }}>
            Filtered: <strong>{rows.length}</strong> documents
          </div>
        </div>

        <div className="bhat-table">
          <div className="bhat-th" style={{ gridTemplateColumns: '2fr 1.4fr 1.4fr 1fr 1fr 110px' }}>
            <div>Document</div><div>Client</div><div>Stage</div>
            <div>Expires</div><div>Status</div><div>Action</div>
          </div>
          {rows.length === 0 && (
            <div style={{ padding:32, textAlign:'center', color:'var(--text-3)', fontSize:13 }}>
              No documents match this filter.
            </div>
          )}
          {rows.map(r => {
            const s = STATUS_LABELS[r.status] || { class:'ok', label: r.status };
            return (
              <div className="bhat-tr" key={r.id} style={{ gridTemplateColumns: '2fr 1.4fr 1.4fr 1fr 1fr 110px' }}>
                <div><strong>{r.label}</strong></div>
                <div>{r.clientName}</div>
                <div className="bhat-tt">{r.stage}</div>
                <div className="bhat-tt">{r.expires || '—'}</div>
                <div><span className={`bhat-pill ${s.class}`}>{s.label}</span></div>
                <div>
                  <Link href={`/bhat/clients/${r.clientId}`} className="bhat-btn bhat-btn-ghost" style={{ padding:'4px 10px', fontSize:11 }}>
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BhatLayout>
  );
}

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx);
  if (guard.redirect) return { redirect: guard.redirect };
  const user = guard.user;

  await connectDB();
  const filter = (ctx.query.filter || 'all').toString();

  // Sub-admin: only their assigned clients
  let clientFilter = {};
  if (user.role === 'sub_admin') {
    const me = await BhatUser.findById(user.id).lean();
    clientFilter = { _id: { $in: me?.assignedClients || [] } };
  } else if (user.currentCountry) {
    clientFilter = { country: user.currentCountry };
  }
  const clients = await BhatClient.find(clientFilter).lean();
  const clientIds = clients.map(c => c._id);
  const clientMap = Object.fromEntries(clients.map(c => [c._id.toString(), c]));

  const all = await BhatDocument.find({ client: { $in: clientIds } }).lean();
  const total = all.length;

  const rows = all
    .map(d => {
      const c = clientMap[d.client.toString()];
      return {
        id: d._id.toString(),
        clientId: d.client.toString(),
        clientName: c?.fullName || '—',
        stage: STAGE_BY_KEY[c?.stage]?.label || '—',
        label: d.docType.replace(/_/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase()),
        expires: d.expiryDate ? new Date(d.expiryDate).toISOString().slice(0,10) : null,
        status: d.status === 'expired' ? 'expiring' : d.status,
      };
    })
    .filter(r => filter === 'all' || (filter === 'miss' && r.status === 'missing')
                                  || (filter === 'exp' && r.status === 'expiring')
                                  || (filter === 'ok' && r.status === 'ok'));

  return {
    props: {
      user, rows, total, filter,
      counts: { pipeline: clients.length, documents: total },
    },
  };
}
