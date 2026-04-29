# Live Deploy on Render.com (5 minutes)

Render is the **best free host for FastAPI apps with database + file uploads**. Vercel is great for static frontends, but it's serverless — not suited for FastAPI with persistent SQLite/Postgres + OCR.

## What you'll get

A live, multi-page website at:

```
https://bhat-overseas.onrender.com
```

with:
- Country gate (Romania / Turkey)
- Login (3 roles)
- Pipeline page, client detail page, documents, overview, CV builder, settings
- PostgreSQL database (free tier, 256 MB)
- Auto-deploy on every `git push`

## Step 1 — Push the new files to GitHub

In Git Bash (you're already in the project folder):

```bash
git add -A
git commit -m "feat: multi-page server-rendered app + Render deploy"
git push
```

## Step 2 — Sign up on Render

1. Go to <https://render.com/signup>
2. Click **Sign in with GitHub** → authorize

## Step 3 — Deploy via Blueprint (the file we just shipped does everything)

1. On Render dashboard, click **New +** → **Blueprint**
2. Connect your `bhat-overseas-system` GitHub repo
3. Render reads `render.yaml` and shows: **1 Web Service + 1 PostgreSQL**
4. Click **Apply**

That's it. Render will:
- Provision the Postgres database
- Build the Python app (`pip install -r requirements.txt`)
- Start it (`uvicorn main:app`)
- Wire env vars (`DATABASE_URL`, `JWT_SECRET`, etc.)

**First build takes ~3–5 minutes.** Watch the logs in real time.

## Step 4 — Open your live URL

Once the build shows **"Live"**, click the URL at the top. You'll see the Romania/Turkey gate page. Pick Turkey → log in with:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `bikash@bhatoverseas.com` | `ChangeMe123!` |
| Admin | `anita@bhatoverseas.com` | `ChangeMe123!` |
| Sub-Admin | `ravi.docs@bhatoverseas.com` | `ChangeMe123!` |

**Change these passwords immediately** in the Settings page.

## Step 5 — Auto-deploy on push

From now on, every `git push` to `main` triggers Render to rebuild and redeploy in ~60 seconds. No commands.

```bash
./quick-push.sh "fix: typo on login page"
# Render auto-deploys
```

## Free tier notes

- **Web service free tier sleeps after 15 min of no traffic** — first request after sleep takes ~30 sec to wake up. Upgrade to Starter ($7/mo) for always-on.
- **Postgres free tier expires after 90 days** — you'll need to back up + recreate, or upgrade ($7/mo, $19/mo, etc.)
- **Disk storage is ephemeral** on the free tier — file uploads (`./storage/`) won't persist across deploys. For real document storage, attach a Render Disk ($1/mo per 5 GB) or use S3-compatible cloud storage.

## Add a custom domain (optional)

1. On Render → your service → **Settings → Custom Domains**
2. Add `bhat-overseas.com` (or whatever you own)
3. Render shows the DNS record to add at your domain registrar (CNAME)
4. Wait ~5 min — SSL is auto-issued by Let's Encrypt

## Local development

```bash
cd backend
python -m venv .venv
source .venv/bin/activate              # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Then open <http://localhost:8000>.

The app uses **SQLite locally** (file: `bhat_overseas.db`) and **Postgres on Render**. Same code — controlled by `DATABASE_URL`.

## Troubleshooting

**Build fails with "module not found"** — make sure `backend/requirements.txt` is committed.

**App starts but DB has no users** — Render auto-runs `init_db()` which seeds the 3 demo users on first boot. If something went wrong, run from Render's Shell tab:
```bash
python -c "from database import init_db; init_db()"
python seed_demo.py
```

**Want to reset the database** — go to your DB on Render → **Settings → Delete** → recreate from blueprint. (Or run a `DROP TABLE …` in the connect-DB shell.)

**OCR not extracting names** — Tesseract isn't pre-installed on Render's free tier. The OCR service auto-falls back to mock data so the demo works. To use real OCR, switch `OCR_BACKEND=google` in env vars and add `google-cloud-vision` to requirements with a service-account JSON.

**Need to debug live** — Render service → **Logs** tab shows live `stdout`. Click **Shell** to run commands inside the container.

## Vercel vs Render — quick comparison for this app

| | Render | Vercel |
|--|--------|--------|
| Python FastAPI | ✅ Native | ⚠ Serverless only |
| Persistent DB | ✅ Free Postgres | ⚠ Need external (Neon, Supabase) |
| File uploads | ✅ Disk/S3 | ❌ Ephemeral fs |
| Build time | ~3 min | ~30 sec |
| Free SSL + custom domain | ✅ | ✅ |
| Sleeps when idle (free tier) | Yes | N/A (cold starts on demand) |

For this app: **use Render**. Use Vercel if you later split off a static React frontend.
