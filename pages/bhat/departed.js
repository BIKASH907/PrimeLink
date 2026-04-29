// =====================================================
// /bhat/departed — Departed candidates (after flight)
// Shows clients with stage='departed' along with their documents.
// Read-only-ish: admin can still view, but candidates won't appear in
// the active pipeline / documents views.
// =====================================================
import Link from 'next/link';
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatClient from '../../models/BhatClient';
import BhatDocument from '../../models/BhatDocument';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { COUNTRIES } from '../../lib/bhatConstants';

export default function DepartedPage({ user, countryCode, byCompany, totalDeparted, counts }) {
  const country = COUNTRIES[countryCode] || COUNTRIES.TR;
  return (
    <BhatLayout user={user} active="departed" counts={counts}>
      <Head><title>Departed Candidates — BHAT Overseas</title></Head>

      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">✈ Departed Candidates — {country.name} {country.flag}</div>
          <div className="bhat-page-sub">{totalDeparted} candidate{totalDeparted !== 1 ? 's' : ''} have flown out · grouped by company</div>
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>
        {totalDeparted === 0 ? (
          <div className="bhat-panel" style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:42, marginBottom:12 }}>✈</div>
            <div style={{ fontSize:14, marginBottom:6 }}>No candidates have departed yet</div>
            <div style={{ fontSize:12, color:'var(--text-3)' }}>
              When a client reaches Flight Status, click "✈ Mark Departed" on their detail page.
            </div>
          </div>
        ) : (
          Object.entries(byCompany).map(([company, items]) => (
            <div key={company} className="bhat-panel" style={{ marginBottom:14 }}>
              <div className="bhat-panel-title">
                📁 {company}
                <span className="bhat-tt" style={{ marginLeft:'auto' }}>
                  {items.length} candidate{items.length !== 1 ? 's' : ''} · {items.reduce((sum, c) => sum + c.fileCount, 0)} files
                </span>
              </div>
              <div className="bhat-table">
                <div className="bhat-th" style={{ gridTemplateColumns: '1.4fr 1.2fr 1fr 1fr 1fr 100px' }}>
                  <div>Candidate</div><div>Ref No</div><div>Country</div>
                  <div>Departed On</div><div>Files</div><div>Action</div>
                </div>
                {items.map(c => (
                  <div className="bhat-tr" key={c.id} style={{ gridTemplateColumns:'1.4fr 1.2fr 1fr 1fr 1fr 100px' }}>
                    <div><strong>{c.name}</strong></div>
                    <div className="bhat-tt">{c.refNo}</div>
                    <div>{COUNTRIES[c.country]?.flag} {COUNTRIES[c.country]?.name}</div>
                    <div className="bhat-tt">{c.departedOn}</div>
                    <div>
                      <span className="bhat-pill ok">{c.fileCount} files</span>
                    </div>
                    <div>
                      <Link href={`/bhat/clients/${c.id}`}
                        className="bhat-btn bhat-btn-ghost"
                        style={{ padding:'4px 10px', fontSize:11 }}>View →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </BhatLayout>
  );
}

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx);
  if (guard.redirect) return { redirect: guard.redirect };
  const user = guard.user;

  await connectDB();
  const countryCode = user.currentCountry || 'TR';

  const departed = await BhatClient.find({
    country: countryCode, stage: 'departed',
  }).sort({ stageEnteredAt: -1 }).lean();

  const docs = await BhatDocument.find({
    client: { $in: departed.map(c => c._id) },
    archivedAt: null,
  }).lean();

  const byCompany = {};
  for (const c of departed) {
    const co = c.company || 'Unassigned';
    if (!byCompany[co]) byCompany[co] = [];
    byCompany[co].push({
      id: c._id.toString(),
      name: c.fullName,
      refNo: c.refNo,
      country: c.country,
      departedOn: c.stageEnteredAt
        ? new Date(c.stageEnteredAt).toISOString().slice(0, 10)
        : '—',
      fileCount: docs.filter(d => d.client.toString() === c._id.toString()).length,
    });
  }

  // Sidebar counts: only count active (non-departed) clients in "pipeline"
  const totalClients = await BhatClient.countDocuments({ country: countryCode });
  const activeCount  = totalClients - departed.length;
  const docCount     = await BhatDocument.countDocuments({ archivedAt: null });

  return {
    props: {
      user, countryCode,
      byCompany,
      totalDeparted: departed.length,
      counts: { pipeline: activeCount, documents: docCount },
    },
  };
}
