import Layout from '../components/Layout';
import Link from 'next/link';

export default function Jobs() {
  const sampleJobs = [
    { title: 'Construction Workers', industry: 'Construction', location: 'București, Romania', positions: 20, type: 'temporary', duration: '12 months', accommodation: true, salary: '€700-900/month net' },
    { title: 'Factory Assembly Workers', industry: 'Manufacturing', location: 'Cluj-Napoca, Romania', positions: 15, type: 'temporary', duration: '12 months', accommodation: true, salary: '€650-800/month net' },
    { title: 'Hotel Housekeeping Staff', industry: 'Hospitality', location: 'Constanța, Romania', positions: 10, type: 'seasonal', duration: '6 months', accommodation: true, salary: '€600-700/month net' },
    { title: 'Warehouse Operatives', industry: 'Logistics', location: 'Timișoara, Romania', positions: 8, type: 'temporary', duration: '12 months', accommodation: false, salary: '€650-800/month net' },
    { title: 'Agricultural Workers', industry: 'Agriculture', location: 'Various Locations, Romania', positions: 25, type: 'seasonal', duration: '6 months', accommodation: true, salary: '€600-750/month net' },
    { title: 'Kitchen Helpers / Cooks', industry: 'Hospitality', location: 'București, Romania', positions: 5, type: 'permanent', duration: 'Permanent', accommodation: false, salary: '€700-1000/month net' },
  ];

  return (
    <Layout title="Job Listings" description="Browse available jobs in Romania for South Asian workers — construction, manufacturing, hospitality, agriculture, and more.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Jobs</span></div>
          <h1>Available Jobs</h1>
          <p>Browse current openings for South Asian workers in Romania.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ background: '#FEF3C7', padding: '16px 24px', borderRadius: 'var(--radius-md)', marginBottom: '30px', borderLeft: '4px solid var(--amber)' }}>
            <strong>Note:</strong> These are sample listings to demonstrate available position types. Actual openings are updated regularly. <Link href="/apply" style={{ fontWeight: 600 }}>Apply now</Link> and we'll match you with available positions.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sampleJobs.map((job, i) => (
              <div className="job-card" key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span className={`job-badge badge-${job.type}`}>{job.type}</span>
                      <span className="tag">{job.industry}</span>
                    </div>
                    <h3 style={{ marginBottom: '6px' }}>{job.title}</h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>📍 {job.location}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: 'var(--blue)' }}>{job.salary}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--gray-400)', marginTop: '4px' }}>{job.positions} positions · {job.duration}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--gray-100)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>🏠 Accommodation: {job.accommodation ? '✅ Provided' : '❌ Not included'}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>📋 Contract: {job.type === 'permanent' ? 'Direct Hire' : 'Temporary Staffing'}</span>
                </div>
                <Link href="/apply" className="btn btn-primary btn-sm" style={{ marginTop: '16px' }}>Apply for This Position →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="cta-banner">
            <h2>Don't See the Right Position?</h2>
            <p>New jobs are added regularly. Apply with your profile and we'll match you with suitable openings as they come in.</p>
            <Link href="/apply" className="btn btn-amber btn-lg">Submit Your Application →</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
