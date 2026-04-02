import Link from 'next/link';
import { COMPANY } from './Header';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" style={{ display: 'inline-block', marginBottom: '8px' }}>
              <img src="/logo.png" alt="Primelink Human Capital" style={{ height: '70px', width: 'auto', objectFit: 'contain', background: 'white', borderRadius: '10px', padding: '6px 12px' }} />
            </Link>
            <p>
              Your trusted partner for international workforce recruitment in Romania.
              We connect skilled workers from Asia and Africa
              with Romanian employers across all major industries.
            </p>
            <div style={{ marginTop: '20px', fontSize: '0.85rem', lineHeight: '1.8' }}>
              <strong style={{ color: 'var(--white)' }}>Registered Office:</strong><br />
              {COMPANY.address}
            </div>
          </div>

          <div>
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/team">Our Team</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/why-choose-us">Why Choose Us</Link></li>
              <li><Link href="/testimonials">Testimonials</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4>For Employers</h4>
            <ul className="footer-links">
              <li><Link href="/for-employers">Employer Solutions</Link></li>
              <li><Link href="/employer-inquiry">Request Workers</Link></li>
              <li><Link href="/industries">Industries We Serve</Link></li>
              <li><Link href="/recruitment-process">How It Works</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
            <h4 style={{ marginTop: '24px' }}>For Workers</h4>
            <ul className="footer-links">
              <li><Link href="/for-workers">Worker Information</Link></li>
              <li><Link href="/jobs">Job Listings</Link></li>
              <li><Link href="/apply">Apply Now</Link></li>
              <li><Link href="/why-romania">Why Romania</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul className="footer-links">
              <li>📍 Str. Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2, Sector 1, București</li>
              <li>📧 <a href="mailto:info@primelinkhumancapital.com">info@primelinkhumancapital.com</a></li>
              <li>📞 <a href="tel:+37063343573">+370 633 43573</a></li>
            </ul>
            <h4 style={{ marginTop: '24px' }}>Legal Details</h4>
            <ul className="footer-links" style={{ fontSize: '0.82rem' }}>
              <li>CUI: {COMPANY.cui}</li>
              <li>Reg. Nr.: {COMPANY.regNo}</li>
              <li>EUID: {COMPANY.euid}</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} {COMPANY.legal}. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Terms & Conditions</Link>
            <Link href="/cookie-policy" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Cookie Policy</Link>
          </div>
        </div>
      </div>

      <div className="footer-legal">
        <div className="container">
          <strong>{COMPANY.legal}</strong> | CUI: {COMPANY.cui} | Nr. Registrul Comerțului: {COMPANY.regNo} |
          EUID: {COMPANY.euid} | Certificat de Înregistrare: Seria B Nr. 5780913 |
          Sediu Social: {COMPANY.address} |
          Capital Social: 20.000 LEI |
          CAEN Principal: 7820 — Activități ale agențiilor de plasare temporară a forței de muncă și furnizarea altor resurse umane |
          Înregistrată prin Încheierea nr. 263477 din 30.03.2026 la Oficiul Registrului Comerțului de pe lângă Tribunalul București |
          Administrator: BHAT BIKASH — Puteri Depline
        </div>
      </div>
    </footer>
  );
}
