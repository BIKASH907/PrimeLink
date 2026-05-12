import Layout from '../components/Layout';
import Link from 'next/link';
import { useLanguage } from '../lib/i18n';

export default function Services() {
  const { t } = useLanguage();

  const caenCodes = [
    { code: '7820', key: 'c7820', primary: true },
    { code: '7810', key: 'c7810' },
    { code: '7020', key: 'c7020' },
    { code: '4619', key: 'c4619' },
    { code: '4690', key: 'c4690' },
    { code: '4711', key: 'c4711' },
    { code: '4712', key: 'c4712' },
    { code: '4791', key: 'c4791' },
    { code: '4792', key: 'c4792' },
    { code: '5210', key: 'c5210' },
    { code: '5520', key: 'c5520' },
    { code: '5540', key: 'c5540' },
    { code: '5590', key: 'c5590' },
    { code: '8110', key: 'c8110' },
    { code: '8210', key: 'c8210' },
    { code: '8240', key: 'c8240' },
    { code: '8299', key: 'c8299' },
    { code: '8559', key: 'c8559' },
  ];

  const services = [
    { icon: '👥', key: 's1', link: '/for-employers' },
    { icon: '🎯', key: 's2', link: '/for-employers' },
    { icon: '📑', key: 's3', link: '/recruitment-process' },
    { icon: '✈️', key: 's4', link: '/recruitment-process' },
    { icon: '📋', key: 's5', link: '/for-employers' },
    { icon: '🏢', key: 's6', link: '/contact' },
  ];

  return (
    <Layout title={t('nav.ourServices')} description={t('services.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('nav.services')}</span></div>
          <h1>{t('services.title')}</h1>
          <p>{t('services.subtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('services.core.label')}</p>
            <h2>{t('services.core.title')}</h2>
          </div>
          <div className="grid-3">
            {services.map((s, i) => (
              <div className="card" key={i}>
                <div className="card-body">
                  <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{s.icon}</div>
                  <h4 className="card-title">{t(`services.${s.key}Title`)}</h4>
                  <p className="card-text">{t(`services.${s.key}Desc`)}</p>
                  <Link href={s.link} className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>{t('common.learnMore')}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <p className="section-label">{t('services.caen.label')}</p>
            <h2>{t('services.caen.title')}</h2>
            <p>{t('services.caen.subtitle')}</p>
          </div>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('services.caen.headerCode')}</th>
                  <th>{t('services.caen.headerDesc')}</th>
                  <th>{t('services.caen.headerType')}</th>
                </tr>
              </thead>
              <tbody>
                {caenCodes.map((c, i) => (
                  <tr key={i}>
                    <td><strong style={{ color: c.primary ? 'var(--blue)' : 'var(--navy)' }}>{c.code}</strong></td>
                    <td>{t(`services.caen.${c.key}`)}</td>
                    <td>{c.primary ? <span className="tag" style={{ background: 'var(--blue)', color: 'white' }}>{t('services.caen.primary')}</span> : <span className="tag">{t('services.caen.secondary')}</span>}</td>
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
            <h2>{t('services.cta.title')}</h2>
            <p>{t('services.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link href="/employer-inquiry" className="btn btn-amber btn-lg">{t('services.cta.btn1')}</Link>
              <Link href="/contact" className="btn btn-white btn-lg">{t('services.cta.btn2')}</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
