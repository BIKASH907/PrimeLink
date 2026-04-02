import Layout from '../components/Layout';
import Link from 'next/link';
import { COMPANY } from '../components/Header';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '', type: 'general' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
        setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '', type: 'general' });
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Layout title="Contact Us" description="Get in touch with Primelink Human Capital — office address, phone, email, and contact form.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Contact</span></div>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Reach out by phone, email, or fill in the form below.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '60px' }}>
            <div>
              <h3 style={{ marginBottom: '24px' }}>Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name <span className="required">*</span></label>
                    <input className="form-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label>Email <span className="required">*</span></label>
                    <input className="form-control" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+370 633 43573" />
                  </div>
                  <div className="form-group">
                    <label>Company (if applicable)</label>
                    <input className="form-control" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company name" />
                  </div>
                </div>
                <div className="form-group">
                  <label>I am a...</label>
                  <select className="form-control" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="general">General Inquiry</option>
                    <option value="employer">Romanian Employer</option>
                    <option value="worker">Worker / Job Seeker</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject <span className="required">*</span></label>
                  <input className="form-control" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="Subject of your message" />
                </div>
                <div className="form-group">
                  <label>Message <span className="required">*</span></label>
                  <textarea className="form-control" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div>
              <h3 style={{ marginBottom: '24px' }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📍</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Registered Office</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem', lineHeight: '1.7' }}>
                      Strada Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2<br />
                      Sector 1, București, Romania
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📧</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Email</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem' }}>
                      General: <a href="mailto:info@primelinkhumancapital.com">info@primelinkhumancapital.com</a><br />
                      Employers: <a href="mailto:employers@primelinkhumancapital.com">employers@primelinkhumancapital.com</a><br />
                      Workers: <a href="mailto:apply@primelinkhumancapital.com">apply@primelinkhumancapital.com</a>
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>📞</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Phone</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem' }}>
                      Romania: +370 633 43573<br />
                      WhatsApp: +370 633 43573
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ fontSize: '1.5rem' }}>🕐</div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>Business Hours</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.93rem' }}>
                      Monday — Friday: 09:00 — 18:00 (EET)<br />
                      Saturday — Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '36px', padding: '24px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Company Details</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: '1.8' }}>
                  <strong>{COMPANY.legal}</strong><br />
                  CUI: {COMPANY.cui}<br />
                  Nr. Reg. Com.: {COMPANY.regNo}<br />
                  EUID: {COMPANY.euid}<br />
                  Certificat: Seria B Nr. 5780913
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
