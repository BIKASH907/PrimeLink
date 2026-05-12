import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function Blog() {
  const { t } = useLanguage();

  const posts = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

  return (
    <Layout title={t('nav.blog')} description={t('blog.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.blog')}</span></div>
          <h1>{t('blog.heroTitle')}</h1>
          <p>{t('blog.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {posts.map((p, i) => (
              <div className="card" key={i}>
                <div style={{ height: '180px', background: `linear-gradient(135deg, var(--navy), var(--blue))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t(`blog.posts.${p}Cat`)}</span>
                </div>
                <div className="card-body">
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '8px' }}>{t('blog.comingSoon')}</p>
                  <h4 className="card-title">{t(`blog.posts.${p}Title`)}</h4>
                  <p className="card-text">{t(`blog.posts.${p}Excerpt`)}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--gray-400)' }}>
            <p>{t('blog.postsNote')}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
