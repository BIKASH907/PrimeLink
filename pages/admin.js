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
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({ title: '', industry: 'Construction', location: '', positions: 1, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food', status: 'active' });

  const industries = ['Construction', 'Manufacturing', 'Hospitality', 'Logistics', 'Agriculture', 'Facility Services', 'Healthcare'];

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

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) { const data = await res.json(); setJobs(Array.isArray(data) ? data : data.jobs || []); }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!token) return;
    fetchData('/api/admin/dashboard', setStats);
    fetchData('/api/admin/applications', setApplications);
    fetchData('/api/admin/inquiries', setInquiries);
    fetchJobs();
  }, [token]);

  const logout = () => { setToken(null); sessionStorage.removeItem('adminToken'); };

  const resetJobForm = () => {
    setJobForm({ title: '', industry: 'Construction', location: '', positions: 1, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food', status: 'active' });
    setEditingJob(null);
    setShowJobForm(false);
  };

  const saveJob = async () => {
    try {
      if (editingJob) {
        await fetch(`/api/jobs/${editingJob._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(jobForm) });
      } else {
        await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(jobForm) });
      }
      await fetchJobs();
      resetJobForm();
    } catch (e) { console.error(e); }
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      await fetchJobs();
    } catch (e) { console.error(e); }
  };

  const editJob = (job) => {
    setJobForm({ title: job.title, industry: job.industry, location: job.location, positions: job.positions, duration: job.duration || '1 Year Contract + Work Permit', accommodation: job.accommodation !== false, salary: job.salary, status: job.status || 'active' });
    setEditingJob(job);
    setShowJobForm(true);
  };

  const btnStyle = (active) => ({ padding: '8px 16px', background: active ? '#CC2229' : 'transparent', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', textTransform: 'capitalize' });
  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D6DE', fontSize: '0.9rem', marginBottom: '12px' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', color: '#6B7280', marginBottom: '4px', fontWeight: 600 };

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

  const jobCount = jobs.length;
  const s = stats?.stats || stats || {};

  return (
    <>
      <Head><title>Admin Dashboard — Primelink Human Capital</title></Head>
      <div style={{ minHeight: '100vh', background: '#F5F6F8', fontFamily: 'DM Sans, sans-serif' }}>
        <header style={{ background: '#1A1A2E', color: '#fff', padding: '16px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>Primelink Admin</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {['dashboard', 'jobs', 'applications', 'inquiries'].map(p => (
              <button key={p} onClick={() => setPage(p)} style={btnStyle(page === p)}>{p}</button>
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
                  { label: 'Applications', value: s.totalApplications || 0, color: '#CC2229' },
                  { label: 'Employer Inquiries', value: s.totalInquiries || 0, color: '#E8A817' },
                  { label: 'Contact Messages', value: s.totalContacts || 0, color: '#16A34A' },
                  { label: 'Job Listings', value: jobCount, color: '#1A1A2E' },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }} onClick={() => { if (item.label === 'Job Listings') setPage('jobs'); if (item.label === 'Applications') setPage('applications'); if (item.label === 'Employer Inquiries') setPage('inquiries'); }}>
                    <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '8px' }}>{item.label}</p>
                    <h2 style={{ color: item.color, margin: 0 }}>{item.value}</h2>
                  </div>
                ))}
              </div>
            </>
          )}

          {page === 'jobs' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ margin: 0 }}>Job Listings ({jobCount})</h2>
                <button onClick={() => { resetJobForm(); setShowJobForm(true); }} style={{ padding: '10px 20px', background: '#CC2229', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>+ Add New Job</button>
              </div>

              {showJobForm && (
                <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>Job Title</label>
                      <input style={inputStyle} value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Licensed Welders" />
                    </div>
                    <div>
                      <label style={labelStyle}>Industry</label>
                      <select style={inputStyle} value={jobForm.industry} onChange={e => setJobForm({ ...jobForm, industry: e.target.value })}>
                        {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Location</label>
                      <input style={inputStyle} value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} placeholder="e.g. București" />
                    </div>
                    <div>
                      <label style={labelStyle}>Positions</label>
                      <input style={inputStyle} type="number" value={jobForm.positions} onChange={e => setJobForm({ ...jobForm, positions: parseInt(e.target.value) || 1 })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Salary</label>
                      <input style={inputStyle} value={jobForm.salary} onChange={e => setJobForm({ ...jobForm, salary: e.target.value })} placeholder="€530/month net + accommodation + €100 food" />
                    </div>
                    <div>
                      <label style={labelStyle}>Duration</label>
                      <input style={inputStyle} value={jobForm.duration} onChange={e => setJobForm({ ...jobForm, duration: e.target.value })} />
                    </div>
                    <div>
                      <label style={labelStyle}>Status</label>
                      <select style={inputStyle} value={jobForm.status} onChange={e => setJobForm({ ...jobForm, status: e.target.value })}>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                      <input type="checkbox" checked={jobForm.accommodation} onChange={e => setJobForm({ ...jobForm, accommodation: e.target.checked })} />
                      <label style={{ fontSize: '0.9rem' }}>Accommodation included</label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button onClick={saveJob} style={{ padding: '10px 24px', background: '#CC2229', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>{editingJob ? 'Update Job' : 'Add Job'}</button>
                    <button onClick={resetJobForm} style={{ padding: '10px 24px', background: '#E9ECF0', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              )}

              {industries.map(ind => {
                const indJobs = jobs.filter(j => j.industry === ind);
                if (indJobs.length === 0) return null;
                return (
                  <div key={ind} style={{ marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '12px', color: '#1A1A2E' }}>{ind} ({indJobs.reduce((s, j) => s + (j.positions || 0), 0)} positions)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {indJobs.map((job, i) => (
                        <div key={i} style={{ background: '#fff', padding: '16px 20px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <strong>{job.title}</strong>
                            <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: '4px 0 0' }}>📍 {job.location} · {job.positions} positions · {job.salary}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: job.status === 'active' ? '#DCFCE7' : '#FFF0F0', color: job.status === 'active' ? '#16A34A' : '#CC2229' }}>{job.status || 'active'}</span>
                            <button onClick={() => editJob(job)} style={{ padding: '6px 14px', background: '#E8A817', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                            <button onClick={() => deleteJob(job._id)} style={{ padding: '6px 14px', background: '#CC2229', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {page === 'applications' && (
            <>
              <h2 style={{ marginBottom: '24px' }}>Job Applications</h2>
              {(Array.isArray(applications) ? applications : applications?.recent?.applications || []).length === 0 ? <p style={{ color: '#6B7280' }}>No applications yet.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(Array.isArray(applications) ? applications : applications?.recent?.applications || []).map((app, i) => (
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
              {(Array.isArray(inquiries) ? inquiries : inquiries?.recent?.inquiries || []).length === 0 ? <p style={{ color: '#6B7280' }}>No inquiries yet.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(Array.isArray(inquiries) ? inquiries : inquiries?.recent?.inquiries || []).map((inq, i) => (
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
