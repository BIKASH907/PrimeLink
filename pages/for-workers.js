import Layout from '../components/Layout';
import Link from 'next/link';

export default function ForWorkers() {
  return (
    <Layout title="For Workers" description="Find legitimate jobs in Romania. We help workers from Nepal, India, Bangladesh, and Sri Lanka secure legal employment in Europe.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/services">Services</Link> / <span>For Workers</span></div>
          <h1>For Workers</h1>
          <p>Your legitimate pathway to employment in Romania and the European Union.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <div className="two-col-text">
              <p className="section-label">Your Opportunity</p>
              <h2>Work in Europe Through a Legal, Trusted Channel</h2>
              <p>Primelink Human Capital is a Romanian-registered company (CUI: 54386335) that helps workers from Nepal, India, Bangladesh, and Sri Lanka find real, well-paying jobs in Romania.</p>
              <p>We are NOT an illegal broker. We are a licensed staffing agency operating under Romanian law. Every placement comes with a proper work contract, work permit, and full legal protections under EU labor law.</p>
              <div style={{ background: 'var(--blue-pale)', padding: '20px', borderRadius: 'var(--radius-md)', marginTop: '20px', borderLeft: '4px solid var(--blue)' }}>
                <strong style={{ color: 'var(--navy)' }}>⚠️ Important:</strong>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                  We never charge workers illegal recruitment fees. Our costs are transparent and comply with the ILO Fair Recruitment Initiative. Be wary of agents who demand large upfront payments.
                </p>
              </div>
            </div>
            <div className="two-col-image">🌍</div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Available Sectors</p>
            <h2>Jobs Available in Romania</h2>
            <p>We recruit for a wide range of industries. Here are the most common positions:</p>
          </div>
          <div className="grid-4">
            {[
              { icon: '🏗️', title: 'Construction', roles: 'Mason, Welder, Electrician, Carpenter, Painter, General Laborer' },
              { icon: '🏭', title: 'Manufacturing', roles: 'Machine Operator, Assembly Worker, Quality Inspector, Technician' },
              { icon: '🍽️', title: 'Hospitality', roles: 'Cook, Kitchen Helper, Cleaner, Hotel Housekeeping, Waiter' },
              { icon: '🌾', title: 'Agriculture', roles: 'Farm Worker, Greenhouse Worker, Food Processing, Harvester' },
              { icon: '🚛', title: 'Logistics', roles: 'Warehouse Worker, Forklift Operator, Packer, Driver' },
              { icon: '🧹', title: 'Cleaning', roles: 'Industrial Cleaner, Office Cleaner, Facility Maintenance' },
              { icon: '🏥', title: 'Healthcare', roles: 'Care Assistant, Nursing Aid, Hospital Support Staff' },
              { icon: '🏪', title: 'Retail', roles: 'Stock Handler, Sales Assistant, Merchandiser' },
            ].map((s, i) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{s.icon}</div>
                  <h4 className="card-title" style={{ fontSize: '1rem' }}>{s.title}</h4>
                  <p className="card-text" style={{ fontSize: '0.82rem' }}>{s.roles}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">What You Get</p>
            <h2>Worker Benefits & Protections</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: '📋', title: 'Legal Work Contract', desc: 'Romanian employment contract with full labor law protections, including minimum wage guarantees.' },
              { icon: '🏥', title: 'Health Insurance', desc: 'Romanian national health insurance coverage from day one of employment.' },
              { icon: '💰', title: 'Fair Wages', desc: 'Competitive salaries paid directly to your Romanian bank account, with all taxes handled properly.' },
              { icon: '🏠', title: 'Accommodation Support', desc: 'Many employers provide accommodation. We help ensure it meets proper standards.' },
              { icon: '📞', title: 'Ongoing Support', desc: 'Our team in Romania supports you throughout your placement — translation, legal help, emergency contact.' },
              { icon: '🔄', title: 'Career Growth', desc: 'Opportunity to renew contracts, switch to permanent positions, and build a career in the EU.' },
            ].map((b, i) => (
              <div className="card" key={i}>
                <div className="card-body">
                  <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}>{b.icon}</div>
                  <h4 className="card-title">{b.title}</h4>
                  <p className="card-text">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Requirements</p>
            <h2>What You Need to Apply</h2>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {[
              'Valid passport (minimum 18 months validity remaining)',
              'Clean criminal record certificate from your home country',
              'Medical fitness certificate',
              'Relevant work experience or skills documentation',
              'Basic English communication ability (preferred but not always required)',
              'Willingness to work in Romania for the contract duration',
              'Age: 21–50 years (varies by employer)',
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: '1px solid var(--gray-100)', alignItems: 'center' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
                <span style={{ fontSize: '0.95rem' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Start Your Journey?</h2>
            <p>Apply now and take the first step toward a career in Europe.</p>
            <div className="cta-buttons">
              <Link href="/apply" className="btn btn-amber btn-lg">Apply Now →</Link>
              <Link href="/jobs" className="btn btn-white btn-lg">View Open Jobs</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
