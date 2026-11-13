// Cloudflare Pages serves dist/<route>/index.html at "/<route>/" and 308-redirects
// "/<route>" to it. Our canonical URLs have no trailing slash (as on Vercel), so
// each prerendered route is also written as dist/<route>.html, which Pages serves
// at "/<route>" directly.
import { readdirSync, existsSync, copyFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
const dist = new URL('../dist/', import.meta.url).pathname;
for (const d of readdirSync(dist, { withFileTypes: true })) {
  const idx = join(dist, d.name, 'index.html');
  if (d.isDirectory() && existsSync(idx)) {
    copyFileSync(idx, join(dist, d.name + '.html'));
    rmSync(idx);
    console.log('route', '/' + d.name);
  }
}
