import Layout from '../components/Layout';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Apply() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', nationality: '', country: '',
    dateOfBirth: '', passportNumber: '', education: '', experience: '', skills: '',
    preferredIndustry: '', englishLevel: '', availableFrom: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        toast.success('Application submitted successfully! We will review it and contact you.');
        setForm({ firstName: '', lastName: '', email: '', phone: '', nationality: '', country: '', dateOfBirth: '', passportNumber: '', education: '', experience: '', skills: '', preferredIndustry: '', englishLevel: '', availableFrom: '', message: '' });
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Layout title="Apply Now" description="Apply for jobs in Romania. Submit your application and our team will match you with available positions.">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link href="/">Home</Link> / <span>Apply</span></div>
          <h1>Apply for a Job in Romania</h1>
          <p>Fill in the form below and take your first step toward working in Europe.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ background: 'var(--blue-pale)', padding: '20px 24px', borderRadius: 'var(--radius-md)', marginBottom: '32px', borderLeft: '4px solid var(--blue)' }}>
            <strong>Important:</strong> This application is free. Primelink Human Capital never charges workers illegal recruitment fees. All costs are transparently communicated.
          </div>

          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '20px' }}>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input className="form-control" name="firstName" required value={form.firstName} onChange={handleChange} placeholder="Your first name" />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input className="form-control" name="lastName" required value={form.lastName} onChange={handleChange} placeholder="Your last name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input className="form-control" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Phone / WhatsApp <span className="required">*</span></label>
                <input className="form-control" name="phone" required value={form.phone} onChange={handleChange} placeholder="+977 XXXXXXXXX" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nationality <span className="required">*</span></label>
                <select className="form-control" name="nationality" required value={form.nationality} onChange={handleChange}>
                  <option value="">Select nationality</option>
                  <option value="Nepali">Nepali</option>
                  <option value="Indian">Indian</option>
                  <option value="Bangladeshi">Bangladeshi</option>
                  <option value="Sri Lankan">Sri Lankan</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="Filipino">Filipino</option>
                  <option value="Kenyan">Kenyan</option>
                  <option value="Nigerian">Nigerian</option>
                  <option value="Ethiopian">Ethiopian</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Country of Residence <span className="required">*</span></label>
                <select className="form-control" name="country" required value={form.country} onChange={handleChange}>
                  <option value="">Select country</option>
                  <option value="Nepal">Nepal</option>
                  <option value="India">India</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="Filipino">Filipino</option>
                  <option value="Kenyan">Kenyan</option>
                  <option value="Nigerian">Nigerian</option>
                  <option value="Ethiopian">Ethiopian</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input className="form-control" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Passport Number</label>
                <input className="form-control" name="passportNumber" value={form.passportNumber} onChange={handleChange} placeholder="Passport number" />
              </div>
            </div>

            <h3 style={{ marginTop: '36px', marginBottom: '20px' }}>Qualifications & Experience</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Education Level</label>
                <select className="form-control" name="education" value={form.education} onChange={handleChange}>
                  <option value="">Select level</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School (SLC/SEE)</option>
                  <option value="higher_secondary">Higher Secondary (+2)</option>
                  <option value="diploma">Diploma / Technical</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                </select>
              </div>
              <div className="form-group">
                <label>English Level</label>
                <select className="form-control" name="englishLevel" value={form.englishLevel} onChange={handleChange}>
                  <option value="">Select level</option>
                  <option value="none">No English</option>
                  <option value="basic">Basic (a few words)</option>
                  <option value="intermediate">Intermediate (can communicate)</option>
                  <option value="advanced">Advanced (fluent conversation)</option>
                  <option value="fluent">Fluent / Native</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Work Experience</label>
              <textarea className="form-control" name="experience" value={form.experience} onChange={handleChange} placeholder="Describe your work experience — positions held, companies, duration, countries..." style={{ minHeight: '100px' }} />
            </div>
            <div className="form-group">
              <label>Skills & Certifications</label>
              <textarea className="form-control" name="skills" value={form.skills} onChange={handleChange} placeholder="List your skills, certifications, trade qualifications..." style={{ minHeight: '80px' }} />
            </div>

            <h3 style={{ marginTop: '36px', marginBottom: '20px' }}>Job Preferences</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Preferred Industry</label>
                <select className="form-control" name="preferredIndustry" value={form.preferredIndustry} onChange={handleChange}>
                  <option value="">Any industry</option>
                  <option value="construction">Construction</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="logistics">Logistics & Warehousing</option>
                  <option value="cleaning">Cleaning & Facility Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Available From</label>
                <input className="form-control" name="availableFrom" type="date" value={form.availableFrom} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Additional Message</label>
              <textarea className="form-control" name="message" value={form.message} onChange={handleChange} placeholder="Anything else you'd like us to know..." style={{ minHeight: '80px' }} />
            </div>

            <button type="submit" className="btn btn-amber btn-lg" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? 'Submitting...' : 'Submit Application →'}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
