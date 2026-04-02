import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy" description="Privacy Policy of Primelink Human Capital S.R.L. — how we collect, use, and protect your personal data.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Privacy Policy</span></div>
          <h1>Privacy Policy</h1>
          <p>Last updated: April 2, 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ lineHeight: '1.9', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
            <h3 style={{ marginTop: '0', marginBottom: '16px' }}>1. Data Controller</h3>
            <p><strong>{COMPANY.legal}</strong><br />CUI: {COMPANY.cui}<br />Nr. Reg. Com.: {COMPANY.regNo}<br />EUID: {COMPANY.euid}<br />Registered Office: {COMPANY.address}<br />Email: info@primelinkhumancapital.com</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>2. Data We Collect</h3>
            <p>We collect and process personal data necessary for our recruitment and staffing services, including: name, email, phone number, nationality, date of birth, passport details, work experience, education, skills, medical fitness status, employment history, and any information you voluntarily provide through our forms and communications.</p>
            <p>For employers, we collect: company name, CUI, contact person details, workforce requirements, and business communication data.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>3. Purpose of Data Processing</h3>
            <p>We process personal data for: matching candidates with job opportunities; processing work permit and visa applications; managing employment contracts; communicating with candidates and employers; legal compliance with Romanian and EU labor law; and improving our services.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>4. Legal Basis</h3>
            <p>We process data based on: (a) your explicit consent when you submit an application or inquiry; (b) the necessity to perform or prepare an employment contract; (c) our legitimate business interests in providing staffing services; and (d) compliance with legal obligations under Romanian labor and immigration law.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>5. Data Sharing</h3>
            <p>We may share your personal data with: Romanian employers (for recruitment purposes, with your consent); Romanian government authorities (IGI, ANAF, ITM) as required by law; our recruitment partners in source countries; and service providers (hosting, email) under data processing agreements.</p>
            <p>We never sell personal data to third parties for marketing purposes.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>6. International Data Transfers</h3>
            <p>As we operate across Romania and South Asian countries, some personal data may be transferred outside the EU/EEA. Such transfers are conducted under appropriate safeguards as required by GDPR, including standard contractual clauses.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>7. Data Retention</h3>
            <p>We retain personal data for the duration necessary to fulfill the purposes for which it was collected, and for the legally required retention periods thereafter (typically 5-10 years for employment records under Romanian law).</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>8. Your Rights (GDPR)</h3>
            <p>Under the General Data Protection Regulation (EU) 2016/679, you have the right to: access your personal data; rectify inaccurate data; erase your data (right to be forgotten); restrict processing; data portability; object to processing; and withdraw consent at any time.</p>
            <p>To exercise these rights, contact us at: info@primelinkhumancapital.com</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>9. Data Security</h3>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, destruction, or alteration. This includes encrypted storage, secure transmission protocols, and access controls.</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>10. Supervisory Authority</h3>
            <p>If you believe your data protection rights have been violated, you have the right to lodge a complaint with the Romanian Data Protection Authority (ANSPDCP): Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal, B-dul G-ral. Gheorghe Magheru nr. 28-30, Sector 1, București, Romania. Website: www.dataprotection.ro</p>

            <h3 style={{ marginTop: '36px', marginBottom: '16px' }}>11. Contact</h3>
            <p>For any questions regarding this Privacy Policy or your personal data, contact us at:<br />Email: info@primelinkhumancapital.com<br />Address: {COMPANY.address}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
