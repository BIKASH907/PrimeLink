import Layout from '../components/Layout';
import Link from 'next/link';

export default function Team() {
  return (
    <Layout title="Our Team" description="Meet the team behind Primelink Human Capital — experienced professionals in international recruitment and workforce management.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Our Team</span></div>
          <h1>Our Team</h1>
          <p>Experienced professionals bridging South Asian talent with Romanian opportunity.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Leadership</p>
            <h2>Meet Our Founder</h2>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--navy))', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'var(--white)', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>BB</div>
            <h3>Bikash Bhat</h3>
            <p style={{ color: 'var(--blue)', fontWeight: 600, marginBottom: '16px' }}>Founder & Administrator</p>
            <p style={{ color: 'var(--gray-500)', lineHeight: '1.8', maxWidth: '550px', margin: '0 auto' }}>
              Bikash Bhat is the founder and sole administrator of Primelink Human Capital S.R.L. Born in Kailali, Nepal, and based in Europe, 
              Bikash brings a unique cross-cultural perspective to international workforce recruitment. His deep understanding of both South Asian 
              worker aspirations and Romanian employer needs drives the company's mission of ethical, efficient, and legally compliant staffing solutions.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Our Network</p>
            <h2>Global Recruitment Partners</h2>
          </div>
          <div className="grid-4">
            {[
              { flag: '🇳🇵', country: 'Nepal', desc: 'Recruitment partners in Kathmandu, Pokhara, and Terai region.' },
              { flag: '🇮🇳', country: 'India', desc: 'Network across major recruitment hubs in India.' },
              { flag: '🇧🇩', country: 'Bangladesh', desc: 'Partners in Dhaka and Chittagong regions.' },
              { flag: '🇱🇰', country: 'Sri Lanka', desc: 'Recruitment coordination from Colombo.' },
            ].map((p, i) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{p.flag}</div>
                  <h4 className="card-title">{p.country}</h4>
                  <p className="card-text">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Join Our Team</h2>
            <p>We're always looking for talented recruitment professionals to join our growing network.</p>
            <Link href="/contact" className="btn btn-amber btn-lg">Get in Touch</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
