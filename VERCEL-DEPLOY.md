# Vercel Deployment Guide

Two ways to deploy. **Option A (GitHub integration) is easiest — recommended.**

---

## Option A — Deploy via GitHub (no commands)

This auto-deploys every time you `git push`.

### One-time setup

1. **Push to GitHub** first (if not done):
   ```bash
   git push -u origin main
   ```

2. **Go to Vercel:** <https://vercel.com/signup>
   - Sign up / log in **with your GitHub account** (one-click)

3. **Import the project:**
   - Click **Add New… → Project**
   - Find **`bhat-overseas-system`** in the list → click **Import**

4. **Configure (just one screen):**
   - Framework Preset: **Other**
   - Root Directory: `.` (leave default)
   - Build Command: leave **empty**
   - Output Directory: leave **empty**
   - Install Command: leave **empty**
   - Click **Deploy**

5. Wait ~30 seconds. You'll get a live URL like:
   ```
   https://bhat-overseas-system.vercel.app
   https://bhat-overseas-system-bikashbhat2001.vercel.app
   ```

### From now on

Every time you run `git push`, Vercel **auto-deploys** within 30 seconds. No commands needed.

```bash
./quick-push.sh "your update"
# Vercel deploys automatically
```

---

## Option B — Deploy via Vercel CLI

Use this if you want to deploy without pushing to GitHub first.

### One-time setup

```bash
# Install Vercel CLI globally (needs Node.js installed)
npm install -g vercel

# Log in (opens browser)
vercel login
```

### Every deploy

```bash
cd "/d/Prime Link/bhat-overseas-system"

# Preview deploy (test URL)
vercel

# Production deploy (live URL)
vercel --prod
```

First time you run `vercel`, it asks:

```
? Set up and deploy "~/bhat-overseas-system"? [Y/n]   → Y
? Which scope?                                        → your account
? Link to existing project?                           → N
? What's your project's name?                         → bhat-overseas-system
? In which directory is your code located?            → ./
```

After that, just run `vercel --prod` to deploy.

---

## Custom domain (optional)

Once deployed:

1. Open your project on <https://vercel.com/dashboard>
2. Go to **Settings → Domains**
3. Add your domain (e.g. `bhat-overseas.com`)
4. Vercel shows you the DNS records to add at your registrar
5. Add them → Vercel auto-issues an SSL certificate

---

## What about the backend?

Vercel runs static and serverless workloads. Our **FastAPI backend with SQLite + file uploads** needs a persistent Python server, which Vercel doesn't suit well.

**Recommended backend hosts (free tiers):**

| Host | Free tier | Best for |
|------|-----------|----------|
| **Render.com** | 750 hours/mo | FastAPI + PostgreSQL — easiest |
| **Railway.app** | $5 credit/mo | FastAPI + Postgres + persistent storage |
| **Fly.io** | 3 small VMs | Full control, Docker-based |

For Render (simplest): push to GitHub → New Web Service → connect repo → set root directory to `backend/`, build command `pip install -r requirements.txt`, start command `uvicorn main:app --host 0.0.0.0 --port $PORT`. Done.

Then update the frontend `index.html` to point its API calls to the Render URL (e.g. `https://bhat-overseas-api.onrender.com`).

---

## Current prototype works without a backend

The shipped `index.html` is fully self-contained — it generates sample clients in JavaScript and demonstrates every screen. **You can deploy it to Vercel right now and have a fully working demo.** The backend wiring happens when you're ready to use real data.

---

## Quick checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account linked to GitHub
- [ ] Project imported on vercel.com
- [ ] Live URL works
- [ ] (Optional) Custom domain pointed
- [ ] (Later) Backend deployed to Render
- [ ] (Later) Frontend updated to call Render API
