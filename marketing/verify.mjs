#!/usr/bin/env node
/**
 * Guard the rendered creative before anything is published.
 *
 * Three checks, in order of how expensive the mistake is:
 *   1. PIXEL DIMENSIONS — a 1079px-wide Status frame gets letterboxed or
 *      rejected. Read straight from the PNG header, no dependencies.
 *   2. SAFE ZONES — on 9:16 the top ~120px and bottom ~200px are covered by
 *      the Status UI. This checks that those bands are visually empty by
 *      sampling the rendered pixels, not by trusting the CSS.
 *   3. PRICE CLAIMS — any price appearing in creative must match
 *      src/constants/hvac.ts exactly, because Paddle cross-checks published
 *      prices against the catalog.
 *
 * Same spirit as documents/asll-bid/verify.mjs, which guards bid prose.
 */
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
// Sample the mean colour of the reserved band and compare it with the mean of
// the same band shifted inward. If content intrudes, the two differ sharply.
// ImageMagick 6 (`convert`) is present on this machine; skip if it is not.
console.log('\nSafe zones (9:16 only)');
let haveIM = true;
try {
  execFileSync('convert', ['-version'], { stdio: 'ignore' });
} catch {
  haveIM = false;
  console.log('  skip  ImageMagick `convert` not found');
}

const meanOf = (file, geom) =>
  parseFloat(
    execFileSync('convert', [file, '-crop', geom, '+repage', '-format', '%[fx:mean]', 'info:'], {
      encoding: 'utf8',
    }).trim(),
  );

if (haveIM) {
  for (const { concept, placement, file, spec } of pngs) {
    if (!spec || spec.h / spec.w < 1.5) continue; // status + story only
    // Reserved top band vs. the strip just below it.
    const top = meanOf(file, `${spec.w}x${spec.safeTop}+0+0`);
    const belowTop = meanOf(file, `${spec.w}x${spec.safeTop}+0+${spec.safeTop}`);
    const bot = meanOf(file, `${spec.w}x${spec.safeBottom}+0+${spec.h - spec.safeBottom}`);
    const aboveBot = meanOf(file, `${spec.w}x${spec.safeBottom}+0+${spec.h - spec.safeBottom * 2}`);
    // A band holding text differs from an empty one by a wide margin; 0.02 of
    // normalised luminance is comfortably above background gradient drift.
    const topClear = Math.abs(top - belowTop) < 0.02 || top < belowTop;
    const botClear = Math.abs(bot - aboveBot) < 0.02 || bot < aboveBot;
    if (topClear && botClear) pass(`${concept}/${placement} safe zones clear`);
    else
      fail(
        `${concept}/${placement}: content may intrude on a reserved band ` +
          `(top ${top.toFixed(3)} vs ${belowTop.toFixed(3)}, bottom ${bot.toFixed(3)} vs ${aboveBot.toFixed(3)})`,
      );
  }
}

// --------------------------------------------------------- 3. price claims
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
  for (const { concept, placement, file } of pngs) {
    const html = readFileSync(file.replace(/\.png$/, '.html'), 'utf8');
    for (const m of html.match(moneyRe) ?? []) {
      found++;
      if (m !== priceDisplay) {
        fail(`${concept}/${placement}: price "${m}" does not match hvac.ts "${priceDisplay}"`);
      }
    }
  }
  pass(
    found
      ? `${found} price mention(s), all matching ${priceDisplay}`
      : `no price claims in the active concepts (nothing to drift from ${priceDisplay})`,
  );
}

console.log(
  failures ? `\n${failures} problem(s) found.\n` : `\nAll checks passed. ${pngs.length} creatives.\n`,
);
process.exit(failures ? 1 : 0);
