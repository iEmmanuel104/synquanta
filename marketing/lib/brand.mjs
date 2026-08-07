/**
 * Shared brand layer for every piece of ad creative.
 *
 * Values are copied from `src/styles/brand.css`, which is the canonical token
 * source. If a colour ever disagrees, brand.css wins.
 *
 * Everything here inlines: fonts as base64 woff2, logos as SVG markup. A
 * rendered creative must be a single self-contained HTML file, because Chrome
 * screenshots it from `file://` with no server and no network.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
export const WEBSITE = join(HERE, '..', '..');

// ---------------------------------------------------------------- colours

export const C = {
  forestDeep: '#1B4332',
  forestPrimary: '#2D6A4F',
  sageMedium: '#40916C',
  sageLight: '#52B788',
  mintSoft: '#74C69D',
  mintPale: '#95D5B2',
  creamGreen: '#D8F3DC',
  charcoal: '#1A1F1C',
  mediumGray: '#74796E',
  lightGray: '#95A097',
  offWhite: '#F8FAF9',
  white: '#FFFFFF',
  // Not in brand.css but used throughout brand-kit/index.html for dark hero ends.
  forestNight: '#122F22',
};

export const GRADIENT = {
  primary: `linear-gradient(135deg, ${C.forestDeep} 0%, ${C.forestPrimary} 50%, ${C.sageMedium} 100%)`,
  accent: `linear-gradient(90deg, ${C.sageMedium} 0%, ${C.sageLight} 100%)`,
  text: `linear-gradient(90deg, ${C.sageLight} 0%, ${C.mintSoft} 50%, ${C.mintPale} 100%)`,
  // The dark hero treatment from brand-kit/index.html, verbatim.
  darkHero: `radial-gradient(800px 380px at 80% -10%, rgba(82,183,136,.18), transparent 60%), linear-gradient(150deg, ${C.forestDeep}, ${C.forestNight})`,
};

// ------------------------------------------------------------------ type
//
// Clash Display exists ONLY as woff2 in this repo — there is no TTF/OTF
// anywhere. That is why every creative renders through headless Chrome: no
// other rasteriser on this machine can set the display face.

const font = (file) =>
  readFileSync(join(WEBSITE, 'public', 'fonts', file)).toString('base64');

export const FONT_CSS = `
@font-face{font-family:'Inter';src:url(data:font/woff2;base64,${font('inter.woff2')}) format('woff2');font-weight:300 700;font-style:normal;font-display:block}
@font-face{font-family:'Clash Display';src:url(data:font/woff2;base64,${font('clash-display-600.woff2')}) format('woff2');font-weight:600;font-style:normal;font-display:block}
@font-face{font-family:'Clash Display';src:url(data:font/woff2;base64,${font('clash-display-700.woff2')}) format('woff2');font-weight:700;font-style:normal;font-display:block}
@font-face{font-family:'JetBrains Mono';src:url(data:font/woff2;base64,${font('jetbrains-mono.woff2')}) format('woff2');font-weight:400 500;font-style:normal;font-display:block}
`;

// Clash runs tight and its word gaps collapse; src/styles/index.css corrects
// both on h1/h2. Carry the same two overrides into every creative.
export const DISPLAY_STACK = `'Clash Display','Inter',system-ui,sans-serif`;
export const BODY_STACK = `'Inter',system-ui,-apple-system,sans-serif`;
export const MONO_STACK = `'JetBrains Mono',ui-monospace,monospace`;

// ------------------------------------------------------------------ logo

const svg = (name) =>
  readFileSync(join(WEBSITE, 'public', 'brand-kit', name), 'utf8')
    .replace(/<\?xml[^>]*\?>/g, '')
    .trim();

/** Horizontal lockup, reversed. For dark creative. */
export const logoWhite = (width = 300) =>
  svg('orbit-atom-logo-white.svg').replace(
    /width="430" height="104"/,
    `width="${width}" height="${Math.round((width / 430) * 104)}"`,
  );

/** Mark only, reversed. For square/compact formats. */
export const markWhite = (size = 96) =>
  svg('orbit-atom-logomark-white.svg').replace(
    /width="96" height="96"/,
    `width="${size}" height="${size}"`,
  );

/**
 * Minimum sizes from design-assets/brand/brand-guidelines.html: full lockup
 * 120px wide digital, mark alone 24px. Nothing below that ships.
 */
export const MIN_LOCKUP_PX = 120;
export const MIN_MARK_PX = 24;

/**
 * Clear space. The guidelines say "adequate" and never give a number, so this
 * pins one: the height of the mark's inner core circle, r=9 in a 96 viewBox,
 * i.e. 18/96 of mark height. Documented here so every asset uses the same rule.
 */
export const clearSpace = (markPx) => Math.round((18 / 96) * markPx);

// ------------------------------------------------------------- placements
//
// Verified against current platform guidance, 2026-08. Meta has never
// published a creative spec for WhatsApp Status ads; the safe zone below is
// derived from the Status UI itself (sender name top, reply bar bottom).

export const PLACEMENTS = {
  status: { w: 1080, h: 1920, safeTop: 120, safeBottom: 200, label: 'WhatsApp Status' },
  story: { w: 1080, h: 1920, safeTop: 120, safeBottom: 200, label: 'IG/FB Stories + Reels' },
  feed45: { w: 1080, h: 1350, safeTop: 48, safeBottom: 48, label: 'Feed 4:5' },
  feed11: { w: 1080, h: 1080, safeTop: 48, safeBottom: 48, label: 'Feed / carousel 1:1' },
  link: { w: 1200, h: 628, safeTop: 40, safeBottom: 40, label: 'Link ad 1.91:1' },
};

// ---------------------------------------------------------------- shell

/**
 * Wrap a creative's body markup in a self-contained document sized exactly to
 * the placement. `--pad` scales with the canvas so one layout survives every
 * aspect ratio without per-placement pixel nudging.
 */
export function page({ placement, body, extraCss = '' }) {
  const p = PLACEMENTS[placement];
  if (!p) throw new Error(`Unknown placement: ${placement}`);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>
${FONT_CSS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${p.w}px;height:${p.h}px;overflow:hidden}
body{
  font-family:${BODY_STACK};
  color:${C.white};
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
  background:${GRADIENT.darkHero};
  position:relative;
}
.canvas{
  position:absolute;inset:0;
  display:flex;flex-direction:column;
  padding:${p.safeTop}px ${Math.round(p.w * 0.075)}px ${p.safeBottom}px;
}
h1,h2,.display{
  font-family:${DISPLAY_STACK};
  font-weight:600;
  letter-spacing:-0.005em;
  word-spacing:0.06em;
  line-height:1.06;
}
.mono{font-family:${MONO_STACK};font-variant-numeric:tabular-nums}
.grad{background:${GRADIENT.text};-webkit-background-clip:text;background-clip:text;color:transparent}
.eyebrow{
  font-size:${Math.round(p.w * 0.0195)}px;font-weight:600;
  letter-spacing:0.26em;text-transform:uppercase;color:${C.mintPale};
}
/* Faint brand grid, same motif as the site's dark bands. */
.grid-tex{
  position:absolute;inset:0;pointer-events:none;opacity:.5;
  background-image:
    linear-gradient(rgba(82,183,136,.10) 1px,transparent 1px),
    linear-gradient(90deg,rgba(82,183,136,.10) 1px,transparent 1px);
  background-size:${Math.round(p.w / 9)}px ${Math.round(p.w / 9)}px;
}
.ring{
  position:absolute;border:1px solid rgba(149,213,178,.14);border-radius:50%;
  pointer-events:none;
}
${extraCss}
</style></head>
<body>
<div class="grid-tex"></div>
${body}
</body></html>`;
}
