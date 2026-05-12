import Link from 'next/link';
import { COMPANY } from './Header';
import { useLanguage } from '../lib/i18n';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo-link">
              <img src="/logo.png" alt="Primelink Human Capital" className="footer-logo-img" />
            </Link>
            <p>{t('footer.brandText')}</p>
            <div className="footer-address">
              <strong>{t('footer.registeredOffice')}</strong><br />
              {COMPANY.address}
            </div>
          </div>

          <div>
            <h4>{t('footer.company')}</h4>
            <ul className="footer-links">
              <li><Link href="/about">{t('footer.links.aboutUs')}</Link></li>
              <li><Link href="/team">{t('footer.links.ourTeam')}</Link></li>
              <li><Link href="/services">{t('footer.links.services')}</Link></li>
              <li><Link href="/why-choose-us">{t('footer.links.whyChooseUs')}</Link></li>
              <li><Link href="/testimonials">{t('footer.links.testimonials')}</Link></li>
              <li><Link href="/blog">{t('footer.links.blog')}</Link></li>
              <li><Link href="/contact">{t('footer.links.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{t('footer.forEmployers')}</h4>
            <ul className="footer-links">
              <li><Link href="/for-employers">{t('footer.links.employerSolutions')}</Link></li>
              <li><Link href="/employer-inquiry">{t('footer.links.requestWorkers')}</Link></li>
              <li><Link href="/industries">{t('footer.links.industriesWeServe')}</Link></li>
              <li><Link href="/recruitment-process">{t('footer.links.howItWorks')}</Link></li>
              <li><Link href="/faq">{t('footer.links.faq')}</Link></li>
            </ul>
            <h4 style={{ marginTop: '24px' }}>{t('footer.forWorkers')}</h4>
            <ul className="footer-links">
              <li><Link href="/for-workers">{t('footer.links.workerInformation')}</Link></li>
              <li><Link href="/jobs">{t('footer.links.jobListings')}</Link></li>
              <li><Link href="/apply">{t('footer.links.applyNow')}</Link></li>
              <li><Link href="/why-romania">{t('footer.links.whyRomania')}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{t('footer.contact')}</h4>
            <ul className="footer-links">
              <li>📍 Str. Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2, Sector 1, București</li>
              <li>📧 <a href="mailto:info@primelinkhumancapital.com">info@primelinkhumancapital.com</a></li>
              <li>📞 <a href="tel:+40XXXXXXXXX">+40 XXX XXX XXX</a></li>
            </ul>
            <h4 style={{ marginTop: '24px' }}>{t('footer.legalDetails')}</h4>
            <ul className="footer-links" style={{ fontSize: '0.82rem' }}>
              <li>CUI: {COMPANY.cui}</li>
              <li>{t('footer.regNo')} {COMPANY.regNo}</li>
              <li>EUID: {COMPANY.euid}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} {COMPANY.legal}. {t('footer.allRightsReserved')}.</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{t('footer.privacyPolicy')}</Link>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{t('footer.termsConditions')}</Link>
            <Link href="/cookie-policy" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{t('footer.cookiePolicy')}</Link>
          </div>
        </div>
      </div>

      <div className="footer-legal">
        <div className="container">
          <strong>{COMPANY.legal}</strong> | {t('footer.legalDisclaimer')}
        </div>
      </div>
    </footer>
  );
}
