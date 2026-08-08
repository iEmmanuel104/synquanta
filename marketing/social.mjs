#!/usr/bin/env node
/**
 * Profile and cover art for the Facebook Page, Instagram account and WhatsApp
 * Business profile the ads run from.
 *
 * WHY THIS EXISTS SEPARATELY FROM THE AD PIPELINE
 * These are not ads. They have no concept, no copy sheet and no campaign, so
 * putting them in `out/` would trip verify.mjs's rule that every concept folder
 * needs a launchable `copy/<name>.md`. They also outlive any campaign. Own
 * script, own directory, same brand layer.
 *
 * WHAT THEY REPLACE
 * `design-assets/brand/social-profile-image.svg` (400x400) and
 * `social-banner.svg` (1500x500). Both draw the PREVIOUS-generation
 * `synquanta-logo-*` mark, and 1500x500 is a Twitter/LinkedIn banner — it is
 * not a Facebook cover and gets cropped badly as one. Neither is used here.
 *
 * Unlike build.mjs this renders as it goes, so there is no separate step and
 * nothing to run in the wrong order.
 *
 *   node social.mjs
 */
import { mkdirSync, writeFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, GRADIENT, FONT_CSS, DISPLAY_STACK, logoWhite, markWhite } from './lib/brand.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'social');

/**
 * Sizes are upload sizes, not display sizes. Every platform downscales, none
 * upscales, so uploading at the display size guarantees a soft logo on a
 * retina phone.
 */
const ASSETS = {
  // Facebook, Instagram and WhatsApp Business all crop the avatar to a CIRCLE.
  // Anything outside the inscribed circle is gone, and the corners are gone
  // first — so the mark sits well inside it and nothing but background reaches
  // an edge. Uploaded square; each platform does its own crop.
  avatar: {
    w: 1080, h: 1080,
    note: 'FB / IG / WhatsApp Business profile picture. Cropped to a circle.',
    body: `
      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
        ${markWhite(560)}
      </div>`,
  },
  // Facebook renders a Page cover at 820x312 on desktop but crops to roughly
  // the centre 640px on mobile. Rendered at 2x, with everything inside that
  // centre band so the phone crop cannot cut the wordmark.
  cover: {
    w: 1640, h: 624,
    safeW: 1280,
    note: 'Facebook Page cover. Mobile crops to the centre — keep art inside 1280px.',
    body: `
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;
                  align-items:center;justify-content:center;gap:34px">
        ${logoWhite(560)}
        <div style="font-family:${DISPLAY_STACK};font-size:38px;font-weight:600;
                    letter-spacing:.01em;color:${C.mintPale};text-align:center">
          Web &amp; mobile product studio
        </div>
      </div>`,
  },
};

function html({ w, h, body }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>
${FONT_CSS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:${GRADIENT.darkHero};position:relative;color:${C.white};
  -webkit-font-smoothing:antialiased}
.grid-tex{position:absolute;inset:0;opacity:.5;
  background-image:
    linear-gradient(rgba(82,183,136,.10) 1px,transparent 1px),
    linear-gradient(90deg,rgba(82,183,136,.10) 1px,transparent 1px);
  background-size:${Math.round(w / 9)}px ${Math.round(w / 9)}px}
.glow{position:absolute;width:${Math.round(w * 0.9)}px;height:${Math.round(w * 0.9)}px;
  left:50%;top:50%;transform:translate(-50%,-50%);
  background:radial-gradient(circle,rgba(82,183,136,.16) 0%,transparent 62%)}
</style></head>
<body><div class="grid-tex"></div><div class="glow"></div>${body}</body></html>`;
}

const CHROME = ['google-chrome', 'google-chrome-stable', 'chromium'].find((c) => {
  try {
    execFileSync('command', ['-v', c], { shell: '/bin/bash', stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
});
if (!CHROME) {
  console.error('No Chrome/Chromium on PATH — needed because Clash Display is woff2-only.');
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), 'sq-social-'));

for (const [name, a] of Object.entries(ASSETS)) {
  const htmlPath = join(OUT, `${name}.html`);
  const pngPath = join(OUT, `${name}.png`);
  writeFileSync(htmlPath, html({ ...a, body: a.body }));
  execFileSync(
    CHROME,
    [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      `--user-data-dir=${profile}`,
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=5000',
      '--force-device-scale-factor=1',
      `--window-size=${a.w},${a.h}`,
      `--screenshot=${pngPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: 'ignore' },
  );
  if (!existsSync(pngPath)) {
    console.error(`  ! render failed: ${name}`);
    process.exit(1);
  }
  console.log(`  ${name.padEnd(8)} ${a.w}x${a.h}  ${a.note}`);
}

rmSync(profile, { recursive: true, force: true });
console.log(`\n2 assets written to marketing/social/`);
