#!/usr/bin/env bash
# =====================================================
# Quick git push — for fast iteration without full deploy
# Usage:
#   ./quick-push.sh
#   ./quick-push.sh "fix: typo on login screen"
# =====================================================
set -e

MSG="${1:-update: country gate before login (Romania + Turkey)}"
BRANCH="${GIT_BRANCH:-main}"
REMOTE_URL="${GIT_REMOTE_URL:-git@github.com:bikashbhat2001/bhat-overseas-system.git}"

# init if needed
[[ -d .git ]] || { git init && git branch -M "$BRANCH"; }

# remote if missing
git remote get-url origin >/dev/null 2>&1 \
  || git remote add origin "$REMOTE_URL"

# user identity if missing
[[ -n "$(git config user.email || true)" ]] \
  || { git config user.email "bikashbhat2001@gmail.com"; \
       git config user.name  "Bikash Bhat"; }

git add -A
if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  git commit -m "$MSG"
fi

git push -u origin "$BRANCH"
echo "✓ Pushed to $REMOTE_URL ($BRANCH)"
