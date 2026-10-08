#!/usr/bin/env node
// design2figma — move a Claude Design board export (.dc.html) into a Figma page via Figma's html-to-design capture.
// Subcommands: stage | prep | capture | expected | verify | status | stop   (see README.md)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { stage } from './lib/stage.mjs';
import { startServer } from './lib/server.mjs';
import { openSession, prep, expected, capture, daemon, sendCommand, CAPTURE_URL } from './lib/session.mjs';
import { resolveRun, readRun, updateRun, daemonInfo, readJson, writeJson, RUNS_DIR } from './lib/runs.mjs';
import { verify } from './verify.mjs';

const USAGE = `design2figma <command> [options]

  stage <export.zip|dir> [--out <dir>] [--with-babel] [--no-serve]
        Unzip/copy the export into runs/<stamp>/stage, vendor React, inject window.__resources,
        write run.json and (unless --no-serve) keep serving it until Ctrl-C.
  prep  [--board <name>] [--run <name>] [--keep] [--channel chrome] [--port N]
        Open headed Chromium, mount every lazy screen host, discover sections → sections.json + expected.json.
        --keep stays open as a daemon so capture/expected/stop can reuse the prepared page.
  capture --section <id> [--capture-id <cid> --endpoint <url>] [--mode endpoint|clipboard]
          [--delay 500] [--via auto|hash|api] [--wait 90] [--run <name>]
        Fire one capture for one section on the daemon's page (never awaits captureForDesign).
  expected [--run <name>]          Recompute expected.json (via the daemon, or a one-off session).
  verify --actual <json> [--run <name>] [--tolerance 0.10]   Compare Figma counts to expected.json → report.md.
  status [--run <name>]            Show the run, boards, daemon, captures.
  stop   [--run <name>]            Close the daemon's browser.
`;

const args = process.argv.slice(2);
const cmd = args.shift();
const opt = parse(args);

try {
  switch (cmd) {
    case 'stage': await cmdStage(); break;
    case 'prep': await cmdPrep(); break;
    case 'capture': await cmdCapture(); break;
    case 'expected': await cmdExpected(); break;
    case 'verify': await cmdVerify(); break;
    case 'status': cmdStatus(); break;
    case 'stop': await cmdStop(); break;
    default: console.log(USAGE); process.exit(cmd ? 1 : 0);
  }
} catch (e) {
  console.error('error: ' + (process.env.D2F_DEBUG ? e.stack : e.message));
  process.exit(1);
}

async function cmdStage() {
  const input = opt._[0];
  if (!input) throw new Error('stage needs <export.zip|dir>');
  const run = await stage(input, { out: opt.out, withBabel: !!opt['with-babel'] });
  console.log(`run: ${run.runDir}`);
  console.log(`boards: ${run.boards.map((b) => JSON.stringify(b.name)).join(', ')}`);
  if (opt['no-serve']) { console.log('not serving (--no-serve); prep will start its own server'); return; }
  const { port } = await startServer(run.stageDir, { port: opt.port ? Number(opt.port) : 0 });
  updateRun(run.runDir, { port });
  for (const b of run.boards) console.log(`  http://127.0.0.1:${port}${b.urlPath}`);
  console.log('serving — Ctrl-C to stop (prep reuses this server while it runs, and starts its own if it is gone)');
  await new Promise(() => {});
}

async function cmdPrep() {
  const runDir = resolveRun(opt.run);
  if (daemonInfo(runDir)) throw new Error(`a daemon is already running for this run (pid ${daemonInfo(runDir).pid}); use \`design2figma stop\` first`);
  const session = await openSession(runDir, { board: opt.board, port: opt.port && Number(opt.port), channel: opt.channel });
  await recordCaptureScript(runDir);
  await prep(session);
  await expected(session);
  if (opt.keep) await daemon(session);
  else { await session.close(); }
}

async function cmdCapture() {
  const runDir = resolveRun(opt.run);
  const c = { cmd: 'capture', section: must('section'), captureId: opt['capture-id'], endpoint: opt.endpoint,
    mode: opt.mode || 'endpoint', delay: Number(opt.delay || 500), via: opt.via || 'auto', waitMs: Number(opt.wait || 90) * 1000 };
  if (!['endpoint', 'clipboard'].includes(c.mode)) throw new Error('--mode must be endpoint or clipboard');
  if (c.mode === 'endpoint' && !(c.captureId && c.endpoint)) throw new Error('endpoint mode needs --capture-id and --endpoint (from generate_figma_design)');
  if (c.mode === 'clipboard') delete c.captureId, delete c.endpoint;
  const d = daemonInfo(runDir);
  if (!d) throw new Error('no daemon for this run — start `design2figma prep --board <name> --keep` first');
  const r = await sendCommand(runDir, c, { timeoutMs: c.waitMs + 30000 });
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.ok ? 0 : 1);
}

async function cmdExpected() {
  const runDir = resolveRun(opt.run);
  if (daemonInfo(runDir)) { const r = await sendCommand(runDir, { cmd: 'expected' }, { timeoutMs: 300000 }); console.log(`expected.json written: ${JSON.stringify(r.totals)}`); return; }
  const session = await openSession(runDir, { board: opt.board, channel: opt.channel });
  await prep(session);
  await expected(session);
  await session.close();
}

async function cmdVerify() {
  const runDir = resolveRun(opt.run);
  const actualPath = must('actual');
  const expectedPath = path.join(runDir, 'expected.json');
  const { ok, report } = verify(readJson(expectedPath), readJson(path.resolve(actualPath)), { tolerance: Number(opt.tolerance || 0.1), run: readRun(runDir) });
  const out = path.join(runDir, 'report.md');
  fs.writeFileSync(out, report);
  console.log(report);
  console.log(`report: ${out}`);
  process.exit(ok ? 0 : 1);
}

function cmdStatus() {
  const runDir = resolveRun(opt.run);
  const run = readRun(runDir);
  const d = daemonInfo(runDir);
  console.log(`run:     ${runDir}`);
  console.log(`input:   ${run.input}`);
  console.log(`boards:  ${run.boards.map((b) => JSON.stringify(b.name)).join(', ')}`);
  console.log(`port:    ${run.port || '-'}   daemon: ${d ? `pid ${d.pid} (${d.board}) ${d.url}` : 'not running'}`);
  if (run.captureScript) console.log(`capture.js: ${run.captureScript.bytes} bytes sha256 ${run.captureScript.sha256.slice(0, 12)} fetched ${run.captureScript.fetchedAt}`);
  if (run.prep) console.log(`prep:    hosts=${run.prep.hosts} empty=${run.prep.empty} (${run.prep.at})`);
  for (const c of run.captures || []) console.log(`  ${c.at} ${c.section.padEnd(10)} ${c.mode}/${c.via} ${c.ok ? 'OK  ' : 'FAIL'} ${c.captureId || ''} ${c.marker}`);
  const runs = fs.existsSync(RUNS_DIR) ? fs.readdirSync(RUNS_DIR).filter((n) => fs.existsSync(path.join(RUNS_DIR, n, 'run.json'))) : [];
  console.log(`all runs: ${runs.join(', ') || '-'}`);
}

async function cmdStop() {
  const runDir = resolveRun(opt.run);
  if (!daemonInfo(runDir)) { console.log('no daemon running'); return; }
  await sendCommand(runDir, { cmd: 'stop' }, { timeoutMs: 20000 }).catch(() => {});
  console.log('stopped');
}

// Fetch capture.js fresh each run and keep a copy + hash for the record (the page loads it from Figma directly).
async function recordCaptureScript(runDir) {
  try {
    const res = await fetch(CAPTURE_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(runDir, 'capture.js'), buf);
    const info = { url: CAPTURE_URL, bytes: buf.length, sha256: crypto.createHash('sha256').update(buf).digest('hex'), fetchedAt: new Date().toISOString() };
    updateRun(runDir, { captureScript: info });
    console.log(`capture.js: ${info.bytes} bytes (sha256 ${info.sha256.slice(0, 12)}…) fetched from ${CAPTURE_URL}`);
  } catch (e) { console.log(`! could not fetch ${CAPTURE_URL}: ${e.message} — captures will fail until Figma is reachable`); }
}

function must(k) { if (opt[k] === undefined || opt[k] === true) throw new Error(`--${k} is required`); return opt[k]; }

function parse(a) {
  const o = { _: [] };
  for (let i = 0; i < a.length; i++) {
    const t = a[i];
    if (t.startsWith('--')) {
      const [k, v] = t.slice(2).split(/=(.*)/s);
      if (v !== undefined) o[k] = v;
      else if (a[i + 1] !== undefined && !a[i + 1].startsWith('--')) o[k] = a[++i];
      else o[k] = true;
    } else o._.push(t);
  }
  return o;
}
