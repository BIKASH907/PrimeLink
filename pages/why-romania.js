import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function WhyRomania() {
  const { t } = useLanguage();

  const stats = [
    { value: 'EU', key: 's1' },
    { value: '19M', key: 's2' },
    { value: '€15.8K', key: 's3' },
    { value: '4.8%', key: 's4' },
  ];

  const benefits = [
    { icon: '🇪🇺', key: 'b1' },
    { icon: '💰', key: 'b2' },
    { icon: '🏠', key: 'b3' },
    { icon: '🌡️', key: 'b4' },
    { icon: '🤝', key: 'b5' },
    { icon: '📈', key: 'b6' },
    { icon: '🏗️', key: 'b7' },
    { icon: '✈️', key: 'b8' },
    { icon: '📚', key: 'b9' },
  ];

  return (
    <Layout title={t('nav.whyRomania')} description={t('whyRomania.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.whyRomania')}</span></div>
          <h1>{t('whyRomania.heroTitle')}</h1>
          <p>{t('whyRomania.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('whyRomania.glance.label')}</p>
            <h2>{t('whyRomania.glance.title')}</h2>
          </div>
          <div className="stats-bar">
            {stats.map((s, i) => (
              <div className="stat-item" key={i}>
                <h3>{s.value}</h3>
                <p>{t(`whyRomania.glance.${s.key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="grid-3">
            {benefits.map((b, i) => (
              <div className="card" key={i}>
                <div className="card-body">
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{b.icon}</div>
                  <h4 className="card-title">{t(`whyRomania.benefits.${b.key}Title`)}</h4>
                  <p className="card-text">{t(`whyRomania.benefits.${b.key}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>{t('whyRomania.cta.title')}</h2>
            <p>{t('whyRomania.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link href="/apply" className="btn btn-amber btn-lg">{t('whyRomania.cta.btn1')}</Link>
              <Link href="/jobs" className="btn btn-white btn-lg">{t('whyRomania.cta.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
