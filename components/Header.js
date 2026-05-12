import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useLanguage } from '../lib/i18n';

const COMPANY = {
  name: 'PRIMELINK HUMAN CAPITAL',
  shortName: 'Primelink',
  legal: 'PRIMELINK HUMAN CAPITAL S.R.L.',
  cui: '54386335',
  regNo: 'J2026021244007',
  euid: 'ROONRC.J2026021244007',
  address: 'Strada Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2, Sector 1, București, Romania',
  phone: '+40 XXX XXX XXX',
  email: 'info@primelinkhumancapital.com',
};

export { COMPANY };

export default function Header() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  const isActive = (path) => router.pathname === path ? 'active' : '';

  const toggleLang = () => setLang(lang === 'ro' ? 'en' : 'ro');

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            <img src="/logo.png" alt="Primelink Human Capital" style={{ height: '72px', width: 'auto', display: 'block' }} />
          </Link>

          <nav className="nav">
            <Link href="/" className={isActive('/')}>{t('nav.home')}</Link>
            <Link href="/about" className={isActive('/about')}>{t('nav.about')}</Link>
            <div className="nav-dropdown">
              <Link href="/services" className={isActive('/services')}>{t('nav.services')} ▾</Link>
              <div className="nav-dropdown-menu">
                <Link href="/for-employers">{t('nav.forEmployers')}</Link>
                <Link href="/for-workers">{t('nav.forWorkers')}</Link>
                <Link href="/recruitment-process">{t('nav.recruitmentProcess')}</Link>
                <Link href="/industries">{t('nav.industries')}</Link>
              </div>
            </div>
            <Link href="/jobs" className={isActive('/jobs')}>{t('nav.jobs')}</Link>
            <Link href="/why-romania" className={isActive('/why-romania')}>{t('nav.whyRomania')}</Link>
            <Link href="/blog" className={isActive('/blog')}>{t('nav.blog')}</Link>
            <Link href="/contact" className={isActive('/contact')}>{t('nav.contact')}</Link>
          </nav>

          <div className="header-actions">
            <div className="lang-toggle" role="group" aria-label="Language">
              <button
                type="button"
                className={`lang-toggle-btn ${lang === 'ro' ? 'active' : ''}`}
                onClick={() => setLang('ro')}
                aria-pressed={lang === 'ro'}
                title="Schimbă în Română"
              >
                <span className="lang-flag" aria-hidden="true">🇷🇴</span> RO
              </button>
              <button
                type="button"
                className={`lang-toggle-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                title="Switch to English"
              >
                <span className="lang-flag" aria-hidden="true">🇬🇧</span> EN
              </button>
            </div>
            <Link href="/employer-inquiry" className="btn btn-primary btn-sm">{t('nav.hireWorkers')}</Link>
            <Link href="/apply" className="btn btn-amber btn-sm">{t('nav.applyNow')}</Link>
            <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${mobileOpen ? 'active' : ''}`}>
        <div className="lang-switcher-mobile">
          <button
            type="button"
            className={`lang-option ${lang === 'ro' ? 'active' : ''}`}
            onClick={() => setLang('ro')}
          >
            Română
          </button>
          <button
            type="button"
            className={`lang-option ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            English
          </button>
        </div>
        <Link href="/">{t('nav.home')}</Link>
        <Link href="/about">{t('nav.aboutUs')}</Link>
        <Link href="/services">{t('nav.ourServices')}</Link>
        <Link href="/for-employers">{t('nav.forEmployers')}</Link>
        <Link href="/for-workers">{t('nav.forWorkers')}</Link>
        <Link href="/recruitment-process">{t('nav.recruitmentProcess')}</Link>
        <Link href="/industries">{t('nav.industries')}</Link>
        <Link href="/jobs">{t('nav.jobListings')}</Link>
        <Link href="/why-romania">{t('nav.whyRomania')}</Link>
        <Link href="/why-choose-us">{t('nav.whyChooseUs')}</Link>
        <Link href="/team">{t('nav.ourTeam')}</Link>
        <Link href="/testimonials">{t('nav.testimonials')}</Link>
        <Link href="/blog">{t('nav.blog')}</Link>
        <Link href="/faq">{t('nav.faq')}</Link>
        <Link href="/contact">{t('nav.contact')}</Link>
        <div style={{ padding: '20px 16px', display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <Link href="/employer-inquiry" className="btn btn-primary" style={{ width: '100%' }}>{t('nav.hireWorkers')}</Link>
          <Link href="/apply" className="btn btn-amber" style={{ width: '100%' }}>{t('nav.applyNow')}</Link>
        </div>
      </div>
    </>
  );
}
