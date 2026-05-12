import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <Layout title={t('nav.testimonials')} description={t('testimonials.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.testimonials')}</span></div>
          <h1>{t('testimonials.heroTitle')}</h1>
          <p>{t('testimonials.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', padding: '60px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚀</div>
            <h3 style={{ marginBottom: '16px' }}>{t('testimonials.comingSoonTitle')}</h3>
            <p style={{ color: 'var(--gray-500)', lineHeight: '1.8' }}>
              {t('testimonials.comingSoonText')}
            </p>
            <div style={{ marginTop: '30px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/employer-inquiry" className="btn btn-primary">{t('testimonials.btn1')}</Link>
              <Link href="/apply" className="btn btn-amber">{t('testimonials.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
