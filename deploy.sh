#!/usr/bin/env bash
# =====================================================
# BHAT OVERSEAS SYSTEM — Deploy script
# =====================================================
# Usage:
#   ./deploy.sh                    # full flow: commit + push + deploy
#   ./deploy.sh --git-only         # commit + push, skip deploy
#   ./deploy.sh --frontend-only    # only deploy frontend (Vercel)
#   ./deploy.sh --backend-only     # only deploy backend (server SSH)
#   ./deploy.sh --message "msg"    # custom commit message
# =====================================================

set -e   # exit on first error
set -u   # error on undefined vars

# ---------- COLORS ----------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${BLUE}[deploy]${NC} $1"; }
ok()   { echo -e "${GREEN}[ok]${NC} $1"; }
warn() { echo -e "${YELLOW}[warn]${NC} $1"; }
fail() { echo -e "${RED}[fail]${NC} $1"; exit 1; }

# ---------- CONFIG (edit these) ----------
GIT_REMOTE_URL="${GIT_REMOTE_URL:-git@github.com:bikashbhat2001/bhat-overseas-system.git}"
GIT_BRANCH="${GIT_BRANCH:-main}"

# Backend deploy target (SSH)
BACKEND_HOST="${BACKEND_HOST:-deploy@bhat-server.example.com}"
BACKEND_DIR="${BACKEND_DIR:-/var/www/bhat-overseas/backend}"
BACKEND_SERVICE="${BACKEND_SERVICE:-bhat-backend}"

# Frontend deploy target (Vercel by default — falls back to scp)
FRONTEND_HOST="${FRONTEND_HOST:-$BACKEND_HOST}"
FRONTEND_DIR="${FRONTEND_DIR:-/var/www/bhat-overseas/frontend}"

# ---------- ARG PARSING ----------
MODE="full"
COMMIT_MSG=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --git-only)        MODE="git";       shift ;;
    --frontend-only)   MODE="frontend";  shift ;;
    --backend-only)    MODE="backend";   shift ;;
    --message|-m)      COMMIT_MSG="$2";  shift 2 ;;
    -h|--help)
      sed -n '4,15p' "$0"; exit 0 ;;
    *) fail "Unknown flag: $1" ;;
  esac
done

# ---------- AUTO COMMIT MESSAGE ----------
if [[ -z "$COMMIT_MSG" ]]; then
  COMMIT_MSG="chore: country gate (Romania + Turkey) before login

- Country selection moved BEFORE login screen
- Romania routes to legacy backend (no changes)
- Turkey continues into new dashboard
- Updated README and frontend flow"
fi

# =====================================================
# STEP 1 — GIT (init / commit / push)
# =====================================================
do_git() {
  log "Step 1 — Git commit & push"

  # Init repo if needed
  if [[ ! -d ".git" ]]; then
    log "Initialising new repo…"
    git init
    git branch -M "$GIT_BRANCH"
  fi

  # Configure user if not set
  if [[ -z "$(git config user.email || true)" ]]; then
    git config user.email "bikashbhat2001@gmail.com"
    git config user.name  "Bikash Bhat"
  fi

  # Add remote if missing
  if ! git remote get-url origin >/dev/null 2>&1; then
    log "Adding remote: $GIT_REMOTE_URL"
    git remote add origin "$GIT_REMOTE_URL"
  fi

  # Stage everything respecting .gitignore
  git add -A

  # Bail if nothing to commit
  if git diff --cached --quiet; then
    warn "No staged changes — skipping commit."
  else
    git commit -m "$COMMIT_MSG"
    ok "Committed."
  fi

  # Push
  log "Pushing to origin/$GIT_BRANCH …"
  git push -u origin "$GIT_BRANCH"
  ok "Pushed."
}

# =====================================================
# STEP 2 — DEPLOY BACKEND (FastAPI on a Linux box)
# =====================================================
do_backend() {
  log "Step 2 — Deploy backend to $BACKEND_HOST:$BACKEND_DIR"

  ssh "$BACKEND_HOST" bash -s <<EOF
set -e
cd "$BACKEND_DIR"
echo "[remote] git pull"
git pull origin "$GIT_BRANCH"

cd backend
echo "[remote] activating venv & installing deps"
source .venv/bin/activate
pip install -q -r requirements.txt

echo "[remote] running migrations / seed"
python -c "from database import init_db; init_db()"

echo "[remote] restarting service"
sudo systemctl restart "$BACKEND_SERVICE"
sudo systemctl --no-pager status "$BACKEND_SERVICE" | head -n 5
EOF
  ok "Backend deployed."
}

# =====================================================
# STEP 3 — DEPLOY FRONTEND (single-file index.html)
# =====================================================
do_frontend() {
  log "Step 3 — Deploy frontend"

  if [[ -f "vercel.json" ]]; then
    if command -v vercel >/dev/null 2>&1; then
      log "Deploying via Vercel CLI…"
      vercel --prod --yes
      ok "Frontend deployed via Vercel."
      return
    else
      warn "vercel.json found but Vercel CLI not installed."
      warn "If your repo is linked to Vercel via GitHub, the push above already triggered a deploy."
      warn "Otherwise install with: npm install -g vercel && vercel login"
      return
    fi
  fi

  log "Vercel not configured → using scp to $FRONTEND_HOST:$FRONTEND_DIR"
  ssh "$FRONTEND_HOST" "mkdir -p $FRONTEND_DIR"
  scp index.html "$FRONTEND_HOST:$FRONTEND_DIR/index.html"
  ssh "$FRONTEND_HOST" "sudo systemctl reload nginx || true"
  ok "Frontend deployed via scp."
}

# =====================================================
# RUN
# =====================================================
log "BHAT OVERSEAS — deploy mode: $MODE"

case "$MODE" in
  full)     do_git;      do_backend; do_frontend ;;
  git)      do_git ;;
  backend)  do_git;      do_backend ;;
  frontend) do_git;      do_frontend ;;
esac

ok "Done."
