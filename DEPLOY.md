# Deploy Guide — Bhat Overseas System

Two scripts ship with the repo:

| Script | When to use |
|--------|-------------|
| `quick-push.sh` | Fast iteration — just commit and push to GitHub |
| `deploy.sh`     | Full release — push + deploy backend + deploy frontend |

## One-time setup (first run)

```bash
cd "/d/Prime Link/bhat-overseas-system"

# 1) Make scripts executable
chmod +x deploy.sh quick-push.sh

# 2) Set your GitHub repo URL (or edit the default in the script)
export GIT_REMOTE_URL="git@github.com:bikashbhat2001/bhat-overseas-system.git"

# 3) Set deploy targets if you have a server
export BACKEND_HOST="deploy@your-server.com"
export BACKEND_DIR="/var/www/bhat-overseas/backend"
export BACKEND_SERVICE="bhat-backend"   # systemd unit name

# 4) Make sure SSH key is set up:
ssh-keygen -t ed25519 -C "bikashbhat2001@gmail.com"
cat ~/.ssh/id_ed25519.pub      # add this to GitHub → Settings → SSH Keys
```

## Just push to GitHub

```bash
./quick-push.sh
# or with a custom message:
./quick-push.sh "feat: 30-day police-report popup"
```

## Push + deploy everything

```bash
./deploy.sh
# with custom commit message:
./deploy.sh -m "release: country gate before login"
```

## Partial deploys

```bash
./deploy.sh --git-only          # just commit + push, no server deploy
./deploy.sh --frontend-only     # only push the index.html (Vercel or scp)
./deploy.sh --backend-only      # only redeploy FastAPI + restart service
```

## What `deploy.sh` does on the remote server

1. `git pull` the latest commit
2. `pip install -r requirements.txt` (inside the venv)
3. Run `init_db()` to apply any new tables / seeds
4. `sudo systemctl restart bhat-backend` to pick up the code
5. Show the first 5 lines of service status

## Windows (Git Bash / WSL)

Both scripts run as-is in **Git Bash** (ships with Git for Windows) or **WSL**. From PowerShell, prefix with `bash`:

```powershell
bash ./quick-push.sh
bash ./deploy.sh
```

## Optional — Vercel for frontend

The frontend is a single `index.html`, so any static host works. For Vercel:

```bash
npm i -g vercel
vercel link        # pick your project once
vercel --prod      # deploy.sh will use this automatically if vercel.json exists
```

## Optional — systemd unit for the backend

`/etc/systemd/system/bhat-backend.service`:

```ini
[Unit]
Description=Bhat Overseas FastAPI
After=network.target

[Service]
User=deploy
WorkingDirectory=/var/www/bhat-overseas/backend
EnvironmentFile=/var/www/bhat-overseas/backend/.env
ExecStart=/var/www/bhat-overseas/backend/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable once: `sudo systemctl enable --now bhat-backend`.
