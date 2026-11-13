#!/usr/bin/env bash
# Production deploy: build → Cloudflare Pages project "synquanta" → IndexNow ping.
# Run through `sq deploy website` (refuses a dirty tree and records the SHA).
# The Cloudflare token is read from this Mac's local env file, never from the repo.
set -euo pipefail
cd "$(dirname "$0")/.."
CF_ENV="${CF_ENV:-$HOME/.config/umbrelar/cloudflare.env}"
get() { grep -E "^$1=" "$CF_ENV" | head -1 | cut -d= -f2- | tr -d "\"' "; }
export CLOUDFLARE_API_TOKEN="$(get CLOUDFLARE_API_TOKEN)" CLOUDFLARE_ACCOUNT_ID="$(get CLOUDFLARE_ACCOUNT_ID)"
npm run build
node scripts/pages-postbuild.mjs
wrangler pages deploy dist --project-name synquanta --branch main \
  --commit-hash "$(git rev-parse HEAD)" --commit-message "$(git log -1 --format=%s | cut -c1-200)"
npm run indexnow
