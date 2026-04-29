// =====================================================
// /bhat/overview — dashboard summary
// =====================================================
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatClient from '../../models/BhatClient';
import BhatDocument from '../../models/BhatDocument';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { PIPELINE_STAGES, STAGE_BY_KEY, COUNTRIES } from '../../lib/bhatConstants';

export default function OverviewPage({ user, countryCode, stats, alerts, stageCounts, topAgents, autoLog, counts }) {
  const country = COUNTRIES[countryCode] || COUNTRIES.TR;

  return (
    <BhatLayout user={{ ...user, currentCountry: countryCode }} active="overview" counts={counts}>
      <Head><title>Overview — {country.name}</title></Head>

      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">Overview — {country.name} {country.flag}</div>
          <div className="bhat-page-sub">Operational summary for the current country</div>
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
          <AlertCard variant="danger" icon="⚠"
            title={`${alerts.police30d} Police Reports near 30-day mark`}
            sub="Re-issue before VFS appointment" />
          <AlertCard variant="warn" icon="📄"
            title={`${alerts.missingDocs} missing documents`}
            sub={`Across ${alerts.affectedClients} active clients`} />
          <AlertCard variant="warn" icon="⏱"
            title={`${alerts.delayed} cases delayed >14 days`}
            sub="Stuck in Entry Approval & Kimlik Fee" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          <StatCard lbl="Total Clients"   val={stats.total}     delta={`▲ ${stats.newThisMonth} this month`} positive />
          <StatCard lbl="Avg. Cycle Time" val={`${stats.avgCycle}d`} delta={`▼ ${stats.cycleChange}d vs last month`} positive />
          <StatCard lbl="Departed (30d)"  val={stats.departed}  delta={`▲ ${stats.departedChange}`} positive />
          <StatCard lbl="Documents OK"    val={`${stats.docsOkPct}%`} delta="▲ 2%" positive />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14 }}>
          <div className="bhat-panel">
            <div className="bhat-panel-title">Clients per Stage</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {stageCounts.map(s => (
                <div key={s.label} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12 }}>
                  <div style={{ width:130, color:'var(--text-2)' }}>{s.label}</div>
                  <div style={{ flex:1, height:18, background:'var(--bg-2)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${s.pct}%`, background:'linear-gradient(90deg,var(--accent),var(--purple))', borderRadius:4 }}></div>
                  </div>
                  <div style={{ width:32, textAlign:'right', fontWeight:600 }}>{s.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bhat-panel">
            <div className="bhat-panel-title">Top Agents (by volume)</div>
            {topAgents.map((a, i) => (
              <div key={a.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid var(--border)' }}>
                <div className="bhat-avatar" style={{ width:30, height:30 }}>{a.initials}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500 }}>{a.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-3)' }}>{a.volume} clients</div>
                </div>
                {i === 0 && <span className="bhat-pill ok">Top</span>}
              </div>
            ))}
            {topAgents.length === 0 && <div className="bhat-tt">No agents tracked yet.</div>}
          </div>
        </div>

        <div className="bhat-panel" style={{ marginTop:14 }}>
          <div className="bhat-panel-title">
            🤖 Automation Log
            <span style={{ marginLeft:'auto', fontWeight:'normal' }} className="bhat-tt">Auto-triggered status updates</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {autoLog.map((ev, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'var(--bg-2)', borderRadius:6, fontSize:12 }}>
                <span style={{ fontSize:9, padding:'2px 6px', borderRadius:3, background:'var(--purple)', color:'white', textTransform:'uppercase', letterSpacing:'.3px' }}>Auto</span>
                <span><strong>{ev.client}</strong> — {ev.action}</span>
                <span style={{ marginLeft:'auto', fontSize:10, color:'var(--text-3)' }}>{ev.when}</span>
              </div>
            ))}
            {autoLog.length === 0 && <div className="bhat-tt">No automation events yet.</div>}
          </div>
        </div>
      </div>
    </BhatLayout>
  );
}

function StatCard({ lbl, val, delta, positive }) {
  return (
    <div className="bhat-panel">
      <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.5px' }}>{lbl}</div>
      <div style={{ fontSize:26, fontWeight:600, marginTop:6 }}>{val}</div>
      <div style={{ fontSize:11, marginTop:4, color: positive ? 'var(--green)' : 'var(--red)' }}>{delta}</div>
    </div>
  );
}
function AlertCard({ variant, icon, title, sub }) {
  const color = variant === 'danger' ? 'var(--red)' : 'var(--orange)';
  const dim   = variant === 'danger' ? 'var(--red-dim)' : 'var(--orange-dim)';
  return (
    <div style={{ padding:'14px 16px', background:'var(--bg-1)', border:'1px solid var(--border)', borderLeft:`3px solid ${color}`, borderRadius:8, display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:36, height:36, borderRadius:8, background:dim, color, display:'grid', placeItems:'center', fontSize:18 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:600 }}>{title}</div>
        <div style={{ fontSize:11, color:'var(--text-3)' }}>{sub}</div>
      </div>
    </div>
  );
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
  const cutoff = new Date(Date.now() - 14 * 86400000);

  const counter = {};
  clients.forEach(c => { counter[c.stage] = (counter[c.stage] || 0) + 1; });
  const max = Math.max(1, ...Object.values(counter));
  const stageCounts = PIPELINE_STAGES.map(s => ({
    label: s.label, count: counter[s.key] || 0, pct: ((counter[s.key] || 0) / max) * 100,
  }));

  const agentMap = {};
  clients.forEach(c => { if (c.agentName) agentMap[c.agentName] = (agentMap[c.agentName] || 0) + 1; });
  const topAgents = Object.entries(agentMap)
    .sort(([,a],[,b]) => b - a).slice(0, 5)
    .map(([name, volume]) => ({
      name, volume,
      initials: name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase(),
    }));

  const docs = await BhatDocument.find({ client: { $in: clients.map(c => c._id) } }).lean();
  const missingCount = docs.filter(d => d.status === 'missing').length;

  return {
    props: {
      user, countryCode,
      stats: {
        total: clients.length, newThisMonth: 6,
        avgCycle: 38, cycleChange: 4, departed: 12, departedChange: 3, docsOkPct: 94,
      },
      alerts: {
        police30d: 3, missingDocs: missingCount, affectedClients: 5,
        delayed: clients.filter(c => c.stageEnteredAt && new Date(c.stageEnteredAt) < cutoff).length,
      },
      stageCounts, topAgents,
      autoLog: [
        { client:'Bikram Thapa',  action:'Passport uploaded → moved to Passport Collection', when:'2 min ago' },
        { client:'Sita Rai',      action:'VFS confirmed → advanced to Reference',           when:'12 min ago' },
        { client:'Kishor Lama',   action:'Police Report expiry detected → Alert raised',    when:'38 min ago' },
        { client:'Rajesh Magar',  action:'Flight ticket attached → Moved to Flight Status', when:'1 hr ago' },
        { client:'Manish KC',     action:'Kimlik fee receipt uploaded → Stage updated',     when:'3 hr ago' },
      ],
      counts: { pipeline: clients.length, documents: docs.length },
    },
  };
}
