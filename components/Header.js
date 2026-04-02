import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const COMPANY = {
  name: 'PRIMELINK HUMAN CAPITAL',
  shortName: 'Primelink',
  legal: 'PRIMELINK HUMAN CAPITAL S.R.L.',
  cui: '54386335',
  regNo: 'J2026021244007',
  euid: 'ROONRC.J2026021244007',
  address: 'Strada Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2, Sector 1, București, Romania',
  phone: '+370 633 43573',
  email: 'info@primelinkhumancapital.com',
};

export { COMPANY };

export default function Header() {
  const router = useRouter();
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

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            <img src="/logo.png" alt="Primelink Human Capital" style={{ height: '65px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          <nav className="nav">
            <Link href="/" className={isActive('/')}>Home</Link>
            <Link href="/about" className={isActive('/about')}>About</Link>
            <div className="nav-dropdown">
              <Link href="/services" className={isActive('/services')}>Services ▾</Link>
              <div className="nav-dropdown-menu">
                <Link href="/for-employers">For Employers</Link>
                <Link href="/for-workers">For Workers</Link>
                <Link href="/recruitment-process">Recruitment Process</Link>
                <Link href="/industries">Industries</Link>
              </div>
            </div>
            <Link href="/jobs" className={isActive('/jobs')}>Jobs</Link>
            <Link href="/why-romania" className={isActive('/why-romania')}>Why Romania</Link>
            <Link href="/blog" className={isActive('/blog')}>Blog</Link>
            <Link href="/contact" className={isActive('/contact')}>Contact</Link>
          </nav>

          <div className="header-actions">
            <Link href="/employer-inquiry" className="btn btn-primary btn-sm">Hire Workers</Link>
            <Link href="/apply" className="btn btn-amber btn-sm">Apply Now</Link>
            <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${mobileOpen ? 'active' : ''}`}>
        <Link href="/">Home</Link>
        <Link href="/about">About Us</Link>
        <Link href="/services">Our Services</Link>
        <Link href="/for-employers">For Employers</Link>
        <Link href="/for-workers">For Workers</Link>
        <Link href="/recruitment-process">Recruitment Process</Link>
        <Link href="/industries">Industries</Link>
        <Link href="/jobs">Job Listings</Link>
        <Link href="/why-romania">Why Romania</Link>
        <Link href="/why-choose-us">Why Choose Us</Link>
        <Link href="/team">Our Team</Link>
        <Link href="/testimonials">Testimonials</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
        <div style={{ padding: '20px 16px', display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <Link href="/employer-inquiry" className="btn btn-primary" style={{ width: '100%' }}>Hire Workers</Link>
          <Link href="/apply" className="btn btn-amber" style={{ width: '100%' }}>Apply Now</Link>
        </div>
      </div>
    </>
  );
}
