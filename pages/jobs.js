import Layout from '../components/Layout';
import Link from 'next/link';

const industries = [
  {
    name: 'Construction', icon: '🏗️', color: '#CC2229',
    jobs: [
      { title: 'Licensed Welders (MIG/MAG/TIG)', location: 'București', positions: 15, type: 'temporary', duration: '12 months', accommodation: true, salary: '€800–1,100/month net', desc: 'Highway infrastructure and commercial building projects. Welding certification required.' },
      { title: 'Masons & Bricklayers', location: 'București & Cluj-Napoca', positions: 25, type: 'temporary', duration: '12 months', accommodation: true, salary: '€700–900/month net', desc: 'Bricklaying, plastering, and concrete work for residential and commercial construction.' },
      { title: 'Electricians', location: 'Timișoara', positions: 10, type: 'temporary', duration: '12 months', accommodation: true, salary: '€800–1,000/month net', desc: 'Industrial and residential electrical installation, wiring, and maintenance.' },
      { title: 'Crane Operators', location: 'București', positions: 5, type: 'temporary', duration: '12 months', accommodation: true, salary: '€900–1,200/month net', desc: 'Tower crane and mobile crane operation. Valid license required.' },
      { title: 'Carpenters & Formwork Workers', location: 'Brașov', positions: 20, type: 'temporary', duration: '12 months', accommodation: true, salary: '€700–900/month net', desc: 'Formwork assembly, scaffolding, and carpentry for construction projects.' },
      { title: 'Plumbers & Pipe Fitters', location: 'București', positions: 8, type: 'temporary', duration: '12 months', accommodation: true, salary: '€800–1,000/month net', desc: 'Water, heating, and gas piping installation and maintenance.' },
      { title: 'Painters & Finishers', location: 'Cluj-Napoca & Brașov', positions: 12, type: 'temporary', duration: '12 months', accommodation: true, salary: '€650–850/month net', desc: 'Interior/exterior painting, plastering, and finishing work.' },
      { title: 'General Construction Laborers', location: 'Various Locations', positions: 30, type: 'temporary', duration: '12 months', accommodation: true, salary: '€600–750/month net', desc: 'Site preparation, material handling, concrete pouring, demolition, and cleanup.' },
    ]
  },
  {
    name: 'Manufacturing & Production', icon: '🏭', color: '#E8A817',
    jobs: [
      { title: 'CNC Machine Operators', location: 'Cluj-Napoca', positions: 12, type: 'permanent', duration: 'Permanent', accommodation: false, salary: '€800–1,000/month net', desc: 'CNC lathe and milling machine operation in automotive parts manufacturing.' },
      { title: 'Assembly Line Workers', location: 'Sibiu', positions: 30, type: 'temporary', duration: '12 months', accommodation: true, salary: '€650–800/month net', desc: 'Production line assembly, quality checking, and packaging in electronics and automotive.' },
      { title: 'Factory Machine Operators', location: 'Oradea', positions: 20, type: 'temporary', duration: '12 months', accommodation: true, salary: '€650–850/month net', desc: 'Industrial machinery operation in food processing and textile manufacturing.' },
      { title: 'Quality Control Inspectors', location: 'Timișoara', positions: 8, type: 'temporary', duration: '12 months', accommodation: true, salary: '€700–900/month net', desc: 'Product inspection, defect identification, and quality reporting.' },
      { title: 'Textile & Garment Workers', location: 'Iași', positions: 15, type: 'temporary', duration: '12 months', accommodation: true, salary: '€600–750/month net', desc: 'Sewing machine operation, cutting, and garment assembly in textile factories.' },
    ]
  },
  {
    name: 'Hospitality & Tourism', icon: '🍽️', color: '#CC2229',
    jobs: [
      { title: 'Cooks & Sous Chefs', location: 'Constanța & Black Sea Coast', positions: 15, type: 'seasonal', duration: '6 months (May–Oct)', accommodation: true, salary: '€700–1,000/month net', desc: 'Professional cooking in hotels and restaurants. International cuisine experience preferred.' },
      { title: 'Hotel Housekeeping Staff', location: 'Constanța & Brașov', positions: 20, type: 'seasonal', duration: '6 months', accommodation: true, salary: '€600–750/month net', desc: 'Room cleaning, laundry, and facility maintenance in 3–5 star hotels.' },
      { title: 'Waiters & Restaurant Staff', location: 'București', positions: 10, type: 'temporary', duration: '12 months', accommodation: false, salary: '€650–850/month net', desc: 'Table service, bar assistance, customer service. Basic English required.' },
      { title: 'Kitchen Helpers & Dishwashers', location: 'Various Locations', positions: 15, type: 'seasonal', duration: '6 months', accommodation: true, salary: '€550–700/month net', desc: 'Kitchen prep, food handling, dishwashing in hotel and restaurant kitchens.' },
      { title: 'Hotel Reception & Front Desk', location: 'București & Brașov', positions: 5, type: 'temporary', duration: '12 months', accommodation: false, salary: '€700–900/month net', desc: 'Guest check-in/out, reservations, customer service. English fluency required.' },
    ]
  },
  {
    name: 'Logistics & Warehousing', icon: '🚛', color: '#E8A817',
    jobs: [
      { title: 'Warehouse Operatives', location: 'București & Timișoara', positions: 25, type: 'temporary', duration: '12 months', accommodation: true, salary: '€650–800/month net', desc: 'Order picking, packing, loading/unloading in distribution and e-commerce warehouses.' },
      { title: 'Forklift Operators', location: 'Cluj-Napoca', positions: 8, type: 'temporary', duration: '12 months', accommodation: true, salary: '€700–900/month net', desc: 'Electric and diesel forklift operation. License required.' },
      { title: 'Professional Drivers (C+E)', location: 'Various Locations', positions: 10, type: 'permanent', duration: 'Permanent', accommodation: false, salary: '€900–1,300/month net', desc: 'Long-haul and regional truck driving. C+E license required. EU routes.' },
      { title: 'Package Sorters & Loaders', location: 'București', positions: 20, type: 'temporary', duration: '12 months', accommodation: true, salary: '€600–750/month net', desc: 'Sorting, scanning, loading in courier and logistics distribution centers.' },
    ]
  },
  {
    name: 'Agriculture & Food Processing', icon: '🌾', color: '#CC2229',
    jobs: [
      { title: 'Seasonal Agricultural Workers', location: 'Various Locations', positions: 40, type: 'seasonal', duration: '6 months (Apr–Oct)', accommodation: true, salary: '€600–750/month net', desc: 'Crop harvesting, greenhouse cultivation, fruit picking, general farm labor.' },
      { title: 'Livestock & Farm Workers', location: 'Rural Romania', positions: 10, type: 'temporary', duration: '12 months', accommodation: true, salary: '€600–800/month net', desc: 'Animal husbandry, milking, feeding, and livestock farm maintenance.' },
      { title: 'Food Processing Workers', location: 'Iași & Galați', positions: 15, type: 'temporary', duration: '12 months', accommodation: true, salary: '€650–800/month net', desc: 'Meat processing, bakery, dairy packaging, and food quality control.' },
      { title: 'Greenhouse Workers', location: 'Southern Romania', positions: 12, type: 'seasonal', duration: '8 months', accommodation: true, salary: '€600–750/month net', desc: 'Planting, cultivating, and harvesting in commercial greenhouse operations.' },
    ]
  },
  {
    name: 'Facility Services & Cleaning', icon: '🧹', color: '#E8A817',
    jobs: [
      { title: 'Industrial Cleaners', location: 'București', positions: 15, type: 'temporary', duration: '12 months', accommodation: false, salary: '€600–700/month net', desc: 'Cleaning offices, factories, shopping centers. Day and night shifts.' },
      { title: 'Building Maintenance Workers', location: 'București & Cluj-Napoca', positions: 8, type: 'temporary', duration: '12 months', accommodation: false, salary: '€650–800/month net', desc: 'General repairs, HVAC maintenance, plumbing fixes, facility upkeep.' },
    ]
  },
  {
    name: 'Healthcare & Social Care', icon: '🏥', color: '#CC2229',
    jobs: [
      { title: 'Care Assistants', location: 'București & Timișoara', positions: 10, type: 'permanent', duration: 'Permanent', accommodation: false, salary: '€700–900/month net', desc: 'Elderly care, patient assistance in retirement homes and care facilities.' },
      { title: 'Hospital Support Staff', location: 'Cluj-Napoca', positions: 8, type: 'temporary', duration: '12 months', accommodation: false, salary: '€650–800/month net', desc: 'Cleaning, porter duties, kitchen assistance in hospital environments.' },
    ]
  },
];

export default function Jobs() {
  const totalPositions = industries.reduce((t, ind) => t + ind.jobs.reduce((s, j) => s + j.positions, 0), 0);

  return (
    <Layout title="Job Listings by Industry" description="Current workforce demand in Romania organized by industry — construction, manufacturing, hospitality, agriculture, logistics, healthcare.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Jobs</span></div>
          <h1>Current Workforce Demand</h1>
          <p>{totalPositions}+ positions across {industries.length} industries. B2B placement — €2,500 per candidate, zero commission.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ background: '#FFF0F0', padding: '16px 24px', borderRadius: '10px', marginBottom: '30px' }}>
            <strong>For Employers:</strong> These reflect current Romanian market demand. <Link href="/employer-inquiry" style={{ fontWeight: 600 }}>Submit your requirements</Link> and we source candidates within 6–10 weeks. Zero cost for employers.
          </div>

          {industries.map((ind, idx) => (
            <div key={idx} style={{ marginBottom: '50px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid ' + ind.color }}>
                <span style={{ fontSize: '2rem' }}>{ind.icon}</span>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{ind.name}</h2>
                <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--gray-400)' }}>{ind.jobs.reduce((s, j) => s + j.positions, 0)} positions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ind.jobs.map((job, i) => (
                  <div className="job-card" key={i} style={{ padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span className={`job-badge badge-${job.type}`}>{job.type}</span>
                        </div>
                        <h4 style={{ marginBottom: '4px' }}>{job.title}</h4>
                        <p style={{ color: 'var(--gray-400)', fontSize: '0.85rem', marginBottom: '6px' }}>📍 {job.location} · {job.positions} positions · {job.duration}</p>
                        <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', lineHeight: '1.6' }}>{job.desc}</p>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '140px' }}>
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--blue)' }}>{job.salary}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: '4px' }}>🏠 {job.accommodation ? 'Accommodation included' : 'Self-arranged'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', padding: '40px', background: 'var(--off-white)', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '12px' }}>Total: {totalPositions}+ Positions Across {industries.length} Industries</h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: '20px' }}>Updated regularly. New positions added weekly.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/employer-inquiry" className="btn btn-primary btn-lg">Submit Employer Inquiry →</Link>
              <Link href="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
