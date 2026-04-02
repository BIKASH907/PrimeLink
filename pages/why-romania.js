import Layout from '../components/Layout';
import Link from 'next/link';

export default function WhyRomania() {
  return (
    <Layout title="Why Romania" description="Discover why Romania is an excellent destination for Asian and African workers — EU membership, growing economy, and great quality of life.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Why Romania</span></div>
          <h1>Why Work in Romania?</h1>
          <p>An EU member state with a growing economy, affordable living, and excellent opportunities.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Romania at a Glance</p>
            <h2>Europe's Rising Star</h2>
          </div>
          <div className="stats-bar">
            {[
              { value: 'EU', label: 'Member Since 2007' },
              { value: '19M', label: 'Population' },
              { value: '€15.8K', label: 'GDP Per Capita' },
              { value: '4.8%', label: 'GDP Growth Rate' },
            ].map((s, i) => (
              <div className="stat-item" key={i}>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="grid-3">
            {[
              { icon: '🇪🇺', title: 'EU Membership', desc: 'Romania is a full EU member. Working here means EU-level labor protections, health insurance, and the potential pathway to long-term residency.' },
              { icon: '💰', title: 'Competitive Salaries', desc: 'While wages are lower than Western Europe, they are significantly higher than Asian and African averages — and the cost of living is much lower than Germany or France.' },
              { icon: '🏠', title: 'Affordable Living', desc: 'Rent, food, and daily expenses are among the lowest in the EU. Workers can save a significant portion of their earnings to send home.' },
              { icon: '🌡️', title: 'Good Climate', desc: 'Romania has four distinct seasons with warm summers and snowy winters. A varied landscape from the Black Sea coast to the Carpathian mountains.' },
              { icon: '🤝', title: 'Welcoming Culture', desc: 'Romanians are known for their hospitality. A growing international community makes integration easier for Asian and African workers.' },
              { icon: '📈', title: 'Growing Economy', desc: 'Romania has one of the EU\'s fastest-growing economies, meaning more jobs, more investment, and more opportunities year after year.' },
              { icon: '🏗️', title: 'Labor Demand', desc: 'Massive labor shortages across construction, manufacturing, agriculture, and hospitality mean strong job security and consistent work.' },
              { icon: '✈️', title: 'Travel Hub', desc: 'Romania\'s location in Southeast Europe provides easy access to the rest of the EU. Direct flights connect Bucharest to most European capitals.' },
              { icon: '📚', title: 'Skills Development', desc: 'Working in Romania means gaining European work experience, new skills, and certifications recognized across the EU.' },
            ].map((b, i) => (
              <div className="card" key={i}>
                <div className="card-body">
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{b.icon}</div>
                  <h4 className="card-title">{b.title}</h4>
                  <p className="card-text">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Start Your European Journey?</h2>
            <p>Apply today and take the first step toward a career in Romania.</p>
            <div className="cta-buttons">
              <Link href="/apply" className="btn btn-amber btn-lg">Apply Now →</Link>
              <Link href="/jobs" className="btn btn-white btn-lg">View Open Positions</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
