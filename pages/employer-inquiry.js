import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function EmployerInquiry() {
  const [form, setForm] = useState({
    companyName: '', contactPerson: '', email: '', phone: '', cui: '', industry: '',
    workersNeeded: '', positions: '', startDate: '', duration: '', location: '',
    accommodation: '', salaryRange: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/employer-inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        toast.success('Inquiry submitted! We\'ll send you a tailored proposal within 48 hours.');
        setForm({ companyName: '', contactPerson: '', email: '', phone: '', cui: '', industry: '', workersNeeded: '', positions: '', startDate: '', duration: '', location: '', accommodation: '', salaryRange: '', message: '' });
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Layout title="Hire Workers" description="Submit your workforce requirements and receive a tailored proposal within 48 hours.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Employer Inquiry</span></div>
          <h1>Hire Workers for Your Business</h1>
          <p>Tell us your requirements and we'll send you a tailored proposal within 48 hours.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '850px' }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '20px' }}>Company Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name <span className="required">*</span></label>
                <input className="form-control" name="companyName" required value={form.companyName} onChange={handleChange} placeholder="Your company name" />
              </div>
              <div className="form-group">
                <label>CUI (Tax ID)</label>
                <input className="form-control" name="cui" value={form.cui} onChange={handleChange} placeholder="RO12345678" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Person <span className="required">*</span></label>
                <input className="form-control" name="contactPerson" required value={form.contactPerson} onChange={handleChange} placeholder="Full name" />
              </div>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input className="form-control" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="company@email.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone <span className="required">*</span></label>
                <input className="form-control" name="phone" required value={form.phone} onChange={handleChange} placeholder="+370 633 43573" />
              </div>
              <div className="form-group">
                <label>Industry <span className="required">*</span></label>
                <select className="form-control" name="industry" required value={form.industry} onChange={handleChange}>
                  <option value="">Select industry</option>
                  <option value="construction">Construction</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="hospitality">Hospitality & Tourism</option>
                  <option value="agriculture">Agriculture & Food Processing</option>
                  <option value="logistics">Logistics & Warehousing</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="cleaning">Cleaning & Facility Services</option>
                  <option value="retail">Retail & Commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <h3 style={{ marginTop: '36px', marginBottom: '20px' }}>Workforce Requirements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Number of Workers Needed</label>
                <input className="form-control" name="workersNeeded" type="number" value={form.workersNeeded} onChange={handleChange} placeholder="e.g. 10" />
              </div>
              <div className="form-group">
                <label>Positions / Roles Needed</label>
                <input className="form-control" name="positions" value={form.positions} onChange={handleChange} placeholder="e.g. Welders, Masons, General Laborers" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Desired Start Date</label>
                <input className="form-control" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contract Duration</label>
                <select className="form-control" name="duration" value={form.duration} onChange={handleChange}>
                  <option value="">Select duration</option>
                  <option value="3-months">3 months (seasonal)</option>
                  <option value="6-months">6 months</option>
                  <option value="12-months">12 months</option>
                  <option value="24-months">24 months</option>
                  <option value="permanent">Permanent</option>
                  <option value="flexible">Flexible / Ongoing</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Work Location</label>
                <input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder="City / County in Romania" />
              </div>
              <div className="form-group">
                <label>Accommodation</label>
                <select className="form-control" name="accommodation" value={form.accommodation} onChange={handleChange}>
                  <option value="">Select option</option>
                  <option value="provided">Company provides accommodation</option>
                  <option value="partial">Partial support (subsidy)</option>
                  <option value="not-provided">Workers arrange their own</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Salary Range (net, per month)</label>
              <input className="form-control" name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="e.g. €700-900 net/month" />
            </div>
            <div className="form-group">
              <label>Additional Details</label>
              <textarea className="form-control" name="message" value={form.message} onChange={handleChange} placeholder="Any other requirements, certifications needed, specific skills..." />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? 'Submitting...' : 'Submit Inquiry →'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--gray-400)' }}>
              We typically respond within 48 hours with a tailored proposal.
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}
