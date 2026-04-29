// =====================================================
// /bhat/settings — users + roles management
// Super-Admin / Admin can: add user, edit, reset password, delete (super-only)
// =====================================================
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import connectDB from '../../lib/db';
import BhatUser from '../../models/BhatUser';
import BhatLayout from '../../components/bhat/BhatLayout';
import { requireBhatUser } from '../../lib/bhatAuth';
import { COUNTRIES } from '../../lib/bhatConstants';

const ROLE_BADGE = {
  super_admin: { label:'Super Admin', bg:'var(--purple)' },
  admin:       { label:'Admin',       bg:'var(--accent)' },
  sub_admin:   { label:'Sub-Admin',   bg:'var(--bg-3)', color:'var(--text-2)' },
};

export default function SettingsPage({ user, users }) {
  const router = useRouter();
  const isSuper = user.role === 'super_admin';

  // Add user form
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({
    name:'', email:'', password:'', role:'sub_admin', country:'TR',
  });

  // Edit / reset password
  const [editing, setEditing] = useState(null);   // user id
  const [edit, setEdit]       = useState({ name:'', email:'', role:'', country:'' });
  const [reset, setReset]     = useState({ id:null, value:'' });

  async function createUser(e) {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return alert('Fill all fields');
    const r = await fetch('/api/bhat/users', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(newUser),
    });
    const data = await r.json();
    if (!r.ok) return alert(data.error || 'Create failed');
    setShowAdd(false);
    setNewUser({ name:'', email:'', password:'', role:'sub_admin', country:'TR' });
    router.replace(router.asPath);
  }

  function startEdit(u) {
    setEditing(u.id);
    setEdit({ name:u.name, email:u.email, role:u.role, country:u.country || '' });
  }
  async function saveEdit(id) {
    const r = await fetch(`/api/bhat/users/${id}`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(edit),
    });
    const data = await r.json();
    if (!r.ok) return alert(data.error || 'Update failed');
    setEditing(null);
    router.replace(router.asPath);
  }

  async function doReset(id) {
    if (!reset.value || reset.value.length < 8) return alert('New password must be at least 8 characters');
    const r = await fetch(`/api/bhat/users/${id}`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ resetPassword: reset.value }),
    });
    const data = await r.json();
    if (!r.ok) return alert(data.error || 'Password reset failed');
    alert(`Password reset. New password: ${reset.value}\n\n(Tell the user securely.)`);
    setReset({ id:null, value:'' });
  }

  async function doDelete(id, name) {
    if (!confirm(`Permanently delete user "${name}"? This can't be undone.`)) return;
    const r = await fetch(`/api/bhat/users/${id}`, { method:'DELETE' });
    if (!r.ok) {
      const data = await r.json();
      return alert(data.error || 'Delete failed');
    }
    router.replace(router.asPath);
  }

  return (
    <BhatLayout user={user} active="settings">
      <Head><title>Settings — BHAT Overseas</title></Head>
      <div className="bhat-page-head">
        <div>
          <div className="bhat-page-title">Settings &amp; Users</div>
          <div className="bhat-page-sub">Manage roles, permissions, and user accounts</div>
        </div>
        <div className="bhat-page-actions">
          <button className="bhat-btn bhat-btn-primary" onClick={() => setShowAdd(v => !v)}>
            {showAdd ? 'Close' : '+ Add User'}
          </button>
        </div>
      </div>

      <div style={{ padding:'22px 24px' }}>

        {/* Add user form */}
        {showAdd && (
          <form onSubmit={createUser} className="bhat-panel" style={{ marginBottom:18 }}>
            <div className="bhat-panel-title">+ Add New User</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="bhat-form-group">
                <label>Full Name</label>
                <input type="text" required value={newUser.name}
                  onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="bhat-form-group">
                <label>Email (login)</label>
                <input type="email" required value={newUser.email}
                  onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="bhat-form-group">
                <label>Initial Password (min 8)</label>
                <input type="text" required minLength={8} value={newUser.password}
                  onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))}
                  placeholder="They can change it after first login" />
              </div>
              <div className="bhat-form-group">
                <label>Role</label>
                <select value={newUser.role}
                  onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>
                  <option value="sub_admin">Sub-Admin</option>
                  <option value="admin">Admin</option>
                  {isSuper && <option value="super_admin">Super Admin</option>}
                </select>
              </div>
              <div className="bhat-form-group">
                <label>Country</label>
                <select value={newUser.country}
                  onChange={e => setNewUser(p => ({ ...p, country: e.target.value }))}>
                  <option value="TR">🇹🇷 Turkey</option>
                  <option value="RO">🇷🇴 Romania</option>
                  {isSuper && <option value="">All countries (super only)</option>}
                </select>
              </div>
            </div>
            <button className="bhat-btn bhat-btn-primary" type="submit">Create User</button>
          </form>
        )}

        {/* Roles overview */}
        <div className="bhat-panel" style={{ marginBottom:18 }}>
          <div className="bhat-panel-title">Roles &amp; Permissions</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            <RoleCard title="Super Admin" bg="var(--purple)"
              text="Pipeline, Documents, Overview, CV Builder, Finance, User Management — full control." />
            <RoleCard title="Admin" bg="var(--accent)"
              text="Same as Super Admin except cannot manage Super Admin users or change country scope." />
            <RoleCard title="Sub-Admin" bg="var(--bg-3)" color="var(--text-2)"
              text="Restricted to assigned clients only. Can build CVs &amp; upload docs for those clients." />
          </div>
        </div>

        {/* Users table */}
        <div className="bhat-panel">
          <div className="bhat-panel-title">User Accounts ({users.length})</div>
          <div className="bhat-table">
            <div className="bhat-th" style={{ gridTemplateColumns: '1.4fr 1.6fr 1fr 1fr 0.9fr 1.2fr' }}>
              <div>Name</div><div>Email</div><div>Role</div><div>Country</div><div>Last Active</div><div>Actions</div>
            </div>
            {users.map(u => {
              const badge = ROLE_BADGE[u.role] || ROLE_BADGE.sub_admin;
              const isMe  = u.id === user.id;
              const isThisEditing = editing === u.id;
              const isResettingMe = reset.id === u.id;
              return (
                <div className="bhat-tr" key={u.id} style={{ gridTemplateColumns:'1.4fr 1.6fr 1fr 1fr 0.9fr 1.2fr' }}>
                  {isThisEditing ? (
                    <>
                      <div><input value={edit.name} onChange={e => setEdit(p => ({ ...p, name: e.target.value }))} style={{ width:'100%' }} /></div>
                      <div><input value={edit.email} onChange={e => setEdit(p => ({ ...p, email: e.target.value }))} style={{ width:'100%' }} /></div>
                      <div>
                        {isSuper ? (
                          <select value={edit.role} onChange={e => setEdit(p => ({ ...p, role: e.target.value }))} style={{ width:'100%', padding:'4px 6px', fontSize:11 }}>
                            <option value="sub_admin">Sub-Admin</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        ) : <span style={{ fontSize:11 }}>{badge.label}</span>}
                      </div>
                      <div>
                        {isSuper ? (
                          <select value={edit.country} onChange={e => setEdit(p => ({ ...p, country: e.target.value }))} style={{ width:'100%', padding:'4px 6px', fontSize:11 }}>
                            <option value="">All</option><option value="TR">TR</option><option value="RO">RO</option>
                          </select>
                        ) : <span style={{ fontSize:11 }}>{u.country || 'All'}</span>}
                      </div>
                      <div></div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="bhat-btn bhat-btn-primary" style={{ padding:'4px 8px', fontSize:11 }} onClick={() => saveEdit(u.id)}>Save</button>
                        <button className="bhat-btn bhat-btn-ghost"   style={{ padding:'4px 8px', fontSize:11 }} onClick={() => setEditing(null)}>Cancel</button>
                      </div>
                    </>
                  ) : isResettingMe ? (
                    <>
                      <div><strong>{u.name}</strong>{isMe && <span className="bhat-tt"> (you)</span>}</div>
                      <div className="bhat-tt">{u.email}</div>
                      <div style={{ gridColumn: 'span 3' }}>
                        <input type="text" value={reset.value} placeholder="New password (min 8 chars)"
                          onChange={e => setReset(p => ({ ...p, value: e.target.value }))}
                          style={{ width:'100%' }} autoFocus />
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="bhat-btn bhat-btn-primary" style={{ padding:'4px 8px', fontSize:11 }} onClick={() => doReset(u.id)}>Reset</button>
                        <button className="bhat-btn bhat-btn-ghost"   style={{ padding:'4px 8px', fontSize:11 }} onClick={() => setReset({ id:null, value:'' })}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div><strong>{u.name}</strong>{isMe && <span className="bhat-tt"> (you)</span>}</div>
                      <div>{u.email}</div>
                      <div>
                        <span style={{ fontSize:10, padding:'2px 8px', borderRadius:4, fontWeight:500, textTransform:'uppercase', letterSpacing:'.3px',
                          background: badge.bg, color: badge.color || 'white' }}>{badge.label}</span>
                      </div>
                      <div>{u.country || '—'}</div>
                      <div className="bhat-tt">{u.lastActive}</div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="bhat-btn bhat-btn-ghost" style={{ padding:'4px 8px', fontSize:11 }} onClick={() => startEdit(u)}>Edit</button>
                        <button className="bhat-btn bhat-btn-ghost" style={{ padding:'4px 8px', fontSize:11, color:'var(--orange)' }} onClick={() => setReset({ id:u.id, value:'' })}>🔑 Reset Pwd</button>
                        {isSuper && !isMe && (
                          <button className="bhat-btn bhat-btn-ghost" style={{ padding:'4px 8px', fontSize:11, color:'var(--red)' }} onClick={() => doDelete(u.id, u.name)}>🗑</button>
                        )}
                      </div>
                    </>
                  )}
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
