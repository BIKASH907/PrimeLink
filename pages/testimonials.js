import Layout from '../components/Layout';
import Link from 'next/link';

export default function Testimonials() {
  const testimonials = [
    { name: 'Coming Soon', role: 'Employer', company: '', content: 'We are a newly registered company and are currently building our portfolio of successful placements. Check back soon for real testimonials from our clients and workers.', type: 'employer', rating: 5 },
  ];

  return (
    <Layout title="Testimonials" description="What employers and workers say about Primelink Human Capital's recruitment services.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Testimonials</span></div>
          <h1>Testimonials</h1>
          <p>What our clients and placed workers say about our services.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '60px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>
            <h3 style={{ marginBottom: '16px' }}>We're Just Getting Started</h3>
            <p style={{ color: 'var(--gray-500)', lineHeight: '1.8' }}>
              Primelink Human Capital S.R.L. was registered on March 30, 2026. We are currently building our first 
              batch of client relationships and worker placements. Real testimonials from satisfied employers and 
              workers will appear here as we complete our initial placements.
            </p>
            <div style={{ marginTop: '30px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/employer-inquiry" className="btn btn-primary">Become Our First Client</Link>
              <Link href="/apply" className="btn btn-amber">Be Our First Placement</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
