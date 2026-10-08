// use_figma template — run AFTER the captures have completed and the frames are renamed.
// Re-flows every container ABOVE screen-card level so cards never overlap and read in board order,
// while never entering a screen (recursion stops at "cards": frames ≥600 tall and 280–1600 wide).
// Each container's children are regrouped into their ORIGINAL rows (by y), then re-spaced with a gap
// and wrapped at MAXW; containers are resized to fit; section frames are restacked vertically.
// Proven 2026-10-08 (SecurePeople board): 0 overlaps in all 10 sections, screen internals untouched.
// NEVER let the recursion enter cards — a pass that resized inside screens wrecked them and forced a re-capture.
// Fill PAGE_ID and ORDER (section-id prefixes of the frame names, in board order).
// Load the figma:figma-use skill before any use_figma call.
const PAGE_ID = '46:2';
const ORDER = ['flow-1','flow-2','flow-3','flow-4','flow-5','flow-7','flow-8','flow-9','flow-10','flow-11'];
const MAXW_MOBILE = 4800, MAXW_WEB = 6600;        // wrap width: ~10 phones / ~4 desks per row
const CARD_GAP = 96, SMALL_GAP = 16, ROW_GAP = 72, PAD = 48, SECTION_GAP = 600;

const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);
const isCard = (n) => n.type === 'FRAME' && n.height >= 600 && n.width >= 280 && n.width <= 1600;
const holdsCards = (n) => isCard(n) || ('children' in n && n.children.some(holdsCards));
function relayout(node, MAXW) {
  if (isCard(node) || !('children' in node) || node.children.length === 0) return;
  const kids = [...node.children];
  if (!kids.some(holdsCards)) return;                 // chip rows / notes: leave untouched
  for (const k of kids) relayout(k, MAXW);            // post-order, never inside cards
  if (node.layoutMode && node.layoutMode !== 'NONE') node.layoutMode = 'NONE';
  const sorted = kids.map((k) => ({ k, y: k.y, x: k.x })).sort((a, b) => a.y - b.y || a.x - b.x);
  const rows = []; let cur = null;
  for (const it of sorted) {
    if (!cur || it.y >= cur.bottom - 8) { cur = { items: [], bottom: it.k.y + it.k.height }; rows.push(cur); }
    cur.items.push(it.k); cur.bottom = Math.max(cur.bottom, it.k.y + it.k.height);
  }
  let y = PAD, maxW = 0;
  for (const r of rows) {
    r.items.sort((a, b) => a.x - b.x);
    const big = r.items.some(holdsCards), gap = big ? CARD_GAP : SMALL_GAP;
    let x = PAD, rowH = 0;
    for (const it of r.items) {
      if (x > PAD && big && x + it.width > MAXW) { x = PAD; y += rowH + ROW_GAP; rowH = 0; }
      it.x = x; it.y = y; x += it.width + gap; rowH = Math.max(rowH, it.height); maxW = Math.max(maxW, x - gap);
    }
    y += rowH + (big ? ROW_GAP : SMALL_GAP);
  }
  node.resizeWithoutConstraints(Math.max(maxW + PAD, 320), y + PAD);
}
const frames = ORDER.map((id) => page.children.find((c) => c.name.startsWith(id + ' ·'))).filter(Boolean);
let secY = 0; const out = [];
for (const f of frames) {
  const web = f.findAll((n) => n.type === 'FRAME' && Math.abs(n.width - 1440) < 3).length > 0;
  relayout(f, web ? MAXW_WEB : MAXW_MOBILE);
  f.x = 0; f.y = secY; secY += f.height + SECTION_GAP;
  const cards = f.findAll(isCard), set = new Set(cards.map((n) => n.id));
  const outer = cards.filter((n) => { let p = n.parent; while (p && p.id !== f.id) { if (set.has(p.id)) return false; p = p.parent; } return true; });
  const bx = outer.map((n) => ({ x: n.absoluteTransform[0][2], y: n.absoluteTransform[1][2], w: n.width, h: n.height }));
  let ov = 0;
  for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) { const a = bx[i], b = bx[j]; const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x); const iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y); if (ix > 2 && iy > 2) ov++; }
  out.push({ id: f.id, name: f.name, w: Math.round(f.width), h: Math.round(f.height), overlaps: ov });
}
return JSON.stringify(out);
