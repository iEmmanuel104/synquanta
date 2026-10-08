// expected.json (DOM counts) vs actual.json (Figma counts from figma/verify.js) → markdown report.
// Tolerances: images/vectors ±tolerance (default 10 %, min slack 1); texts ±textTolerance (default 8 %, min slack 2) —
// Figma merges adjacent text spans into one TEXT node, so text counts come out 94–100 % of the DOM count on every run.
// A section with no matching frame is a miss. Exit code is handled by the CLI.
export function verify(expected, actual, { tolerance = 0.1, textTolerance = 0.08, run } = {}) {
  const frames = actual.frames || actual;
  const rows = [];
  let ok = true;
  const used = new Set();

  for (const [i, s] of expected.sections.entries()) {
    // Match by shared plugin data (set by figma/place.js), then by name prefix "<id> ·", then by order.
    const untagged = frames.every((x) => !x.section);
    let f = frames.find((x) => !used.has(x.id) && x.section === s.id)
      || frames.find((x) => !used.has(x.id) && typeof x.name === 'string' && (x.name === s.id || x.name.startsWith(s.id + ' ·') || x.name.startsWith(s.id + ' ')))
      || (untagged && frames[i] && !used.has(frames[i].id) ? frames[i] : null);
    if (f) used.add(f.id);
    const r = { id: s.id, label: s.label, screens: s.screens.length, frame: f ? f.name : '—', nodeId: f ? f.id : '' };
    for (const k of ['texts', 'images', 'vectors']) {
      const e = s[k], a = f ? f[k] : null;
      const slack = k === 'texts' ? Math.max(2, Math.ceil(e * textTolerance)) : Math.max(1, Math.ceil(e * tolerance));
      const pass = f && Math.abs(a - e) <= slack;
      r[k] = { e, a, pass };
      if (!pass) ok = false;
    }
    if (!f) ok = false;
    rows.push(r);
  }
  const extra = frames.filter((x) => !used.has(x.id));

  const cell = (c) => c.a === null ? `${c.e} / —` : `${c.e} / ${c.a} ${c.pass ? '✓' : '✗'}`;
  const lines = [];
  lines.push(`# design2figma report — ${expected.board}`);
  lines.push('');
  lines.push(`- generated: ${new Date().toISOString()}`);
  if (run) lines.push(`- run: ${run.runDir}`, `- input: ${run.input}`);
  lines.push(`- target page: ${actual.page || '?'}  (${frames.length} top-level frames)`);
  lines.push(`- expected: ${expected.totals.sections} sections / ${expected.totals.screens} screens / ${expected.totals.texts} texts / ${expected.totals.images} images / ${expected.totals.vectors} vectors`);
  lines.push(`- tolerance: texts ±${Math.round(textTolerance * 100)} % (span merging) · images/vectors ±${Math.round(tolerance * 100)} % (min 1)`);
  lines.push(`- result: **${ok ? 'PASS' : 'FAIL'}**`);
  lines.push('');
  lines.push('| section | label | screens | frame | texts (exp / act) | images (exp / act) | vectors (exp / act) | status |');
  lines.push('|---|---|---:|---|---|---|---|---|');
  for (const r of rows) {
    const pass = r.frame !== '—' && r.texts.pass && r.images.pass && r.vectors.pass;
    lines.push(`| ${r.id} | ${r.label.replace(/\|/g, '/')} | ${r.screens} | ${r.frame.replace(/\|/g, '/')} ${r.nodeId ? `(${r.nodeId})` : ''} | ${cell(r.texts)} | ${cell(r.images)} | ${cell(r.vectors)} | ${pass ? 'PASS' : r.frame === '—' ? 'MISSING' : 'FAIL'} |`);
  }
  if (extra.length) { lines.push(''); lines.push(`Unmatched frames on the page (${extra.length}): ${extra.map((x) => `${x.name} (${x.id})`).join(', ')}`); }
  if (run?.captures?.length) {
    lines.push('', '## Captures', '', '| at | section | mode/via | captureId | outcome |', '|---|---|---|---|---|');
    for (const c of run.captures) lines.push(`| ${c.at} | ${c.section} | ${c.mode}/${c.via} | ${c.captureId || ''} | ${c.ok ? 'OK' : 'FAIL'} ${String(c.marker).replace(/\|/g, '/').slice(0, 120)} |`);
  }
  lines.push('', '## Per-screen expectation (DOM)', '');
  for (const s of expected.sections) {
    lines.push(`### ${s.id} — ${s.label}`, '', '| # | id | label | size | texts | images | svgs | vectors |', '|---:|---|---|---|---:|---:|---:|---:|');
    for (const sc of s.screens) lines.push(`| ${sc.index} | ${sc.id || ''} | ${(sc.label || '').replace(/\|/g, '/')} | ${sc.width}×${sc.height} | ${sc.texts} | ${sc.images} | ${sc.svgs} | ${sc.vectors} |`);
    lines.push('');
  }
  return { ok, rows, extra, report: lines.join('\n') + '\n' };
}
