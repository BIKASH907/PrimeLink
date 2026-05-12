import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';
import { useLanguage } from '../lib/i18n';

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  return (
    <Layout title={t('footer.privacyPolicy')} description={t('privacy.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('footer.privacyPolicy')}</span></div>
          <h1>{t('privacy.heroTitle')}</h1>
          <p>{t('privacy.lastUpdated')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ lineHeight: '1.9', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
            <h3 style={{ marginTop: '0', marginBottom: '16px' }}>{t('privacy.s1')}</h3>
            <p>
              <strong>{COMPANY.legal}</strong><br />
              CUI: {COMPANY.cui}<br />
              {t('contact.regCom')} {COMPANY.regNo}<br />
              EUID: {COMPANY.euid}<br />
              {t('privacy.s1RegOffice')} {COMPANY.address}<br />
              Email: info@primelinkhumancapital.com
            </p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s2')}</h3>
            <p>{t('privacy.s2p1')}</p>
            <p>{t('privacy.s2p2')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s3')}</h3>
            <p>{t('privacy.s3p1')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s4')}</h3>
            <p>{t('privacy.s4p1')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s5')}</h3>
            <p>{t('privacy.s5p1')}</p>
            <p>{t('privacy.s5p2')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s6')}</h3>
            <p>{t('privacy.s6p1')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s7')}</h3>
            <p>{t('privacy.s7p1')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s8')}</h3>
            <p>{t('privacy.s8p1')}</p>
            <p>{t('privacy.s8p2')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s9')}</h3>
            <p>{t('privacy.s9p1')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s10')}</h3>
            <p>{t('privacy.s10p1')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('privacy.s11')}</h3>
            <p>
              {t('privacy.s11p1')}<br />
              {t('privacy.s11Email')}<br />
              {t('privacy.s11Address')} {COMPANY.address}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
