import Layout from '../components/Layout';
import Link from 'next/link';

export default function Blog() {
  const posts = [
    { title: 'Romania\'s Labor Shortage: Why South Asian Workers Are the Solution', excerpt: 'Romania has lost millions of workers to Western European emigration. We explore how South Asian recruitment is filling the gap.', date: 'Coming Soon', category: 'Industry Insights' },
    { title: 'A Worker\'s Guide to Living in Romania', excerpt: 'Everything you need to know about life in Romania — from cost of living to climate, culture, and daily practicalities.', date: 'Coming Soon', category: 'Worker Guide' },
    { title: 'Understanding Romanian Work Permits for Non-EU Workers', excerpt: 'A comprehensive guide to the aviz de muncă process, timelines, and requirements for South Asian workers.', date: 'Coming Soon', category: 'Legal & Compliance' },
    { title: 'How Romanian Employers Can Benefit from International Staffing', excerpt: 'The business case for hiring through a licensed international staffing agency like Primelink Human Capital.', date: 'Coming Soon', category: 'For Employers' },
    { title: 'Ethical Recruitment: Our Commitment to Fair Practices', excerpt: 'How Primelink ensures zero-exploitation, transparent fees, and full worker protection throughout the recruitment process.', date: 'Coming Soon', category: 'Company News' },
    { title: 'Top 5 Industries Hiring Foreign Workers in Romania in 2026', excerpt: 'A data-driven look at which Romanian sectors have the highest demand for international workers this year.', date: 'Coming Soon', category: 'Industry Insights' },
  ];

  return (
    <Layout title="Blog" description="Insights on international recruitment, Romanian labor market, worker guides, and industry news from Primelink Human Capital.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Blog</span></div>
          <h1>Blog & Insights</h1>
          <p>News, guides, and insights on international recruitment and the Romanian labor market.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {posts.map((post, i) => (
              <div className="card" key={i}>
                <div style={{ height: '180px', background: `linear-gradient(135deg, var(--navy), var(--blue))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '1px' }}>{post.category}</span>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '8px' }}>{post.date}</p>
                  <h4 className="card-title">{post.title}</h4>
                  <p className="card-text">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--gray-400)' }}>
            <p>Blog posts coming soon. Stay tuned for regular updates on international recruitment and the Romanian labor market.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
