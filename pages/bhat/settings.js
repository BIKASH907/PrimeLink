// =====================================================
// /bhat/settings — users + roles
// =====================================================
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatUser from '../../models/BhatUser';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';

const ROLE_BADGE = {
  super_admin: { label:'Super Admin', bg:'var(--purple)' },
  admin:       { label:'Admin',       bg:'var(--accent)' },
  sub_admin:   { label:'Sub-Admin',   bg:'var(--bg-3)', color:'var(--text-2)' },
};

export default function SettingsPage({ user, users }) {
  return (
    <BhatLayout user={user} active="settings">
      <Head><title>Settings — BHAT Overseas</title></Head>
      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">Settings &amp; Users</div>
          <div className="bhat-page-sub">Manage roles and permissions</div>
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>
        <div className="bhat-panel" style={{ marginBottom:18 }}>
          <div className="bhat-panel-title">Roles &amp; Permissions</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            <RoleCard title="Super Admin" bg="var(--purple)"
              text="Pipeline, Documents, Overview, CV Builder, User Management — full system control." />
            <RoleCard title="Admin" bg="var(--accent)"
              text="Same as Super Admin except cannot manage Super Admin users or change country list." />
            <RoleCard title="Sub-Admin" bg="var(--bg-3)" color="var(--text-2)"
              text="Restricted to documents only after assignment by an Admin / Super Admin. Can build CVs & upload docs." />
          </div>
        </div>

        <div className="bhat-panel">
          <div className="bhat-panel-title">User Accounts</div>
          <div className="bhat-table">
            <div className="bhat-th" style={{ gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1.2fr' }}>
              <div>Name</div><div>Email</div><div>Role</div><div>Country</div><div>Last Active</div>
            </div>
            {users.map(u => {
              const badge = ROLE_BADGE[u.role] || ROLE_BADGE.sub_admin;
              return (
                <div className="bhat-tr" key={u.id} style={{ gridTemplateColumns:'1.5fr 1.5fr 1fr 1fr 1.2fr' }}>
                  <div><strong>{u.name}</strong></div>
                  <div>{u.email}</div>
                  <div>
                    <span style={{ fontSize:10, padding:'2px 8px', borderRadius:4, fontWeight:500, textTransform:'uppercase', letterSpacing:'.3px',
                      background: badge.bg, color: badge.color || 'white' }}>{badge.label}</span>
                  </div>
                  <div>{u.country || '—'}</div>
                  <div className="bhat-tt">{u.lastActive}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </BhatLayout>
  );
}

function RoleCard({ title, bg, color, text }) {
  return (
    <div style={{ padding:14, background:'var(--bg-2)', borderRadius:8 }}>
      <span style={{ fontSize:10, padding:'2px 8px', borderRadius:4, fontWeight:500,
        textTransform:'uppercase', letterSpacing:'.3px', background:bg, color: color || 'white' }}>{title}</span>
      <p style={{ fontSize:12, color:'var(--text-2)', marginTop:8, marginBottom:0 }}>{text}</p>
    </div>
  );
}

const human = d => {
  if (!d) return 'Never';
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export async function getServerSideProps(ctx) {
  const guard = requireBhatUser(ctx, { minRole: 'admin' });
  if (guard.redirect) return { redirect: guard.redirect };
  const user = guard.user;

  await connectDB();
  const all = await BhatUser.find({}).lean();

  return {
    props: {
      user,
      users: all.map(u => ({
        id: u._id.toString(),
        name: u.name, email: u.email, role: u.role, country: u.country,
        lastActive: human(u.lastLoginAt),
      })),
    },
  };
}
