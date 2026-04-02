import Layout from '../components/Layout';
import Link from 'next/link';

const industries = [
  {
    name: 'Construction', icon: '🏗️',
    jobs: [
      { title: 'Licensed Welders (MIG/MAG/TIG)', location: 'București', positions: 15, duration: '12 months', accommodation: true, salary: '€530–700/month net + accommodation + €100 food' },
      { title: 'Masons & Bricklayers', location: 'București & Cluj-Napoca', positions: 25, duration: '12 months', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
      { title: 'Electricians', location: 'Timișoara', positions: 10, duration: '12 months', accommodation: true, salary: '€530–650/month net + accommodation + €100 food' },
      { title: 'Crane Operators', location: 'București', positions: 5, duration: '12 months', accommodation: true, salary: '€560–800/month net + accommodation + €100 food' },
      { title: 'Carpenters & Formwork Workers', location: 'Brașov', positions: 20, duration: '12 months', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
      { title: 'Plumbers & Pipe Fitters', location: 'București', positions: 8, duration: '12 months', accommodation: true, salary: '€530–650/month net + accommodation + €100 food' },
      { title: 'Painters & Finishers', location: 'Cluj-Napoca & Brașov', positions: 12, duration: '12 months', accommodation: true, salary: '€530–560/month net + accommodation + €100 food' },
      { title: 'General Construction Laborers', location: 'Various Locations', positions: 30, duration: '12 months', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    ]
  },
  {
    name: 'Manufacturing & Production', icon: '🏭',
    jobs: [
      { title: 'CNC Machine Operators', location: 'Cluj-Napoca', positions: 12, duration: '12 months', accommodation: true, salary: '€530–650/month net + accommodation + €100 food' },
      { title: 'Assembly Line Workers', location: 'Sibiu', positions: 30, duration: '12 months', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
      { title: 'Factory Machine Operators', location: 'Oradea', positions: 20, duration: '12 months', accommodation: true, salary: '€530–560/month net + accommodation + €100 food' },
      { title: 'Quality Control Inspectors', location: 'Timișoara', positions: 8, duration: '12 months', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
      { title: 'Textile & Garment Workers', location: 'Iași', positions: 15, duration: '12 months', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    ]
  },
  {
    name: 'Hospitality & Tourism', icon: '🍽️',
    jobs: [
      { title: 'Cooks & Sous Chefs', location: 'Constanța & București', positions: 15, duration: '12 months', accommodation: true, salary: '€530–650/month net + accommodation + €100 food' },
      { title: 'Hotel Housekeeping Staff', location: 'Constanța & Brașov', positions: 20, duration: '12 months', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
      { title: 'Waiters & Restaurant Staff', location: 'București', positions: 10, duration: '12 months', accommodation: true, salary: '€530–560/month net + accommodation + €100 food' },
      { title: 'Kitchen Helpers & Dishwashers', location: 'Various Locations', positions: 15, duration: '12 months', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
      { title: 'Hotel Reception & Front Desk', location: 'București & Brașov', positions: 5, duration: '12 months', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
    ]
  },
  {
    name: 'Logistics & Warehousing', icon: '🚛',
    jobs: [
      { title: 'Warehouse Operatives', location: 'București & Timișoara', positions: 25, duration: '12 months', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
      { title: 'Forklift Operators', location: 'Cluj-Napoca', positions: 8, duration: '12 months', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
      { title: 'Professional Drivers (C+E)', location: 'Various Locations', positions: 10, duration: '12 months', accommodation: true, salary: '€560–800/month net + accommodation + €100 food' },
      { title: 'Package Sorters & Loaders', location: 'București', positions: 20, duration: '12 months', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    ]
  },
  {
    name: 'Agriculture & Food Processing', icon: '🌾',
    jobs: [
      { title: 'Agricultural Workers', location: 'Various Locations', positions: 30, duration: '12 months', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
      { title: 'Livestock & Farm Workers', location: 'Rural Romania', positions: 10, duration: '12 months', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
      { title: 'Food Processing Workers', location: 'Iași & Galați', positions: 15, duration: '12 months', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
      { title: 'Greenhouse Workers', location: 'Southern Romania', positions: 12, duration: '12 months', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    ]
  },
  {
    name: 'Facility Services & Cleaning', icon: '🧹',
    jobs: [
      { title: 'Industrial Cleaners', location: 'București', positions: 15, duration: '12 months', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
      { title: 'Building Maintenance Workers', location: 'București & Cluj-Napoca', positions: 8, duration: '12 months', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
    ]
  },
  {
    name: 'Healthcare & Social Care', icon: '🏥',
    jobs: [
      { title: 'Care Assistants', location: 'București & Timișoara', positions: 10, duration: '12 months', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
      { title: 'Hospital Support Staff', location: 'Cluj-Napoca', positions: 8, duration: '12 months', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
    ]
  },
];

export default function Jobs() {
  const totalPositions = industries.reduce((t, ind) => t + ind.jobs.reduce((s, j) => s + j.positions, 0), 0);

  return (
    <Layout title="Job Listings by Industry" description="Current workforce demand in Romania organized by industry. Zero recruitment cost for employers.">
      <section className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>Current Workforce Demand</h1>
          <p>{totalPositions}+ positions across {industries.length} industries. Zero recruitment cost for Romanian employers.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ background: '#FFF0F0', padding: '20px 24px', borderRadius: '10px', marginBottom: '40px' }}>
            <strong>For Romanian Employers:</strong> We supply pre-screened, documented workers from Asia and Africa directly to your business at zero recruitment cost. <Link href="/employer-inquiry" style={{ fontWeight: 600 }}>Submit your requirements →</Link>
          </div>

          <div style={{ background: 'var(--off-white)', padding: '20px 24px', borderRadius: '10px', marginBottom: '40px' }}>
            <strong>For Recruitment Partners (Asia & Africa):</strong> Partner with us to place your candidates in Romania. €2,500 per successful placement. <Link href="/contact" style={{ fontWeight: 600 }}>Become a Partner →</Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px', justifyContent: 'center' }}>
            {industries.map((ind, i) => {
              const count = ind.jobs.reduce((s, j) => s + j.positions, 0);
              return (
                <a key={i} href={'#' + ind.name.replace(/[^a-zA-Z]/g, '')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'var(--white)', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', fontSize: '0.9rem', color: 'var(--gray-700)', textDecoration: 'none' }}>
                  <span>{ind.icon}</span>
                  <span style={{ fontWeight: 600 }}>{ind.name}</span>
                  <span style={{ background: 'var(--blue)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>{count}</span>
                </a>
              );
            })}
          </div>

          {industries.map((ind, idx) => {
            const count = ind.jobs.reduce((s, j) => s + j.positions, 0);
            return (
              <div key={idx} id={ind.name.replace(/[^a-zA-Z]/g, '')} style={{ marginBottom: '50px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--blue)' }}>
                  <span style={{ fontSize: '2rem' }}>{ind.icon}</span>
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{ind.name}</h2>
                  <span style={{ background: 'var(--blue)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>{count} vacancies</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {ind.jobs.map((job, i) => (
                    <div className="job-card" key={i} style={{ padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ marginBottom: '4px' }}>{job.title}</h4>
                          <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginBottom: '6px' }}>📍 {job.location} · {job.positions} positions · {job.duration}</p>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '200px' }}>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--blue)' }}>{job.salary}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: '4px' }}>🏠 Accommodation included</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{ textAlign: 'center', padding: '40px', background: 'var(--off-white)', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '12px' }}>Total: {totalPositions}+ Positions Across {industries.length} Industries</h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: '8px' }}>Salary: Minimum €530/month net as per Romanian Labour Law 2026</p>
            <p style={{ color: 'var(--gray-500)', marginBottom: '8px' }}>All positions include accommodation + €100/month food allowance</p>
            <p style={{ color: 'var(--gray-500)', marginBottom: '20px' }}>Updated weekly. New positions added regularly.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/employer-inquiry" className="btn btn-primary btn-lg">I'm an Employer →</Link>
              <Link href="/contact" className="btn btn-amber btn-lg">I'm a Recruitment Partner →</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
