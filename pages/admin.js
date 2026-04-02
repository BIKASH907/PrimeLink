import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Admin() {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') : null;
    if (saved) setToken(saved);
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
      const data = await res.json();
      if (res.ok) { setToken(data.token); sessionStorage.setItem('adminToken', data.token); }
      else setLoginError(data.error || 'Login failed');
    } catch { setLoginError('Connection error'); }
  };

  const fetchData = async (endpoint, setter) => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setter(data); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) return;
    fetchData('/api/admin/dashboard', setStats);
    fetchData('/api/admin/applications', setApplications);
    fetchData('/api/admin/inquiries', setInquiries);
  }, [token]);

  const logout = () => { setToken(null); sessionStorage.removeItem('adminToken'); };

  if (!token) {
    return (
      <>
        <Head><title>Admin Login — Primelink Human Capital</title></Head>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1A1A2E', fontFamily: 'DM Sans, sans-serif' }}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1A1A2E' }}>Primelink Admin</h2>
            <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '24px', fontSize: '0.9rem' }}>Login to manage your platform</p>
            {loginError && <p style={{ color: '#CC2229', background: '#FFF0F0', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>{loginError}</p>}
            <form onSubmit={login}>
              <input type="email" placeholder="Email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #D1D6DE', fontSize: '0.95rem' }} required />
              <input type="password" placeholder="Password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #D1D6DE', fontSize: '0.95rem' }} required />
              <button type="submit" style={{ width: '100%', padding: '14px', background: '#CC2229', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Login</button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Admin Dashboard — Primelink Human Capital</title></Head>
      <div style={{ minHeight: '100vh', background: '#F5F6F8', fontFamily: 'DM Sans, sans-serif' }}>
        <header style={{ background: '#1A1A2E', color: '#fff', padding: '16px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Primelink Admin</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {['dashboard', 'applications', 'inquiries'].map(p => (
              <button key={p} onClick={() => { setPage(p); if (p === 'applications') fetchData('/api/admin/applications', setApplications); if (p === 'inquiries') fetchData('/api/admin/inquiries', setInquiries); }} style={{ padding: '8px 16px', background: page === p ? '#CC2229' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', textTransform: 'capitalize' }}>{p}</button>
            ))}
            <button onClick={logout} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>Logout</button>
          </div>
        </header>

        <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
          {loading && <p>Loading...</p>}

          {page === 'dashboard' && (
            <>
              <h2 style={{ marginBottom: '24px' }}>Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
                {[
                  { label: 'Applications', value: stats?.applications || 0, color: '#CC2229' },
                  { label: 'Employer Inquiries', value: stats?.inquiries || 0, color: '#E8A817' },
                  { label: 'Contact Messages', value: stats?.contacts || 0, color: '#16A34A' },
                  { label: 'Job Listings', value: stats?.jobs || 0, color: '#1A1A2E' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '8px' }}>{s.label}</p>
                    <h2 style={{ color: s.color, margin: 0 }}>{s.value}</h2>
                  </div>
                ))}
              </div>
            </>
          )}

          {page === 'applications' && (
            <>
              <h2 style={{ marginBottom: '24px' }}>Job Applications</h2>
              {applications.length === 0 ? <p style={{ color: '#6B7280' }}>No applications yet.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(Array.isArray(applications) ? applications : []).map((app, i) => (
                    <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <h4 style={{ marginBottom: '4px' }}>{app.fullName || app.name || 'Unknown'}</h4>
                          <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>{app.email} · {app.phone}</p>
                          <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>{app.nationality} · {app.position || app.jobTitle}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: app.status === 'approved' ? '#DCFCE7' : app.status === 'rejected' ? '#FFF0F0' : '#F5F6F8', color: app.status === 'approved' ? '#16A34A' : app.status === 'rejected' ? '#CC2229' : '#6B7280' }}>{app.status || 'pending'}</span>
                          <p style={{ color: '#8892A0', fontSize: '0.78rem', marginTop: '6px' }}>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ''}</p>
                        </div>
                      </div>
                      {app.message && <p style={{ marginTop: '10px', color: '#4B5563', fontSize: '0.9rem', background: '#F5F6F8', padding: '10px', borderRadius: '6px' }}>{app.message}</p>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {page === 'inquiries' && (
            <>
              <h2 style={{ marginBottom: '24px' }}>Employer Inquiries</h2>
              {inquiries.length === 0 ? <p style={{ color: '#6B7280' }}>No inquiries yet.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(Array.isArray(inquiries) ? inquiries : []).map((inq, i) => (
                    <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <h4 style={{ marginBottom: '4px' }}>{inq.companyName || inq.company || 'Unknown Company'}</h4>
                          <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>{inq.contactName || inq.name} · {inq.email}</p>
                          <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>{inq.industry} · {inq.workersNeeded || inq.numberOfWorkers} workers needed</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, background: '#F5F6F8', color: '#6B7280' }}>{inq.status || 'pending'}</span>
                          <p style={{ color: '#8892A0', fontSize: '0.78rem', marginTop: '6px' }}>{inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : ''}</p>
                        </div>
                      </div>
                      {inq.message && <p style={{ marginTop: '10px', color: '#4B5563', fontSize: '0.9rem', background: '#F5F6F8', padding: '10px', borderRadius: '6px' }}>{inq.message}</p>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
