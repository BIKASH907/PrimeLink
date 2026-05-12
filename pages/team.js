import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function Team() {
  const { t } = useLanguage();

  const partners = [
    { flag: '🇳🇵', key: 'nepal' },
    { flag: '🇮🇳', key: 'india' },
    { flag: '🇧🇩', key: 'bangladesh' },
    { flag: '🇱🇰', key: 'sriLanka' },
  ];

  return (
    <Layout title={t('nav.ourTeam')} description={t('team.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.ourTeam')}</span></div>
          <h1>{t('team.heroTitle')}</h1>
          <p>{t('team.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('team.leadership.label')}</p>
            <h2>{t('team.leadership.title')}</h2>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--navy))', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'var(--white)', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>BB</div>
            <h3>{t('team.founderName')}</h3>
            <p style={{ color: 'var(--blue)', fontWeight: 600, marginBottom: '16px' }}>{t('team.founderRole')}</p>
            <p style={{ color: 'var(--gray-500)', lineHeight: '1.8', maxWidth: '550px', margin: '0 auto' }}>
              {t('team.founderBio')}
            </p>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('team.network.label')}</p>
            <h2>{t('team.network.title')}</h2>
          </div>
          <div className="grid-4">
            {partners.map((p, i) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{p.flag}</div>
                  <h4 className="card-title">{t(`team.network.${p.key}`)}</h4>
                  <p className="card-text">{t(`team.network.${p.key}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>{t('team.cta.title')}</h2>
            <p>{t('team.cta.subtitle')}</p>
            <Link href="/contact" className="btn btn-amber btn-lg">{t('team.cta.btn')}</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
