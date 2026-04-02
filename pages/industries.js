import Layout from '../components/Layout';
import Link from 'next/link';

export default function Industries() {
  const industries = [
    { icon: '🏗️', title: 'Construction & Building', desc: 'Romania\'s construction sector is booming with infrastructure projects, residential development, and commercial builds. We supply masons, welders, electricians, plumbers, carpenters, painters, general laborers, and site supervisors.', positions: '50+', demand: 'Very High' },
    { icon: '🏭', title: 'Manufacturing & Production', desc: 'From automotive to textiles, Romania\'s manufacturing base needs assembly line workers, machine operators, quality inspectors, technicians, and production supervisors.', positions: '40+', demand: 'High' },
    { icon: '🍽️', title: 'Hospitality & Tourism', desc: 'Hotels, restaurants, and resorts across Romania need cooks, kitchen helpers, hotel housekeeping, reception staff, waiters, and facility maintenance workers.', positions: '30+', demand: 'High' },
    { icon: '🌾', title: 'Agriculture & Food Processing', desc: 'Seasonal and year-round positions in farming, greenhouse operations, livestock management, food processing plants, and agricultural packaging.', positions: '25+', demand: 'Seasonal' },
    { icon: '🚛', title: 'Logistics & Warehousing', desc: 'E-commerce growth drives demand for warehouse workers, forklift operators, packers, sorters, drivers, and supply chain coordinators.', positions: '20+', demand: 'Growing' },
    { icon: '🏥', title: 'Healthcare & Social Care', desc: 'Care assistants, nursing aids, hospital support staff, elderly care workers, and medical facility maintenance.', positions: '15+', demand: 'High' },
    { icon: '🧹', title: 'Facility Services & Cleaning', desc: 'Industrial cleaning, commercial property maintenance, security personnel, and general facility management staff.', positions: '20+', demand: 'Steady' },
    { icon: '🏪', title: 'Retail & Commerce', desc: 'Stock handlers, sales assistants, cashiers, merchandisers, and warehouse-to-store logistics staff for Romania\'s growing retail sector.', positions: '15+', demand: 'Moderate' },
  ];

  return (
    <Layout title="Industries We Serve" description="We supply workforce across Romania's highest-demand industries — construction, manufacturing, hospitality, agriculture, logistics, and more.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Industries</span></div>
          <h1>Industries We Serve</h1>
          <p>Comprehensive workforce solutions for Romania's key economic sectors.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {industries.map((ind, i) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '30px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{ind.icon}</div>
                    <div>
                      <h3 style={{ marginBottom: '8px' }}>{ind.title}</h3>
                      <p style={{ color: 'var(--gray-500)', lineHeight: '1.7' }}>{ind.desc}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '120px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>Demand</div>
                    <span className="tag">{ind.demand}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Don't See Your Industry?</h2>
            <p>We can source workers for virtually any sector. Contact us with your requirements.</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Request Workers</Link>
              <Link href="/contact" className="btn btn-white btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
