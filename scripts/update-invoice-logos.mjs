// Local-only: swap the old SynQuanta mark for the new Orbit Atom in the
// invoice/PRD HTML templates. Targets only the brand-mark <svg> (viewBox
// "0 0 68 68" containing the diagonal accent line). Not committed/deployed.
// Usage: node scripts/update-invoice-logos.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'src/invoice';

function orbitAtom(variant, w, h, n) {
  const p = `oa${n}p`, a = `oa${n}a`, b = `oa${n}b`;
  if (variant === 'white') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="${w}" height="${h}">
          <defs><linearGradient id="${b}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#52B788"/><stop offset="100%" stop-color="#74C69D"/></linearGradient></defs>
          <ellipse cx="48" cy="48" rx="30" ry="12" fill="none" stroke="url(#${b})" stroke-width="3" opacity="0.5" transform="rotate(-32 48 48)"/>
          <circle cx="48" cy="48" r="30" fill="none" stroke="#FFFFFF" stroke-width="5.5"/>
          <line x1="74" y1="74" x2="81" y2="81" stroke="url(#${b})" stroke-width="6" stroke-linecap="round"/>
          <circle cx="85.5" cy="85.5" r="5.5" fill="url(#${b})"/>
          <circle cx="48" cy="48" r="9" fill="#FFFFFF"/>
          <circle cx="69" cy="69" r="5" fill="url(#${b})"/>
        </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="${w}" height="${h}">
          <defs>
            <linearGradient id="${p}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1B4332"/><stop offset="100%" stop-color="#2D6A4F"/></linearGradient>
            <linearGradient id="${a}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#40916C"/><stop offset="100%" stop-color="#52B788"/></linearGradient>
            <linearGradient id="${b}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#52B788"/><stop offset="100%" stop-color="#74C69D"/></linearGradient>
          </defs>
          <ellipse cx="48" cy="48" rx="30" ry="12" fill="none" stroke="url(#${a})" stroke-width="3" opacity="0.4" transform="rotate(-32 48 48)"/>
          <circle cx="48" cy="48" r="30" fill="none" stroke="url(#${p})" stroke-width="5.5"/>
          <line x1="74" y1="74" x2="81" y2="81" stroke="url(#${a})" stroke-width="6" stroke-linecap="round"/>
          <circle cx="85.5" cy="85.5" r="5.5" fill="url(#${a})"/>
          <circle cx="48" cy="48" r="9" fill="url(#${p})"/>
          <circle cx="69" cy="69" r="5" fill="url(#${b})"/>
        </svg>`;
}

// Match the brand-mark svg: viewBox 0 0 68 68 ... up to closing </svg>.
const MARK_RE = /<svg[^>]*viewBox="0 0 68 68"[^>]*>[\s\S]*?<\/svg>/g;

let totalFiles = 0, totalMarks = 0;
const files = (await readdir(DIR)).filter((f) => f.endsWith('.html'));
for (const file of files) {
  const path = join(DIR, file);
  let html = await readFile(path, 'utf8');
  let n = 0;
  const out = html.replace(MARK_RE, (block) => {
    n += 1;
    const wm = block.match(/width="(\d+)"/);
    const hm = block.match(/height="(\d+)"/);
    const w = wm ? wm[1] : '60';
    const h = hm ? hm[1] : '60';
    // White on dark headers (logoGradient starts at #FFFFFF), else color.
    const variant = /#FFFFFF/i.test(block.split('</defs>')[0] || block) ? 'white' : 'color';
    return orbitAtom(variant, w, h, n);
  });
  if (n > 0) {
    await writeFile(path, out, 'utf8');
    totalFiles += 1;
    totalMarks += n;
    console.log(`✓ ${file} — ${n} mark(s) replaced`);
  } else {
    console.log(`· ${file} — no brand mark found`);
  }
}
console.log(`\nDone: ${totalMarks} marks across ${totalFiles} files.`);
