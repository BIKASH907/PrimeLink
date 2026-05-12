import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';
import { useLanguage } from '../lib/i18n';

export default function Terms() {
  const { t } = useLanguage();

  return (
    <Layout title={t('footer.termsConditions')} description={t('terms.metaDesc')}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">{t('common.home')}</Link> / <span>{t('footer.termsConditions')}</span></div>
          <h1>{t('terms.heroTitle')}</h1>
          <p>{t('terms.lastUpdated')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ lineHeight: '1.9', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
            <h3 style={{ marginTop: '0', marginBottom: '16px' }}>{t('terms.s1')}</h3>
            <p>
              {t('terms.s1pPre')} <strong>{COMPANY.legal}</strong>{t('terms.s1pMid')} {COMPANY.cui}{t('terms.s1pMid2')} {COMPANY.regNo}{t('terms.s1pMid3')} {COMPANY.euid}{t('terms.s1pMid4')} {COMPANY.address}{t('terms.s1pEnd')}
            </p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s2')}</h3>
            <p>{t('terms.s2p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s3')}</h3>
            <p>{t('terms.s3p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s4')}</h3>
            <p>{t('terms.s4p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s5')}</h3>
            <p>{t('terms.s5p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s6')}</h3>
            <p>{t('terms.s6p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s7')}</h3>
            <p>{t('terms.s7p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s8')}</h3>
            <p>{t('terms.s8pPre')} {COMPANY.legal} {t('terms.s8pPost')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s9')}</h3>
            <p>{t('terms.s9p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s10')}</h3>
            <p>{t('terms.s10p')}</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>{t('terms.s11')}</h3>
            <p>
              {COMPANY.legal}<br />
              CUI: {COMPANY.cui} | {t('contact.regCom')} {COMPANY.regNo}<br />
              {COMPANY.address}<br />
              Email: info@primelinkhumancapital.com
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
