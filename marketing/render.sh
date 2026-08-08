#!/usr/bin/env bash
# Rasterise every generated creative to a pixel-exact PNG.
#
# NOTE the difference from documents/asll-bid/render.sh: that script uses
# --print-to-pdf, which is PAGE-sized (A4). Ad creative has to be
# PIXEL-exact, so this uses --screenshot with an explicit --window-size.
#
# --virtual-time-budget + --run-all-compositor-stages-before-draw are what let
# the inlined webfonts load and lay out before the frame is captured. Without
# them Clash Display silently falls back to Inter and every headline is wrong.
set -euo pipefail
cd "$(dirname "$0")"

CHROME="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || true)"
[ -n "$CHROME" ] || { echo "No Chrome/Chromium on PATH." >&2; exit 1; }

# Placement -> exact output canvas. Must match PLACEMENTS in lib/brand.mjs.
declare -A SIZE=(
  [status]="1080,1920"
  [story]="1080,1920"
  [feed45]="1080,1350"
  [feed11]="1080,1080"
  [link]="1200,628"
)

PROFILE="$(mktemp -d)"
trap 'rm -rf "$PROFILE"' EXIT

shopt -s nullglob
n=0
for html in out/*/*.html; do
  placement="$(basename "$html" .html)"
  dims="${SIZE[$placement]:-}"
  [ -n "$dims" ] || { echo "  ! no size for placement '$placement', skipping" >&2; continue; }

  png="${html%.html}.png"
  "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --user-data-dir="$PROFILE" \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget=5000 \
    --force-device-scale-factor=1 \
    --window-size="$dims" \
    --screenshot="$png" \
    "file://$PWD/$html" >/dev/null 2>&1

  [ -f "$png" ] || { echo "  ! render failed: $html" >&2; exit 1; }
  echo "  $(printf '%-34s' "$png") $dims"
  n=$((n+1))
done

echo
echo "$n PNGs rendered."
echo "Next: node verify.mjs"
