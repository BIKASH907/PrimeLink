import Layout from '../components/Layout';
import Link from 'next/link';

export default function Services() {
  const caenCodes = [
    { code: '7820', name: 'Temporary Staffing & HR Supply', primary: true },
    { code: '7810', name: 'Permanent Placement Agency' },
    { code: '7020', name: 'Business & Management Consulting' },
    { code: '4619', name: 'Trade Intermediation — Diverse Products' },
    { code: '4690', name: 'Non-Specialized Wholesale' },
    { code: '4711', name: 'Retail — Predominantly Food, Beverages & Tobacco' },
    { code: '4712', name: 'Retail — Predominantly Non-Food Products' },
    { code: '4791', name: 'Non-Specialized Retail Intermediation' },
    { code: '4792', name: 'Specialized Retail Intermediation' },
    { code: '5210', name: 'Warehousing & Storage' },
    { code: '5520', name: 'Holiday & Short-Stay Accommodation' },
    { code: '5540', name: 'Accommodation Intermediation' },
    { code: '5590', name: 'Other Accommodation Services' },
    { code: '8110', name: 'Combined Support Services' },
    { code: '8210', name: 'Secretarial & Administrative Support' },
    { code: '8240', name: 'Business Support Intermediation' },
    { code: '8299', name: 'Other Business Support Services' },
    { code: '8559', name: 'Other Education Services' },
  ];

  return (
    <Layout title="Our Services" description="Comprehensive staffing and recruitment services — temporary staffing, permanent placement, and workforce management for Romanian businesses.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Services</span></div>
          <h1>Our Services</h1>
          <p>Comprehensive workforce solutions licensed across 18 CAEN activity codes.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Core Services</p>
            <h2>What We Offer</h2>
          </div>
          <div className="grid-3">
            {[
              { icon: '👥', title: 'Temporary Staffing (CAEN 7820)', desc: 'Our primary service. We supply temporary workers to Romanian companies under Munca Temporară contracts. Workers are employed by us and assigned to your worksite. Flexible durations — seasonal, project-based, or ongoing.', link: '/for-employers' },
              { icon: '🎯', title: 'Permanent Placement (CAEN 7810)', desc: 'Need to hire directly? We source, screen, and present candidates from South Asia for permanent positions in your company. Full recruitment service with post-placement support.', link: '/for-employers' },
              { icon: '📑', title: 'Work Permit & Visa Processing', desc: 'We handle the entire immigration documentation process — from obtaining aviz de muncă (work permits) through IGI to coordinating long-stay visa applications at Romanian embassies.', link: '/recruitment-process' },
              { icon: '✈️', title: 'Travel & Relocation', desc: 'We coordinate worker travel from South Asia to Romania, including flights, airport pickup, initial accommodation, and cultural orientation upon arrival.', link: '/recruitment-process' },
              { icon: '📋', title: 'Compliance & Documentation', desc: 'All contracts, tax registrations, social contributions, and labor law compliance handled by our team — protecting both employers and workers.', link: '/for-employers' },
              { icon: '🏢', title: 'Business Consulting (CAEN 7020)', desc: 'Advisory services on international recruitment strategy, Romanian labor market, workforce planning, and compliance with Romanian employment law.', link: '/contact' },
            ].map((s, i) => (
              <div className="card" key={i}>
                <div className="card-body">
                  <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{s.icon}</div>
                  <h4 className="card-title">{s.title}</h4>
                  <p className="card-text">{s.desc}</p>
                  <Link href={s.link} className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>Learn More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Licensed Activities</p>
            <h2>Our CAEN Activity Codes</h2>
            <p>Primelink Human Capital S.R.L. is authorized to operate across 18 CAEN codes, as registered with the Romanian Trade Registry.</p>
          </div>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>CAEN Code</th>
                  <th>Activity Description</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {caenCodes.map((c, i) => (
                  <tr key={i}>
                    <td><strong style={{ color: c.primary ? 'var(--blue)' : 'var(--navy)' }}>{c.code}</strong></td>
                    <td>{c.name}</td>
                    <td>{c.primary ? <span className="tag" style={{ background: 'var(--blue)', color: 'white' }}>Primary</span> : <span className="tag">Secondary</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Need a Customized Solution?</h2>
            <p>Every business is different. Contact us to discuss your specific workforce requirements.</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">Request Workers</Link>
              <Link href="/contact" className="btn btn-white btn-lg">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
