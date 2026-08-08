#!/usr/bin/env node
/**
 * Guard the rendered creative before anything is published.
 *
 * Five checks, in order of how expensive the mistake is:
 *   1. PIXEL DIMENSIONS — a 1079px-wide Status frame gets letterboxed or
 *      rejected. Read straight from the PNG header, no dependencies.
 *   2. SAFE ZONES — each 9:16 placement reserves a band that platform UI
 *      covers. The two are very different (Status 120/200, Reels 270/670), so
 *      this reads the numbers per placement from PLACEMENTS rather than
 *      assuming one rule. It samples the rendered pixels, not the CSS.
 *   3. DISTINCTNESS — two placements that render byte-identical output mean a
 *      layout is ignoring its own safe zone. That exact bug shipped once: the
 *      Stories asset was a copy of the Status one, so its logo and URL sat
 *      under Instagram's caption and Learn More button. Never again silently.
 *   4. PRICE CLAIMS — any price appearing in creative must match
 *      src/constants/hvac.ts exactly, because Paddle cross-checks published
 *      prices against the catalog.
 *   5. AD COPY — every concept has a launchable copy sheet, and every field in
 *      it fits the length Meta actually SHOWS rather than the length it
 *      accepts. Also checks each sheet's own declared character counts, which
 *      were wrong on 15 of 17 fields when hand-written.
 *
 * Same spirit as documents/asll-bid/verify.mjs, which guards bid prose.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLACEMENTS } from './lib/brand.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');
const WEBSITE = join(HERE, '..');

let failures = 0;
const fail = (m) => {
  console.error(`  FAIL  ${m}`);
  failures++;
};
const pass = (m) => console.log(`  ok    ${m}`);

/** PNG dimensions from the IHDR chunk. Bytes 16-23 of a PNG are width|height BE. */
function pngSize(file) {
  const b = readFileSync(file);
  if (b.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${file} is not a PNG`);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

if (!existsSync(OUT)) {
  console.error('No marketing/out — run `node build.mjs && ./render.sh` first.');
  process.exit(1);
}

// ---------------------------------------------------------------- 1. sizes
console.log('\nDimensions');
const pngs = [];
for (const concept of readdirSync(OUT)) {
  const dir = join(OUT, concept);
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
    const placement = basename(f, '.png');
    const spec = PLACEMENTS[placement];
    const file = join(dir, f);
    pngs.push({ concept, placement, file, spec });
    if (!spec) {
      fail(`${concept}/${f}: no placement spec named "${placement}"`);
      continue;
    }
    const { w, h } = pngSize(file);
    if (w !== spec.w || h !== spec.h) {
      fail(`${concept}/${f}: ${w}x${h}, expected ${spec.w}x${spec.h}`);
    } else {
      pass(`${concept}/${f} ${w}x${h}`);
    }
  }
}

// ------------------------------------------------------------ 2. safe zones
//
// Measure INK, not average brightness.
//
// The first version of this check compared a band's mean luminance against the
// strip next to it, and it was wrong: it read the photograph in the top band as
// intruding content and failed a creative that was correctly laid out. Mean
// luminance cannot tell a headline from a bright sky.
//
// What actually matters is whether *copy* sits under platform UI, and copy is
// the only thing on these canvases that is near-white. Measured across the
// current set: the ad photography is darkened to a maximum of 0.44 normalised
// luminance, while type sits above 0.9. Thresholding at 0.75 therefore
// separates them with a margin no gradient or photograph can cross — reserved
// bands score exactly 0.000, the content area scores 0.03-0.05.
//
// ImageMagick 6 (`convert`) is present on this machine; skip if it is not.
const INK_THRESHOLD = '75%';
// Antialiasing on a stray glyph edge could leave a handful of pixels; require
// a real mark before failing. 0.0005 of a 1080x670 band is ~360 pixels.
const INK_TOLERANCE = 0.0005;

console.log('\nSafe zones (9:16 only — per-placement, see PLACEMENTS)');
let haveIM = true;
try {
  execFileSync('convert', ['-version'], { stdio: 'ignore' });
} catch {
  haveIM = false;
  console.log('  skip  ImageMagick `convert` not found');
}

/** Fraction of pixels in `geom` bright enough to be type rather than imagery. */
const inkIn = (file, geom) =>
  parseFloat(
    execFileSync(
      'convert',
      [file, '-crop', geom, '+repage', '-colorspace', 'gray', '-threshold', INK_THRESHOLD,
       '-format', '%[fx:mean]', 'info:'],
      { encoding: 'utf8' },
    ).trim(),
  );

if (haveIM) {
  for (const { concept, placement, file, spec } of pngs) {
    if (!spec || spec.h / spec.w < 1.5) continue; // status + story only
    const { w, h, safeTop, safeBottom, safeSide } = spec;
    const mid = h - safeTop - safeBottom; // the band copy is allowed to occupy
    const bands = {
      top: `${w}x${safeTop}+0+0`,
      bottom: `${w}x${safeBottom}+0+${h - safeBottom}`,
      left: `${safeSide}x${mid}+0+${safeTop}`,
      right: `${safeSide}x${mid}+${w - safeSide}+${safeTop}`,
    };
    const dirty = Object.entries(bands)
      .map(([name, geom]) => [name, inkIn(file, geom)])
      .filter(([, ink]) => ink > INK_TOLERANCE);

    if (!dirty.length) {
      pass(
        `${concept}/${placement} clear of ${safeTop}/${safeBottom}/${safeSide}px ` +
          `reserved for ${spec.label}`,
      );
    } else {
      fail(
        `${concept}/${placement}: copy sits under ${spec.label} UI — ` +
          dirty.map(([n, v]) => `${n} band ${(v * 100).toFixed(2)}% ink`).join(', '),
      );
    }
  }
}

// ----------------------------------------------------------- 3. distinctness
//
// Two placements with the same canvas size can legitimately share a design
// only if they also share a safe zone — and none of ours do. Identical bytes
// therefore mean one of them was rendered against the wrong reserved band.
console.log('\nDistinctness');
const byHash = new Map();
let dupes = 0;
for (const { concept, placement, file } of pngs) {
  const h = createHash('sha256').update(readFileSync(file)).digest('hex');
  const key = `${concept}:${h}`;
  if (byHash.has(key)) {
    dupes++;
    fail(
      `${concept}/${placement} is byte-identical to ${concept}/${byHash.get(key)} — ` +
        `these placements reserve different bands, so one is ignoring its safe zone`,
    );
  } else {
    byHash.set(key, placement);
  }
}
if (!dupes) pass(`all ${pngs.length} renders distinct within their concept`);

// --------------------------------------------------------- 4. price claims
//
// Paddle cross-checks the prices we publish against the catalog, so a price in
// an ad must be byte-identical to the one on the site.
console.log('\nPrice claims');
const hvacTs = join(WEBSITE, 'src', 'constants', 'hvac.ts');
const priceDisplay = /priceDisplay:\s*'([^']+)'/.exec(readFileSync(hvacTs, 'utf8'))?.[1];
if (!priceDisplay) {
  fail('could not read priceDisplay from src/constants/hvac.ts');
} else {
  const moneyRe = /\$\s?\d[\d,]*/g;
  let found = 0;
  let missing = 0;
  for (const { concept, placement, file } of pngs) {
    // The HTML is gitignored (it inlines ~150KB of base64 font each), so a
    // fresh clone has the committed PNGs and no sources until build.mjs runs.
    const src = file.replace(/\.png$/, '.html');
    if (!existsSync(src)) {
      missing++;
      continue;
    }
    const html = readFileSync(src, 'utf8');
    for (const m of html.match(moneyRe) ?? []) {
      found++;
      if (m !== priceDisplay) {
        fail(`${concept}/${placement}: price "${m}" does not match hvac.ts "${priceDisplay}"`);
      }
    }
  }
  if (missing) {
    fail(
      `${missing} creative(s) have no .html to read prices from — ` +
        `run \`node build.mjs\` first, or this check is silently doing nothing`,
    );
  } else {
    pass(
      found
        ? `${found} price mention(s), all matching ${priceDisplay}`
        : `no price claims in the active concepts (nothing to drift from ${priceDisplay})`,
    );
  }
}

// ------------------------------------------------------------- 5. ad copy
//
// Meta accepts far more text than it shows. Anything past the visible limit
// collapses behind "See more" and is read by nobody, so a headline that fits
// the API and not the phone is still a broken ad.
//
// Each field in copy/*.md declares its own length as `**Field** (N)`. This
// checks BOTH halves of that claim: that N is the real length of the line
// below it, and that N is inside the limit. Hand-counted numbers were wrong on
// 15 of 17 fields when these sheets were first written, and four lines were
// over the limit — hence a machine doing the counting from here on.
console.log('\nAd copy');
const COPY = join(HERE, 'copy');
// Visible limits, verified 2026-08. See copy/README.md for the full table.
const LIMITS = { 'Primary text': 125, Headline: 27, Description: 30 };
const CAROUSEL = { Headline: 45, Description: 18 };

if (!existsSync(COPY)) {
  fail('no marketing/copy — the creative cannot be launched without ad copy');
} else {
  let fields = 0;
  const before = failures;
  for (const f of readdirSync(COPY).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
    const lines = readFileSync(join(COPY, f), 'utf8').split('\n');
    lines.forEach((line, i) => {
      // `**Primary text** (108)` followed by a `> ...` blockquote.
      const decl = /^\*\*(.+?)\*\* \((\d+)\)$/.exec(line);
      if (decl) {
        const [, field, claimed] = decl;
        const quote = lines.slice(i + 1, i + 4).find((l) => l.startsWith('> '));
        if (!quote) return fail(`${f}:${i + 1} "${field}" declares a length but has no copy under it`);
        const actual = quote.slice(2).length;
        fields++;
        if (actual !== Number(claimed))
          fail(`${f}:${i + 1} "${field}" says ${claimed} chars, is ${actual}`);
        else if (LIMITS[field] && actual > LIMITS[field])
          fail(`${f}:${i + 1} "${field}" is ${actual} chars, over the ${LIMITS[field]} Meta shows`);
      }
      // Carousel card rows: `| 1 | \`x.png\` | Headline | Description |`
      const card = /^\| \d+ \| `[^`]+` \| (.+?) \| (.+?) \|$/.exec(line);
      if (card) {
        fields += 2;
        if (card[1].length > CAROUSEL.Headline)
          fail(`${f}:${i + 1} carousel headline "${card[1]}" is ${card[1].length}, over ${CAROUSEL.Headline}`);
        if (card[2].length > CAROUSEL.Description)
          fail(`${f}:${i + 1} carousel description "${card[2]}" is ${card[2].length}, over ${CAROUSEL.Description}`);
      }
      // Alternate-headline tables: `| Some headline | 22 |`
      const alt = /^\| ([A-Z][^|]*?) \| (\d+) \|$/.exec(line);
      if (alt) {
        fields++;
        if (alt[1].length !== Number(alt[2]))
          fail(`${f}:${i + 1} alternate "${alt[1]}" says ${alt[2]} chars, is ${alt[1].length}`);
        else if (alt[1].length > LIMITS.Headline)
          fail(`${f}:${i + 1} alternate "${alt[1]}" is ${alt[1].length}, over the ${LIMITS.Headline} Meta shows`);
      }
    });
    // Every concept needs a sheet, or the creative sits unlaunchable in out/.
    if (!existsSync(join(OUT, basename(f, '.md'))))
      fail(`copy/${f} has no matching concept in out/`);
  }
  for (const concept of readdirSync(OUT)) {
    if (!existsSync(join(COPY, `${concept}.md`)))
      fail(`${concept} has creative but no copy/${concept}.md — it cannot be launched`);
  }
  if (failures === before) pass(`${fields} copy fields checked against Meta's visible limits`);
}

console.log(
  failures ? `\n${failures} problem(s) found.\n` : `\nAll checks passed. ${pngs.length} creatives.\n`,
);
process.exit(failures ? 1 : 0);
