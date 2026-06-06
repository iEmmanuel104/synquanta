// Build-time image optimizer. Compresses the photographic JPEGs in
// public/images and public/screens and emits modern avif + webp siblings so the
// site stays fast on mobile. <picture> serves avif/webp where supported and
// falls back to the JPEG. Usage: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIRS = ['public/images', 'public/screens'];
const MAX_WIDTH = 1600;
const QUALITY = 72; // jpeg fallback
const WEBP_QUALITY = 74;
const AVIF_QUALITY = 50; // avif at q50 ≈ visually lossless, much smaller

async function optimizeFile(path) {
  const ext = extname(path).toLowerCase();
  if (ext !== '.jpg' && ext !== '.jpeg') return null;
  const before = (await stat(path)).size;

  // 1) Re-encode the JPEG in place (fallback), keeping the smaller result.
  const tmp = `${path}.tmp`;
  await sharp(path)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp);
  const jpgAfter = (await stat(tmp)).size;
  if (jpgAfter < before) {
    await unlink(path);
    await rename(tmp, path);
  } else {
    await unlink(tmp);
  }
  const after = Math.min(before, jpgAfter);

  // 2) Emit avif + webp siblings from the (now-optimized) source.
  const base = path.slice(0, -ext.length);
  await sharp(path).resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toFile(`${base}.webp`);
  await sharp(path).resize({ width: MAX_WIDTH, withoutEnlargement: true }).avif({ quality: AVIF_QUALITY }).toFile(`${base}.avif`);
  const webpAfter = (await stat(`${base}.webp`)).size;
  const avifAfter = (await stat(`${base}.avif`)).size;
  return { path, before, after, webpAfter, avifAfter };
}

let totalBefore = 0;
let totalAfter = 0;
let totalAvif = 0;
const kb = (n) => `${Math.round(n / 1024)}KB`;
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
    totalAvif += res.avifAfter;
    console.log(`✓ ${res.path}  jpg ${kb(res.before)}→${kb(res.after)}  webp ${kb(res.webpAfter)}  avif ${kb(res.avifAfter)}`);
  }
}
console.log(`\nTotal jpg: ${kb(totalBefore)} → ${kb(totalAfter)}   |   avif total: ${kb(totalAvif)} (what most browsers download)`);
