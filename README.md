# PRIMELINK HUMAN CAPITAL S.R.L.
## International Workforce Recruitment Platform
### primelinkhumancapital.com

---

## Company Registration Details
- **Legal Name:** PRIMELINK HUMAN CAPITAL S.R.L.
- **CUI:** 54386335
- **Reg. Nr.:** J2026021244007
- **EUID:** ROONRC.J2026021244007
- **Certificate:** Seria B Nr. 5780913
- **Address:** Str. Aleksandr Sergheevici Pușkin, Nr. 8, Ap. 2, Sector 1, București, Romania
- **CAEN Principal:** 7820 — Temporary Staffing Agency
- **Capital:** 20.000 LEI (€4.000)
- **Administrator:** BHAT BIKASH — Full Powers

---

## Tech Stack
- **Framework:** Next.js 14 (Pages Router)
- **Database:** MongoDB Atlas
- **Styling:** Custom CSS (no Tailwind)
- **Deployment:** Vercel
- **Fonts:** Outfit + DM Sans (Google Fonts)
- **Auth:** JWT-based admin authentication

---

## Pages (20 Total)
1. **/** — Homepage
2. **/about** — About Us + Full Company Registration Details
3. **/services** — All Services + CAEN Codes Table
4. **/for-employers** — Employer Solutions
5. **/for-workers** — Worker Information & Benefits
6. **/industries** — Industries We Serve
7. **/recruitment-process** — 6-Step Process
8. **/why-romania** — Why Work in Romania
9. **/why-choose-us** — Competitive Advantages
10. **/team** — Team & Founder Bio
11. **/testimonials** — Testimonials (placeholder)
12. **/blog** — Blog (placeholder posts)
13. **/faq** — FAQ (Employers, Workers, Legal)
14. **/contact** — Contact Form + Info
15. **/privacy-policy** — GDPR-Compliant Privacy Policy
16. **/terms** — Terms & Conditions
17. **/cookie-policy** — Cookie Policy
18. **/jobs** — Job Listings
19. **/apply** — Worker Application Form
20. **/employer-inquiry** — Employer Inquiry Form

---

## API Routes
- `POST /api/contact` — Contact form submissions
- `POST /api/apply` — Worker applications
- `POST /api/employer-inquiry` — Employer inquiries
- `GET/POST /api/jobs` — Job listings CRUD
- `GET/PUT/DELETE /api/jobs/[id]` — Single job management
- `GET/POST /api/blog` — Blog posts CRUD
- `GET/PUT/DELETE /api/blog/[id]` — Single post management
- `GET/POST /api/testimonials` — Testimonials CRUD
- `POST /api/admin/login` — Admin authentication
- `GET /api/admin/dashboard` — Dashboard stats
- `GET /api/admin/applications` — Applications list
- `GET /api/admin/inquiries` — Inquiries list
- `PUT /api/admin/update-status` — Update application/inquiry/contact status

---

## Setup Instructions

### 1. Clone and Install
```bash
git clone https://github.com/BIKASH907/primelink-human-capital.git
cd primelink-human-capital
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```
Edit `.env.local` with your values:
- **MONGODB_URI** — Your MongoDB Atlas connection string
- **NEXTAUTH_SECRET** — Generate with: `openssl rand -base64 32`
- **ADMIN_EMAIL** — Your admin email (e.g. bikash@primelinkhumancapital.com)
- **ADMIN_PASSWORD** — Your admin password

### 3. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000

### 4. Deploy to Vercel

#### Option A: Vercel CLI
```bash
npm i -g vercel
vercel
```

#### Option B: GitHub Integration
1. Push code to GitHub
2. Go to vercel.com → Import Project
3. Connect your GitHub repo
4. Add environment variables in Vercel dashboard
5. Deploy

### 5. Custom Domain Setup
In Vercel dashboard:
1. Go to Settings → Domains
2. Add `primelinkhumancapital.com`
3. Update DNS records at your domain registrar:
   - Type A: `76.76.21.21`
   - Type CNAME: `cname.vercel-dns.com` (for www)

---

## Git Commands (Quick Deploy)
```bash
# Initialize and push to GitHub
git init
git add .
git commit -m "Initial commit: Primelink Human Capital website"
git branch -M main
git remote add origin https://github.com/BIKASH907/primelink-human-capital.git
git push -u origin main

# Deploy to Vercel
vercel --prod
```

---

## MongoDB Setup
1. Go to mongodb.com/cloud/atlas
2. Create free cluster
3. Create database: `primelink`
4. Collections will be auto-created: contacts, applications, employerinquiries, jobs, blogs, testimonials, admins
5. Get connection string and add to .env.local

---

## Admin Access
1. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local
2. First login to `/api/admin/login` auto-creates the admin account
3. Use the JWT token in Authorization header for admin API calls

---

## After Deployment Checklist
- [ ] Update phone numbers (replace +40 XXX XXX XXX)
- [ ] Add real email addresses
- [ ] Configure SMTP for email notifications
- [ ] Add company logo/favicon
- [ ] Update meta images for social sharing
- [ ] Add Google Analytics
- [ ] Set up Cloudinary for file uploads
- [ ] Create first job listings via API
- [ ] Test all forms (contact, apply, employer inquiry)
- [ ] Verify all legal info matches registration docs

---

© 2026 PRIMELINK HUMAN CAPITAL S.R.L. All rights reserved.
