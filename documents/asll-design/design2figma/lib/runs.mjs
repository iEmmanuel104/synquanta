// Run directory bookkeeping: runs/<YYYY-MM-DD-HHMM>/{stage,queue,run.json,...}, runs/latest.txt, runs/profile.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TOOL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RUNS_DIR = path.join(TOOL_DIR, 'runs');
export const PROFILE_DIR = path.join(RUNS_DIR, 'profile');
export const VENDOR_DIR = path.join(TOOL_DIR, 'vendor');

export function stamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

export function newRunDir(name) {
  let dir = path.join(RUNS_DIR, name || stamp());
  let i = 1;
  while (fs.existsSync(dir)) dir = path.join(RUNS_DIR, `${name || stamp()}-${++i}`);
  fs.mkdirSync(path.join(dir, 'stage'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'queue'), { recursive: true });
  fs.writeFileSync(path.join(RUNS_DIR, 'latest.txt'), path.basename(dir) + '\n');
  return dir;
}

export function resolveRun(name) {
  if (name) {
    const dir = path.isAbsolute(name) ? name : path.join(RUNS_DIR, name);
    if (!fs.existsSync(path.join(dir, 'run.json'))) throw new Error(`no run.json in ${dir}`);
    return dir;
  }
  const latest = path.join(RUNS_DIR, 'latest.txt');
  if (!fs.existsSync(latest)) throw new Error('no runs yet — run `design2figma stage <zip|dir>` first');
  return path.join(RUNS_DIR, fs.readFileSync(latest, 'utf8').trim());
}

export function readJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { if (fallback !== undefined) return fallback; throw e; }
}
export function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
}

export function readRun(dir) { return readJson(path.join(dir, 'run.json')); }
export function updateRun(dir, patch) {
  const run = readRun(dir);
  const next = typeof patch === 'function' ? patch(run) : Object.assign(run, patch);
  writeJson(path.join(dir, 'run.json'), next || run);
  return next || run;
}

export function daemonInfo(dir) {
  const info = readJson(path.join(dir, 'daemon.json'), null);
  if (!info) return null;
  try { process.kill(info.pid, 0); return info; } catch { return null; }
}
