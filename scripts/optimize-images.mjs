// Build-time image optimizer. Compresses the photographic JPEGs in
// public/images and public/screens so the site stays fast on mobile.
// Usage: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIRS = ['public/images', 'public/screens'];
const MAX_WIDTH = 1600;
const QUALITY = 72;

async function optimizeFile(path) {
  const ext = extname(path).toLowerCase();
  if (ext !== '.jpg' && ext !== '.jpeg') return null;
  const before = (await stat(path)).size;
  const tmp = `${path}.tmp`;
  await sharp(path)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp);
  const after = (await stat(tmp)).size;
  // Only keep the optimized version if it's actually smaller.
  if (after < before) {
    await unlink(path);
    await rename(tmp, path);
    return { path, before, after };
  }
  await unlink(tmp);
  return { path, before, after: before, skipped: true };
}

let totalBefore = 0;
let totalAfter = 0;
for (const dir of DIRS) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    continue;
  }
  for (const name of entries) {
    const res = await optimizeFile(join(dir, name));
    if (!res) continue;
    totalBefore += res.before;
    totalAfter += res.after;
    const kb = (n) => `${Math.round(n / 1024)}KB`;
    console.log(`${res.skipped ? '· keep' : '✓ opt '} ${res.path}  ${kb(res.before)} → ${kb(res.after)}`);
  }
}
console.log(`\nTotal: ${Math.round(totalBefore / 1024)}KB → ${Math.round(totalAfter / 1024)}KB`);
