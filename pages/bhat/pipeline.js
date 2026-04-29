// =====================================================
// /bhat/pipeline — 14-stage Kanban for the picked country
// =====================================================
import Link from 'next/link';
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatClient from '../../models/BhatClient';
import BhatDocument from '../../models/BhatDocument';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { PIPELINE_STAGES, COUNTRIES } from '../../lib/bhatConstants';

export default function PipelinePage({ user, countryCode, stages, stats, counts }) {
  const country = COUNTRIES[countryCode] || COUNTRIES.TR;

  return (
    <BhatLayout user={{ ...user, currentCountry: countryCode }} active="pipeline" counts={counts}>
      <Head><title>Pipeline — {country.name}</title></Head>

      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">Recruitment Pipeline — {country.name} {country.flag}</div>
          <div className="bhat-page-sub">14-step workflow • Click a card for full client details</div>
        </div>
        <div className="bhat-page-actions">
          <Link href="/bhat/documents" className="bhat-btn bhat-btn-ghost">View Documents</Link>
          <Link href="/bhat/clients/new" className="bhat-btn bhat-btn-primary">+ New Client</Link>
        </div>
      </div>

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
              {stage.clients.map(c => (
                <Link key={c.id} href={`/bhat/clients/${c.id}`} className={`bhat-card ${c.isUrgent ? 'urgent' : ''}`}>
                  {c.isUrgent && <span className="bhat-urgent-flag">🚩</span>}
                  <div className="bhat-card-name">{c.fullName}</div>
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
                </Link>
              ))}
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
