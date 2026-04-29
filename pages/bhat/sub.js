// =====================================================
// /bhat/sub — restricted dashboard for Sub-Admins
// =====================================================
import Link from 'next/link';
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatUser from '../../models/BhatUser';
import BhatClient from '../../models/BhatClient';
import BhatDocument from '../../models/BhatDocument';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { STAGE_BY_KEY } from '../../lib/bhatConstants';

export default function SubAdminDashboard({ user, clients }) {
  return (
    <BhatLayout user={user} active="documents">
      <Head><title>My Assigned Clients — BHAT Overseas</title></Head>
      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">My Assigned Clients</div>
          <div className="bhat-page-sub">Documents &amp; CV builder for {clients.length} assigned clients</div>
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>
        {clients.length === 0 ? (
          <div className="bhat-panel" style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:42, marginBottom:12 }}>📭</div>
            <h3 style={{ fontSize:15, marginBottom:6 }}>No clients assigned yet</h3>
            <p style={{ color:'var(--text-3)', fontSize:13 }}>
              An Admin or Super Admin will assign clients to you. They'll appear here.
            </p>
          </div>
        ) : (
          <div className="bhat-table">
            <div className="bhat-th" style={{ gridTemplateColumns:'1.5fr 1.2fr 1.5fr 0.8fr 1fr 1.2fr' }}>
              <div>Client</div><div>Ref No</div><div>Stage</div>
              <div>Progress</div><div>Documents</div><div>Action</div>
            </div>
            {clients.map(c => (
              <div className="bhat-tr" key={c.id} style={{ gridTemplateColumns:'1.5fr 1.2fr 1.5fr 0.8fr 1fr 1.2fr' }}>
                <div><strong>{c.name}</strong></div>
                <div className="bhat-tt">{c.refNo}</div>
                <div className="bhat-tt">{c.stageLabel}</div>
                <div>{c.progress}/14</div>
                <div>
                  <span className="bhat-pill ok">{c.docsOk} ✓</span>
                  {c.docsMissing > 0 && <span className="bhat-pill miss" style={{ marginLeft:4 }}>{c.docsMissing} ✕</span>}
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Link href={`/bhat/clients/${c.id}`} className="bhat-btn bhat-btn-ghost" style={{ padding:'4px 8px', fontSize:11 }}>View</Link>
                  <Link href={`/bhat/cv?client=${c.id}`} className="bhat-btn bhat-btn-primary" style={{ padding:'4px 8px', fontSize:11 }}>CV</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BhatLayout>
  );
}

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx);
  if (guard.redirect) return { redirect: guard.redirect };
  const user = guard.user;

  if (user.role !== 'sub_admin') {
    return { redirect: { destination: '/bhat/pipeline', permanent: false } };
  }

  await connectDB();
  const me = await BhatUser.findById(user.id).lean();
  const clientIds = me?.assignedClients || [];
  const clients = await BhatClient.find({ _id: { $in: clientIds } }).lean();

  const rows = await Promise.all(
    clients.map(async c => {
      const docs = await BhatDocument.find({ client: c._id }).lean();
      return {
        id: c._id.toString(),
        name: c.fullName, refNo: c.refNo,
        stageLabel: STAGE_BY_KEY[c.stage]?.label || c.stage,
        progress: c.progress,
        docsOk: docs.filter(d => d.status === 'ok').length,
        docsMissing: docs.filter(d => d.status === 'missing').length,
      };
    })
  );

  return { props: { user, clients: rows } };
}
