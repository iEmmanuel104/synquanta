// Stage an export: unzip/copy into runs/<run>/stage, vendor React, inject the window.__resources override
// into every *.dc.html, and record the boards in run.json.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { VENDOR_DIR, newRunDir, writeJson } from './runs.mjs';

const RESOURCE_RE = /var (\w+)_URL = "([^"]+)";\s*var \1_SRI = "([^"]+)";/g;

export async function stage(input, { out, vendorDir = VENDOR_DIR, withBabel = false, log = console.log } = {}) {
  const src = path.resolve(input);
  if (!fs.existsSync(src)) throw new Error(`input not found: ${src}`);
  const runDir = out ? path.resolve(out) : newRunDir();
  const stageDir = path.join(runDir, 'stage');
  fs.mkdirSync(stageDir, { recursive: true });

  if (fs.statSync(src).isDirectory()) {
    fs.cpSync(src, stageDir, { recursive: true });
    log(`copied ${src} → ${stageDir}`);
  } else {
    execFileSync('unzip', ['-q', '-o', src, '-d', stageDir], { stdio: 'inherit' });
    log(`unzipped ${src} → ${stageDir}`);
  }

  // Boards: *.dc.html at the stage root, or one level down if the zip had a wrapper folder.
  let root = stageDir;
  let boards = findBoards(root);
  if (!boards.length) {
    const subs = fs.readdirSync(root).filter((n) => !n.startsWith('.') && fs.statSync(path.join(root, n)).isDirectory());
    for (const s of subs) { const b = findBoards(path.join(root, s)); if (b.length) { root = path.join(root, s); boards = b; break; } }
  }
  if (!boards.length) throw new Error(`no *.dc.html board found under ${stageDir}`);

  // support.js tells us which CDN scripts the runtime wants (URL + SRI). Vendor them next to the boards.
  const supportPath = path.join(root, 'support.js');
  const resources = fs.existsSync(supportPath) ? [...fs.readFileSync(supportPath, 'utf8').matchAll(RESOURCE_RE)].map((m) => ({ name: m[1], url: m[2], sri: m[3] })) : [];
  const vendored = {};
  const stageVendor = path.join(root, 'vendor');
  fs.mkdirSync(stageVendor, { recursive: true });
  for (const r of resources) {
    if (r.name === 'BABEL' && !withBabel) continue; // only needed for .jsx/.tsx imports; left to the CDN unless asked
    const file = path.basename(new URL(r.url).pathname);
    const local = path.join(vendorDir, file);
    if (!fs.existsSync(local)) {
      try { await download(r.url, local, log); } catch (e) { log(`! could not vendor ${r.url}: ${e.message} — the CDN URL stays in place`); continue; }
    }
    const sri = 'sha384-' + crypto.createHash('sha384').update(fs.readFileSync(local)).digest('base64');
    if (sri !== r.sri) { log(`! ${file}: SRI mismatch (vendor ${sri} vs support.js ${r.sri}) — not mapped`); continue; }
    fs.copyFileSync(local, path.join(stageVendor, file));
    vendored[r.url] = './vendor/' + file;
  }

  for (const b of boards) injectResources(path.join(root, b.file), vendored, log);

  const run = {
    createdAt: new Date().toISOString(),
    input: src,
    runDir, stageDir, root,
    rootRel: path.relative(stageDir, root) || '.',
    boards: boards.map((b) => ({ name: b.name, file: b.file, path: path.join(root, b.file), urlPath: '/' + (path.relative(stageDir, root) ? path.relative(stageDir, root) + '/' : '') + encodeURIComponent(b.file) })),
    resources: vendored,
    port: null,
    captures: []
  };
  writeJson(path.join(runDir, 'run.json'), run);
  return run;
}

function findBoards(dir) {
  return fs.readdirSync(dir).filter((n) => n.endsWith('.dc.html')).sort().map((file) => ({ file, name: file.replace(/\.dc\.html$/, '') }));
}

// Insert <script>window.__resources={...}</script> before the first <script> so support.js sees it on boot.
function injectResources(file, map, log) {
  let html = fs.readFileSync(file, 'utf8');
  if (/window\.__resources\s*=/.test(html)) { log(`  ${path.basename(file)}: __resources already present, left as is`); return; }
  const tag = `<script>window.__resources=${JSON.stringify(map)};</script>\n`;
  const i = html.search(/<script\b/i);
  html = i >= 0 ? html.slice(0, i) + tag + html.slice(i) : html.replace(/<head[^>]*>/i, (m) => m + '\n' + tag);
  fs.writeFileSync(file, html);
  log(`  ${path.basename(file)}: injected window.__resources (${Object.keys(map).length} vendored)`);
}

async function download(url, dest, log) {
  log(`  downloading ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}
