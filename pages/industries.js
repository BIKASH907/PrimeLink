import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function Industries() {
  const { t } = useLanguage();

  const industries = [
    { icon: '🏗️', key: 'i1', positions: '50+' },
    { icon: '🏭', key: 'i2', positions: '40+' },
    { icon: '🍽️', key: 'i3', positions: '30+' },
    { icon: '🌾', key: 'i4', positions: '25+' },
    { icon: '🚛', key: 'i5', positions: '20+' },
    { icon: '🏥', key: 'i6', positions: '15+' },
    { icon: '🧹', key: 'i7', positions: '20+' },
    { icon: '🏪', key: 'i8', positions: '15+' },
  ];

  return (
    <Layout title={t('nav.industries')} description={t('industries.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.industries')}</span></div>
          <h1>{t('industries.heroTitle')}</h1>
          <p>{t('industries.heroSubtitle')}</p>
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
                      <h3 style={{ marginBottom: '8px' }}>{t(`industries.list.${ind.key}Title`)}</h3>
                      <p style={{ color: 'var(--gray-500)', lineHeight: '1.7' }}>{t(`industries.list.${ind.key}Desc`)}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '120px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '4px' }}>{t('industries.demand')}</div>
                    <span className="tag">{t(`industries.list.${ind.key}Demand`)}</span>
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
            <h2>{t('industries.cta.title')}</h2>
            <p>{t('industries.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">{t('industries.cta.btn1')}</Link>
              <Link href="/contact" className="btn btn-white btn-lg">{t('industries.cta.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
