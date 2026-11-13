// Render one ERP video in one format: headless Chrome (CDP, no deps) -> JPEG frames -> ffmpeg,
// then mix voiceover (per-line, placed on the timeline) + music bed, loudness-normalised to -14 LUFS.
// Usage: node tools/render.mjs <master|consider|adA..adE> <916|45|169> [--stills 1,5,9] [--fps 30]
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ERP = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ERP, '..', 'out', 'erp-promo');
const [video, fmt] = process.argv.slice(2);
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const FPS = Number(arg('--fps') || 30);
const stills = arg('--stills')?.split(',').map(Number);
const SIZE = { 916: [1080, 1920], 45: [1080, 1350], 169: [1920, 1080] }[fmt];
if (!SIZE) throw new Error('fmt must be 916|45|169');

const lines = JSON.parse(readFileSync(join(ERP, 'lines.json')));
const dur = (id) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', join(ERP, 'audio', 'vo', id + '.mp3')]).toString());

// The old close ("Your business isn't standard...") could be misread as "substandard". Every video now ends on one line.
const ENDHL = 'One system.\nBuilt around your business.';
const ADEND = 'One system.\nBuilt around your business.';
const DEF = {
  master: [
    ['hook', 'm1', 0.3, 0.7, { hl: 'Your business grew.\nDid your system?' }],
    ['mess', 'm2', 0.3, 0.9, { hl: 'Nobody sees the full picture' }],
    ['hub', 'm3', 0.3, 1.3, { hl: 'One system for your whole business', sub: [[0.45, '(that’s an ERP)']] }],
    ['pipeline', 'm4', 0.3, 1.6, { hl: 'From first enquiry to payment' }],
    ['steps', 'm5', 0.3, 1.2, { hl: [[0, 'Built around how you work'], [0.42, 'Learn → Plan → Build → Launch']] }],
    ['industries', 'm6', 0.3, 1.2, { hl: [[0, 'Distribution'], [0.34, 'Services'], [0.65, 'Property']], sub: [[0, 'Stock · Purchases · Finances'], [0.34, 'Clients · Invoices · Reports'], [0.65, 'Enquiries · Properties · Payments']] }],
    ['end', 'm7', 0.5, 4.2, { endHl: ENDHL }],
  ],
  consider: [
    ['hook', 'c1', 0.3, 0.6, { hl: 'Your business grew.\nDid your system?' }],
    ['messHub', 'c2', 0.3, 1.0, { hl: [[0, 'Nobody sees the full picture'], [0.45, 'One system for your business']], sub: [[0.6, '(that’s an ERP)']] }],
    ['stepsEos', 'c3', 0.3, 1.0, { hl: [[0, 'Learn → Plan → Build → Launch'], [0.62, 'Built by SynQuanta']] }],
    ['end', 'c4', 0.4, null, { endHl: ENDHL }],
  ],
  adA: [['memory', 'a', { hl: 'Your business shouldn’t depend on someone’s memory.' }]],
  adB: [['visibility', 'b', { hl: 'How much of your business can you actually see?' }]],
  adC: [['imagine', 'c', { hl: 'What if your whole business ran on one system?' }]],
  adD: [['industries3', 'd', { hl: 'Different businesses. Same problem.' }]],
  adE: [['generic', 'e', { hl: 'Your business isn’t generic.\nYour software shouldn’t be either.' }]],
};

function timeline() {
  const segs = []; let t = 0;
  if (video.startsWith('ad')) {
    const [[scene, vo, o]] = DEF[video]; const vd = dur(vo); const endAt = Math.max(12.4, 0.3 + vd - 0.2);
    segs.push({ scene, start: 0, dur: endAt, vo, voStart: 0.3, voDur: vd, text: lines[vo], ...o });
    segs.push({ scene: 'end', start: endAt, dur: 15 - endAt, endHl: ADEND });
    return { fmt, segs, total: 15 };
  }
  for (const [scene, vo, pre, post, o] of DEF[video]) {
    const vd = dur(vo); const d = post == null ? Math.max(pre + vd + 0.4, 30 - t) : pre + vd + post;
    segs.push({ scene, start: t, dur: d, vo, voStart: t + pre, voDur: vd, text: lines[vo], ...o });
    t += d;
  }
  return { fmt, segs, total: t };
}

// ------------------------------------------------------------------ CDP
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
async function chrome() {
  const port = 9300 + Math.floor(Math.random() * 500), prof = join(ERP, '.chrome-' + port);
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--hide-scrollbars',
    '--force-device-scale-factor=1', '--font-render-hinting=none', '--disable-gpu-vsync', 'about:blank'], { stdio: 'ignore' });
  let list;
  for (let i = 0; i < 100; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.find((x) => x.type === 'page')) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }
  const ws = new WebSocket(list.find((x) => x.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pend = new Map(), waiters = [];
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const { res, rej } = pend.get(m.id); pend.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); } else if (m.method) waiters.filter((w) => w.m === m.method).forEach((w) => w.r(m.params)); };
  const send = (method, params = {}) => new Promise((res, rej) => { pend.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
  const once = (m) => new Promise((r) => waiters.push({ m, r }));
  const close = async () => { ws.close(); const done = new Promise((r) => proc.once('exit', r)); proc.kill(); await done; rmSync(prof, { recursive: true, force: true }); };
  return { send, once, close };
}
const evalJs = async (c, expr) => { const r = await c.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 600)); return r.result.value; };

// ------------------------------------------------------------------ main
const tl = timeline();
mkdirSync(OUT, { recursive: true });
const name = `${video}-${fmt}`;
console.log(name, 'duration', tl.total.toFixed(2) + 's');
const c = await chrome();
await c.send('Page.enable');
await c.send('Emulation.setDeviceMetricsOverride', { width: SIZE[0], height: SIZE[1], deviceScaleFactor: 1, mobile: false });
const loaded = c.once('Page.loadEventFired');
await c.send('Page.navigate', { url: 'file://' + join(ERP, 'stage.html') });
await loaded;
await evalJs(c, `document.fonts.ready.then(()=>Promise.all([...document.images].map(i=>i.decode()))).then(()=>1)`);
await evalJs(c, `setup(${JSON.stringify(tl)}),1`);

if (stills) {
  const dir = join(OUT, 'stills'); mkdirSync(dir, { recursive: true });
  for (const t of stills) {
    await evalJs(c, `seek(${t}),1`);
    const { data } = await c.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(dir, `${name}-${String(t).padStart(5, '0')}.png`), Buffer.from(data, 'base64'));
  }
  await c.close(); console.log('stills done'); process.exit(0);
}

// audio: VO lines delayed onto the timeline + music bed, then loudnorm
const vos = tl.segs.filter((s) => s.vo);
const wav = join(OUT, `.${name}.m4a`);
const ins = vos.flatMap((s) => ['-i', join(ERP, 'audio', 'vo', s.vo + '.mp3')]).concat(['-i', join(ERP, 'audio', 'music', 'bed.mp3')]);
const fc = vos.map((s, i) => `[${i}]adelay=${Math.round(s.voStart * 1000)}:all=1,apad[v${i}]`).join(';') +
  `;[${vos.length}]atrim=0:${tl.total},afade=t=in:d=1,afade=t=out:st=${tl.total - 2.2}:d=2.2,volume=0.16[m]` +
  `;${vos.map((_, i) => `[v${i}]`).join('')}[m]amix=inputs=${vos.length + 1}:normalize=0:duration=longest,atrim=0:${tl.total},loudnorm=I=-14:TP=-1.5:LRA=11[a]`;
execFileSync('ffmpeg', ['-v', 'error', '-y', ...ins, '-filter_complex', fc, '-map', '[a]', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', wav]);

const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-i', wav,
  '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
  '-c:a', 'copy', '-shortest', '-movflags', '+faststart', join(OUT, name + '.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
const N = Math.round(tl.total * FPS), t0 = Date.now();
for (let i = 0; i < N; i++) {
  await evalJs(c, `seek(${(i / FPS).toFixed(4)}),1`);
  const { data } = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 92, optimizeForSpeed: true });
  if (!ff.stdin.write(Buffer.from(data, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % 300 === 0) console.log(`  ${i}/${N} frames, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
rmSync(wav, { force: true });
await c.close();
console.log('wrote', join(OUT, name + '.mp4'));
