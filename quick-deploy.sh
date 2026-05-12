#!/usr/bin/env bash
# ============================================================================
# Primelink Human Capital — Quick Deploy
# ----------------------------------------------------------------------------
# Builds, commits, syncs with remote master, and pushes. Vercel auto-deploys
# from master via the GitHub integration.
#
# Usage (from anywhere in Git Bash):
#   bash "/d/New folder (3)/primelink-human-capital/primelink-human-capital/quick-deploy.sh"
#   bash "/d/New folder (3)/primelink-human-capital/primelink-human-capital/quick-deploy.sh" "your commit message"
#
# Or from inside the project folder:
#   bash quick-deploy.sh
#   bash quick-deploy.sh "your commit message"
#
# Flags:
#   --force         Force-push (overwrites remote master) — last resort
#   --skip-build    Skip `npm run build`
#   --skip-pull     Skip rebase from remote master
# ============================================================================

set -e

PROJECT_DIR="/d/New folder (3)/primelink-human-capital/primelink-human-capital"

# ---- parse args ----------------------------------------------------------
FORCE=false; SKIP_BUILD=false; SKIP_PULL=false; MSG=""
for arg in "$@"; do
  case "$arg" in
    --force)       FORCE=true ;;
    --skip-build)  SKIP_BUILD=true ;;
    --skip-pull)   SKIP_PULL=true ;;
    *)             MSG="$arg" ;;
  esac
done
[[ -z "$MSG" ]] && MSG="deploy: update $(date '+%Y-%m-%d %H:%M:%S')"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${BLUE}[deploy]${NC} $*"; }
ok()   { echo -e "${GREEN}[ok]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
fail() { echo -e "${RED}[fail]${NC} $*" >&2; exit 1; }

# Skip Vim/Nano popups on commits/merges
export GIT_EDITOR=true

log "Project: $PROJECT_DIR"
cd "$PROJECT_DIR" || fail "Project folder not found."

# ---- 0. recover from interrupted rebase/merge ----------------------------
if [[ -d .git/rebase-merge || -d .git/rebase-apply ]]; then
  warn "Rebase in progress — continuing..."
  git add -A
  git rebase --continue || fail "Rebase still has conflicts. Fix them, then re-run."
  ok "Rebase finished."
fi
if [[ -f .git/MERGE_HEAD ]]; then
  warn "Merge in progress — finishing..."
  git add -A
  git commit -m "merge: resolve incoming changes" || fail "Merge has conflicts. Fix them, then re-run."
  ok "Merge finished."
fi

# ---- 1. build ------------------------------------------------------------
if ! $SKIP_BUILD; then
  log "Building (catches errors before pushing)..."
  npm run build || fail "Build failed. Fix errors before deploying."
  ok "Build succeeded."
fi

# ---- 2. commit any local changes -----------------------------------------
git add -A
if git diff --cached --quiet; then
  log "Nothing new to commit."
else
  git commit -m "$MSG"
  ok "Committed: $MSG"
fi

# ---- 3. sync local with remote master ------------------------------------
if ! $SKIP_PULL; then
  log "Fetching origin/master..."
  git fetch origin master || fail "Fetch failed. Check network/auth."

  if ! git merge-base --is-ancestor origin/master HEAD 2>/dev/null; then
    log "Rebasing local main onto origin/master..."
    git rebase origin/master || fail "Rebase has conflicts. Run: git status, fix, git add ., git rebase --continue, then re-run."
    ok "Rebase clean."
  else
    log "Local already has origin/master."
  fi
fi

# ---- 4. push to master (triggers Vercel auto-deploy) ---------------------
log "Pushing main → master..."
if $FORCE; then
  warn "Force-pushing — overwrites remote master."
  git push origin main:master --force || fail "Force push failed."
else
  git push origin main:master || fail "Push rejected. If you're sure your local main has everything, re-run with --force."
fi

ok "Pushed. Vercel should auto-deploy in ~1-2 minutes."
ok "All done."
