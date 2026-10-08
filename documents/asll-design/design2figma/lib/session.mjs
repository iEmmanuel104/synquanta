// Browser session: headed Chromium with a persistent profile, in-page prep, DOM counts, capture, and the
// file-queue daemon that lets later `capture` / `expected` / `stop` CLI calls reuse the prepared page.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { TOOL_DIR, PROFILE_DIR, readRun, updateRun, writeJson, readJson } from './runs.mjs';
import { startServer, isListening } from './server.mjs';

export const CAPTURE_URL = 'https://mcp.figma.com/mcp/html-to-design/capture.js';
const LIB = (f) => path.join(TOOL_DIR, 'lib', f);

export async function openSession(runDir, { board, port, channel, log = console.log } = {}) {
  const run = readRun(runDir);
  const b = pickBoard(run, board);

  // Reuse a server somebody else (e.g. `stage` left in the foreground) is already running; else start one.
  let server = null, srvPort = run.port;
  if (!(srvPort && (await isListening(srvPort)))) {
    ({ server, port: srvPort } = await startServer(run.stageDir, { port: port || 0 }));
    updateRun(runDir, { port: srvPort });
  }
  const url = `http://127.0.0.1:${srvPort}${b.urlPath}`;

  const launch = {
    headless: false, viewport: null, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--window-size=1500,1000', '--window-position=40,40', '--hide-crash-restore-bubble', '--disable-features=TranslateUI,InfoBars'],
    permissions: ['clipboard-read', 'clipboard-write']
  };
  if (channel) launch.channel = channel;
  let context;
  try { context = await chromium.launchPersistentContext(PROFILE_DIR, launch); }
  catch (e) {
    if (channel) throw e;
    log(`! bundled Chromium failed to launch (${String(e.message).split('\n')[0]}); retrying with the system Chrome (channel: chrome)`);
    context = await chromium.launchPersistentContext(PROFILE_DIR, { ...launch, channel: 'chrome' });
  }
  const page = context.pages()[0] || (await context.newPage());
  for (const p of context.pages()) if (p !== page) await p.close().catch(() => {});
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: `http://127.0.0.1:${srvPort}` }).catch(() => {});

  const consoleLog = [];
  const responses = [];
  page.on('console', (m) => {
    const line = `[${m.type()}] ${m.text()}`;
    consoleLog.push({ t: Date.now(), line });
    if (/figma|d2f|dc-runtime|error/i.test(line)) log('  console ' + line.slice(0, 300));
  });
  page.on('pageerror', (e) => { consoleLog.push({ t: Date.now(), line: '[pageerror] ' + e.message }); log('  pageerror ' + e.message.slice(0, 300)); });
  page.on('response', (r) => { if (/figma\.com/.test(r.url())) { responses.push({ t: Date.now(), status: r.status(), url: r.url() }); log(`  http ${r.status()} ${r.url().slice(0, 160)}`); } });

  log(`opening ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.bringToFront();
  activateBrowser(channel);

  return {
    run, board: b, url, page, context, server, consoleLog, responses, log, channel,
    async close() { await context.close().catch(() => {}); if (server) server.close(); }
  };
}

export function pickBoard(run, name) {
  if (!run.boards.length) throw new Error('run has no boards');
  if (!name) { if (run.boards.length === 1) return run.boards[0]; throw new Error(`--board required; available: ${run.boards.map((b) => JSON.stringify(b.name)).join(', ')}`); }
  const n = name.toLowerCase();
  const hits = run.boards.filter((b) => b.name.toLowerCase() === n);
  const fuzzy = hits.length ? hits : run.boards.filter((b) => b.name.toLowerCase().includes(n));
  if (fuzzy.length !== 1) throw new Error(`board ${JSON.stringify(name)} matched ${fuzzy.length} boards; available: ${run.boards.map((b) => JSON.stringify(b.name)).join(', ')}`);
  return fuzzy[0];
}

// Playwright's bringToFront switches tabs but does not raise the window; the capture script wants a focused tab.
export function activateBrowser(channel) {
  if (process.platform !== 'darwin') return;
  const app = channel === 'chrome' ? 'Google Chrome' : 'Google Chrome for Testing';
  try { execFileSync('osascript', ['-e', `tell application "${app}" to activate`], { stdio: 'ignore', timeout: 3000 }); } catch {}
}

export async function prep(session, { timeoutMs = 10 * 60 * 1000, prepOpts = {} } = {}) {
  const { page, log } = session;
  await page.addScriptTag({ path: LIB('inpage.js') });
  await page.evaluate((o) => { window.__d2fPrepOpts = o; }, prepOpts);
  await page.addScriptTag({ path: LIB('prep.js') });
  const t0 = Date.now();
  let lastShown = '';
  while (true) {
    const ready = await page.evaluate(() => window.__sqReady);
    if (ready) {
      const sections = ready.sections;
      log(`hosts=${ready.hosts} empty=${ready.empty} unloadedImages=${ready.unloadedImages} passes=${ready.passes} ms=${ready.ms} sections=[${sections.map((s) => `${s.id}(${s.screens})`).join(', ')}]`);
      const sectionsPath = path.join(session.run.runDir, 'sections.json');
      writeJson(sectionsPath, { board: session.board.name, url: session.url, preparedAt: new Date().toISOString(), hosts: ready.hosts, empty: ready.empty, sections });
      updateRun(session.run.runDir, (r) => { r.prep = { board: session.board.name, hosts: ready.hosts, empty: ready.empty, at: new Date().toISOString() }; return r; });
      session.ready = ready;
      return ready;
    }
    const p = await page.evaluate(() => window.__sqProgress);
    const shown = p ? `${p.phase} hosts=${p.hosts} empty=${p.empty} pass=${p.pass}` : '…';
    if (shown !== lastShown) { log('  prep ' + shown); lastShown = shown; }
    if (Date.now() - t0 > timeoutMs) throw new Error('prep timed out');
    await new Promise((r) => setTimeout(r, 1000));
  }
}

export async function expected(session) {
  const { page, log } = session;
  await page.addScriptTag({ path: LIB('inpage.js') });
  await page.addScriptTag({ path: LIB('dom-counts.js') });
  const exp = await page.evaluate(() => window.__sqExpected);
  const out = { board: session.board.name, url: session.url, generatedAt: new Date().toISOString(), ...exp };
  writeJson(path.join(session.run.runDir, 'expected.json'), out);
  const t = exp.totals;
  log(`expected: sections=${t.sections} screens=${t.screens} texts=${t.texts} images=${t.images} svgs=${t.svgs} vectors=${t.vectors}`);
  for (const s of exp.sections) log(`  ${s.id.padEnd(10)} ${String(s.screens.length).padStart(3)} screens  texts=${s.texts} images=${s.images} svgs=${s.svgs} vectors=${s.vectors}  ${s.label}`);
  return out;
}

// Fire one capture for a section. Never awaits captureForDesign; watches console/network for the outcome.
export async function capture(session, { section, captureId, endpoint, mode = 'endpoint', delay = 500, via = 'auto', waitMs = 90000 }) {
  const { page, log } = session;
  const sections = readJson(path.join(session.run.runDir, 'sections.json'), null)?.sections || session.ready?.sections || [];
  const sec = sections.find((s) => s.id === section) || sections.find((s) => s.selector === section);
  const selector = sec ? sec.selector : section; // allow a raw CSS selector too
  if (mode === 'endpoint' && !(captureId && endpoint)) throw new Error('endpoint mode needs --capture-id and --endpoint');
  const t0 = Date.now();

  const present = await page.evaluate((sel) => { const el = document.querySelector(sel); if (!el) return null; el.scrollIntoView({ block: 'start', inline: 'start' }); const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), emptyHosts: [...el.querySelectorAll('.sc-host-x')].filter((h) => h.querySelectorAll('*').length < 5).length }; }, selector);
  if (!present) throw new Error(`selector ${selector} matched nothing on the page`);
  if (present.emptyHosts) log(`! ${selector} still has ${present.emptyHosts} empty hosts — run prep again before capturing`);

  await page.bringToFront();
  activateBrowser(session.channel);
  const enc = encodeURIComponent;
  const hash = mode === 'endpoint'
    ? `#figmacapture=${enc(captureId)}&figmaendpoint=${enc(endpoint)}&figmaselector=${enc(selector)}&figmadelay=${delay}`
    : `#figmacapture&figmaselector=${enc(selector)}&figmadelay=${delay}`;
  const hasApi = await page.evaluate(() => !!(window.figma && typeof window.figma.captureForDesign === 'function'));
  const useVia = via === 'auto' ? (hasApi ? 'api' : 'hash') : via;
  const consoleStart = session.consoleLog.length, respStart = session.responses.length;

  if (useVia === 'hash') {
    // First load: the script reads the hash on boot. Re-adding the tag re-runs its bootstrap (no load guard as of 2026-10).
    await page.evaluate((h) => history.replaceState(null, '', location.pathname + location.search + h), hash);
    await page.evaluate((src) => { const s = document.createElement('script'); s.src = src; s.setAttribute('data-d2f', '1'); document.head.appendChild(s); }, `${CAPTURE_URL}?d2f=${Date.now()}`);
  } else {
    if (!hasApi) throw new Error('window.figma.captureForDesign is not loaded yet — use --via hash for the first capture');
    await page.evaluate((o) => {
      setTimeout(() => {
        try {
          const p = window.figma.captureForDesign(o);
          if (p && p.then) p.then((r) => console.log('[d2f] captureForDesign resolved ' + JSON.stringify(r))).catch((e) => console.error('[d2f] captureForDesign rejected ' + String(e)));
        } catch (e) { console.error('[d2f] captureForDesign threw ' + String(e)); }
      }, 0);
    }, { captureId, endpoint, selector, delayMs: delay, verbose: true });
  }
  log(`capture ${section} via ${useVia} mode=${mode} selector=${selector} size=${present.w}x${present.h}${captureId ? ' captureId=' + captureId : ''}`);

  // Outcome markers. Endpoint: the POST to …/submit. Clipboard: the script's success/error log lines.
  let outcome = null;
  while (!outcome && Date.now() - t0 < waitMs) {
    await new Promise((r) => setTimeout(r, 500));
    const lines = session.consoleLog.slice(consoleStart).map((c) => c.line);
    const errLine = lines.find((l) => /\[Figma Capture\].*(error|failed|expired|not found|denied|timed out)|\[d2f\] captureForDesign (rejected|threw)|Clipboard error/i.test(l));
    if (errLine) { outcome = { ok: false, marker: errLine }; break; }
    if (mode === 'endpoint') {
      const sub = session.responses.slice(respStart).find((r) => /\/submit\b/.test(r.url) || r.url.startsWith(endpoint));
      if (sub) outcome = { ok: sub.status >= 200 && sub.status < 300, marker: `HTTP ${sub.status} ${sub.url}` };
      const resolved = lines.find((l) => /\[d2f\] captureForDesign resolved/.test(l));
      if (!outcome && resolved) outcome = { ok: !/"success":false/.test(resolved), marker: resolved };
    } else {
      const ok = lines.find((l) => /copied to clipboard|Success! Capture/i.test(l));
      if (ok) outcome = { ok: true, marker: ok };
    }
  }
  if (!outcome) outcome = { ok: false, marker: `no outcome within ${waitMs} ms (check the browser window: a Figma toast may still be running)` };
  if (mode === 'clipboard') outcome.clipboard = clipboardInfo();

  const result = { section, selector, captureId: captureId || null, endpoint: endpoint || null, mode, via: useVia, hash, at: new Date(t0).toISOString(), ms: Date.now() - t0, ...outcome,
    console: session.consoleLog.slice(consoleStart).map((c) => c.line).filter((l) => /figma|d2f/i.test(l)).slice(0, 40),
    responses: session.responses.slice(respStart) };
  updateRun(session.run.runDir, (r) => { (r.captures ||= []).push(result); return r; });
  fs.appendFileSync(path.join(session.run.runDir, 'capture-log.txt'), `${result.at} ${section} ${mode}/${useVia} ${result.ok ? 'OK' : 'FAIL'} ${result.marker}\n`);
  log(`capture ${section}: ${result.ok ? 'OK' : 'FAIL'} — ${result.marker}${result.clipboard ? ` — clipboard: ${result.clipboard}` : ''}`);
  return result;
}

export function clipboardInfo() {
  try { return execFileSync('osascript', ['-e', 'clipboard info'], { encoding: 'utf8', timeout: 5000 }).trim().slice(0, 400); } catch (e) { return 'clipboard info failed: ' + e.message; }
}

// ---- daemon: serve queued commands written by other CLI invocations ------------------------------------
export async function daemon(session) {
  const { log } = session;
  const dir = session.run.runDir, queue = path.join(dir, 'queue');
  fs.mkdirSync(queue, { recursive: true });
  writeJson(path.join(dir, 'daemon.json'), { pid: process.pid, board: session.board.name, url: session.url, startedAt: new Date().toISOString() });
  log(`daemon ready — queue ${queue} (send: design2figma capture|expected|stop)`);
  let stop = false;
  const bye = async () => { if (stop) return; stop = true; log('closing'); try { fs.unlinkSync(path.join(dir, 'daemon.json')); } catch {} await session.close(); process.exit(0); };
  process.on('SIGINT', bye); process.on('SIGTERM', bye);
  session.page.on('close', () => { if (!stop) { log('page closed by user'); bye(); } });
  while (!stop) {
    const files = fs.readdirSync(queue).filter((f) => f.endsWith('.json') && !/\.(done|taken)\.json$/.test(f)).sort();
    for (const f of files) {
      const taken = path.join(queue, f.replace(/\.json$/, '.taken.json'));
      let cmd; try { fs.renameSync(path.join(queue, f), taken); cmd = readJson(taken); } catch { continue; }
      let result;
      try {
        if (cmd.cmd === 'capture') result = await capture(session, cmd);
        else if (cmd.cmd === 'expected') result = await expected(session);
        else if (cmd.cmd === 'prep') result = await prep(session);
        else if (cmd.cmd === 'stop') result = { ok: true, stopping: true };
        else result = { ok: false, error: 'unknown cmd ' + cmd.cmd };
      } catch (e) { result = { ok: false, error: e.message }; log('! ' + e.message); }
      writeJson(path.join(queue, f.replace(/\.json$/, '.done.json')), result);
      if (cmd.cmd === 'stop') return bye();
    }
    await new Promise((r) => setTimeout(r, 400));
  }
}

// Client side: drop a command in the queue and wait for its .done.json.
export async function sendCommand(runDir, cmd, { timeoutMs = 120000 } = {}) {
  const queue = path.join(runDir, 'queue');
  fs.mkdirSync(queue, { recursive: true });
  const name = `${Date.now()}-${cmd.cmd}${cmd.section ? '-' + cmd.section.replace(/[^\w.-]+/g, '_') : ''}`;
  const tmp = path.join(queue, name + '.json.tmp');
  fs.writeFileSync(tmp, JSON.stringify(cmd)); fs.renameSync(tmp, path.join(queue, name + '.json'));
  const done = path.join(queue, name + '.done.json');
  const t0 = Date.now();
  while (!fs.existsSync(done)) {
    if (Date.now() - t0 > timeoutMs) throw new Error(`daemon did not answer within ${timeoutMs} ms (is \`design2figma prep --keep\` still running?)`);
    await new Promise((r) => setTimeout(r, 300));
  }
  return readJson(done);
}
