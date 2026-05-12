import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';
import { useLanguage } from '../lib/i18n';

export default function About() {
  const { t } = useLanguage();

  const values = [
    { icon: '⚖️', key: 'v1' },
    { icon: '🤝', key: 'v2' },
    { icon: '✅', key: 'v3' },
    { icon: '🔄', key: 'v4' },
  ];

  const regRows = [
    [t('about.registration.legalName'), COMPANY.legal],
    [t('about.registration.cui'), COMPANY.cui],
    [t('about.registration.tradeReg'), COMPANY.regNo],
    [t('about.registration.euid'), COMPANY.euid],
    [t('about.registration.cert'), t('about.registration.certVal')],
    [t('about.registration.legalForm'), t('about.registration.legalFormVal')],
    [t('about.registration.capital'), t('about.registration.capitalVal')],
    [t('about.registration.eurEquiv'), t('about.registration.eurEquivVal')],
    [t('about.registration.caen'), t('about.registration.caenVal')],
    [t('about.registration.duration'), t('about.registration.durationVal')],
    [t('about.registration.office'), t('about.registration.officeVal')],
    [t('about.registration.court'), t('about.registration.courtVal')],
    [t('about.registration.auth'), t('about.registration.authVal')],
    [t('about.registration.admin'), t('about.registration.adminVal')],
    [t('about.registration.mandate'), t('about.registration.mandateVal')],
    [t('about.registration.status'), t('about.registration.statusVal')],
  ];

  return (
    <Layout title={t('nav.aboutUs')} description={t('about.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.aboutUs')}</span></div>
          <h1>{t('about.heroTitle')}</h1>
          <p>{t('about.heroSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-col">
            <div className="two-col-text">
              <p className="section-label">{t('about.story.label')}</p>
              <h2>{t('about.story.title')}</h2>
              <p>{COMPANY.legal}{t('about.story.p1Post')}</p>
              <p>{t('about.story.p2')}</p>
              <p>{t('about.story.p3')}</p>
            </div>
            <div className="two-col-image">🏛️</div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="grid-2">
            <div>
              <p className="section-label">{t('about.mission.label')}</p>
              <h3 style={{ marginBottom: '16px' }}>{t('about.mission.title')}</h3>
              <p style={{ color: 'var(--gray-500)', lineHeight: '1.8' }}>{t('about.mission.desc')}</p>
            </div>
            <div>
              <p className="section-label">{t('about.vision.label')}</p>
              <h3 style={{ marginBottom: '16px' }}>{t('about.vision.title')}</h3>
              <p style={{ color: 'var(--gray-500)', lineHeight: '1.8' }}>{t('about.vision.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('about.values.label')}</p>
            <h2>{t('about.values.title')}</h2>
          </div>
          <div className="grid-4">
            {values.map((v, i) => (
              <div className="card" key={i}>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{v.icon}</div>
                  <h4 className="card-title">{t(`about.values.${v.key}Title`)}</h4>
                  <p className="card-text">{t(`about.values.${v.key}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('about.registration.label')}</p>
            <h2>{t('about.registration.title')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>{t('about.registration.subtitle')}</p>
          </div>
          <div style={{ maxWidth: '700px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: '36px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', fontSize: '0.95rem' }}>
              <tbody>
                {regRows.map(([label, value], i) => (
                  <tr key={i}>
                    <td style={{ padding: '10px 0', color: 'rgba(255,255,255,0.5)', verticalAlign: 'top', width: '40%' }}>{label}</td>
                    <td style={{ padding: '10px 0', color: 'var(--white)', fontWeight: 500 }}>{value}</td>
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
            <h2>{t('about.cta.title')}</h2>
            <p>{t('about.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">{t('about.cta.btn1')}</Link>
              <Link href="/contact" className="btn btn-white btn-lg">{t('about.cta.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
