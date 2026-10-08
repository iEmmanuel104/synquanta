// use_figma template — run AFTER a capture has landed, only on sections whose outermost screens overlap.
// Cause (SecurePeople board, 2026-10-08): the board's CSS flex rows let step columns shrink below the width of
// the 402-px screens inside them; capture.js keeps those wrappers as auto-layout frames with a FIXED counter axis
// (148–194 px) so the screens overflow and overlap. The fix is NOT to move cards: make every overflowing
// non-screen auto-layout wrapper hug its content (deepest first) and the rows re-flow natively, section/column/board
// included when they are auto-layout. Result on 04/05: 29+21 overlapping pairs → 0, board layout otherwise untouched.
// Never recurse into screens (402×≥700 / 1440×≥800 frames) and never resize them.
// Fill PAGE_ID, BOARD_ID and SECTION_IDS (from the audit: sections with overlaps > 0). Load figma:figma-use first.
const PAGE_ID = '46:2', BOARD_ID = '101:2', SECTION_IDS = ['101:6460', '101:8969'];
const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);
const board = await figma.getNodeByIdAsync(BOARD_ID);
const isScreen = (n) => n.type === 'FRAME' && ((Math.abs(n.width - 402) < 3 && n.height >= 700) || (Math.abs(n.width - 1440) < 3 && n.height >= 800));
const absBox = (n) => ({ x: n.absoluteTransform[0][2], y: n.absoluteTransform[1][2], w: n.width, h: n.height });
const union = (n) => { let b = absBox(n); if (!('findAll' in n)) return b; for (const k of n.findAll((k) => k.visible !== false)) { const kb = absBox(k); const x2 = Math.max(b.x + b.w, kb.x + kb.w), y2 = Math.max(b.y + b.h, kb.y + kb.h); b.x = Math.min(b.x, kb.x); b.y = Math.min(b.y, kb.y); b.w = x2 - b.x; b.h = y2 - b.y; } return b; };
const insideScreen = (n) => { let p = n.parent; while (p) { if (isScreen(p)) return true; p = p.parent; } return false; };
const depth = (n) => { let d = 0, p = n.parent; while (p) { d++; p = p.parent; } return d; };
const report = {};
for (const secId of SECTION_IDS) {
  const sec = await figma.getNodeByIdAsync(secId);
  const frames = sec.findAll((n) => n.type === 'FRAME' && n.layoutMode && n.layoutMode !== 'NONE' && !isScreen(n) && !insideScreen(n));
  frames.sort((a, b) => depth(b) - depth(a));
  let changed = 0;
  for (let pass = 0; pass < 2; pass++) for (const f of frames) {
    if (union(f).w <= f.width + 2) continue;                       // only wrappers whose content overflows
    try {
      if (f.layoutMode === 'VERTICAL' && f.counterAxisSizingMode === 'FIXED') { f.counterAxisSizingMode = 'AUTO'; changed++; }
      if (f.layoutMode === 'HORIZONTAL' && f.primaryAxisSizingMode === 'FIXED') { f.primaryAxisSizingMode = 'AUTO'; changed++; }
      if (f.layoutSizingHorizontal !== 'HUG') { f.layoutSizingHorizontal = 'HUG'; changed++; }
    } catch (e) {}
  }
  // non-auto-layout ancestors (rare) are widened by hand so nothing is clipped
  const after = union(sec); let a = sec;
  while (a && a.id !== board.id) { const ab = absBox(a); const need = after.x + after.w + 64 - ab.x; if (need > a.width && !(a.layoutMode && a.layoutMode !== 'NONE' && a.counterAxisSizingMode === 'AUTO')) a.resizeWithoutConstraints(need, a.height); a = a.parent; }
  const screens = sec.findAll(isScreen), set = new Set(screens.map((n) => n.id));
  const outer = screens.filter((n) => { let p = n.parent; while (p && p.id !== sec.id) { if (set.has(p.id)) return false; p = p.parent; } return true; });
  const bx = outer.map(absBox); let ov = 0;
  for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) { const p = bx[i], q = bx[j]; const ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x); const iy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y); if (ix > 2 && iy > 2) ov++; }
  report[secId] = { changed, width: Math.round(sec.width), screens: outer.length, overlaps: ov };
}
// a board that is not auto-layout needs its other columns pushed right by hand
if (!(board.layoutMode && board.layoutMode !== 'NONE')) {
  const cols = [...board.children].sort((a, b) => a.x - b.x); let x = cols[0].x;
  for (const c of cols) { c.x = x; x += union(c).w + 96; }
}
const bu = union(board); if (bu.w > board.width) board.resizeWithoutConstraints(bu.x + bu.w - absBox(board).x + 96, board.height);
return JSON.stringify({ report, mutatedNodeIds: [BOARD_ID, ...SECTION_IDS] });
