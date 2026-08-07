#!/usr/bin/env node
/**
 * Generate one self-contained HTML file per (concept × placement).
 *
 * Pure Node, zero dependencies — same shape as documents/asll-bid/build.mjs.
 * Output goes to marketing/out/<concept>/<placement>.html and is then
 * rasterised by render.sh. Nothing here touches the network.
 *
 *   node build.mjs            # all concepts, all placements
 *   node build.mjs shipped    # one concept
 */
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page, PLACEMENTS } from './lib/brand.mjs';
import { CONCEPTS } from './lib/concepts.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, 'out');

const only = process.argv[2];
const names = only ? [only] : Object.keys(CONCEPTS);

for (const n of names) {
  if (!CONCEPTS[n]) {
    console.error(`Unknown concept "${n}". Known: ${Object.keys(CONCEPTS).join(', ')}`);
    process.exit(1);
  }
}

rmSync(OUT, { recursive: true, force: true });

let count = 0;
for (const name of names) {
  const concept = CONCEPTS[name];
  const dir = join(OUT, name);
  mkdirSync(dir, { recursive: true });

  for (const placement of Object.keys(PLACEMENTS)) {
    const html = page({ placement, body: concept.render(placement) });
    writeFileSync(join(dir, `${placement}.html`), html);
    count++;
  }
  console.log(`  ${name.padEnd(16)} ${Object.keys(PLACEMENTS).length} placements  "${concept.title}"`);
}

console.log(`\n${count} creatives written to marketing/out/`);
console.log('Next: ./render.sh');
