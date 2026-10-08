// use_figma template — run AFTER the captures for the listed sections have completed (polled to "completed").
// Finds the frames html-to-design just added to SOURCE_PAGE (anything not in KNOWN_IDS and not yet tagged),
// tags them with shared plugin data d2f/section, names them "<section> · <label>", moves them to TARGET_PAGE
// and lays them out in a grid. Returns JSON {placed:[{id,name,section,w,h}], unmatched:[...]}.
// Fill the four constants; keep SECTIONS in capture order (one frame is produced per capture).
// Load the figma:figma-use skill before any use_figma call.
const TARGET_PAGE = 'Flow Board — 2026-10-08';
const SOURCE_PAGE = '';           // '' = first page
const KNOWN_IDS = [];             // from snapshot.js (ids that were on SOURCE_PAGE before capturing)
const SECTIONS = [                // from runs/<run>/sections.json, in the order the captures were fired
  // { id: 'flow-1', label: 'Flow 1 · Onboarding & sign-up' },
];
const COLUMNS = 1;                // 1 = stack sections vertically; >1 = grid
const GAP = 400;

if (figma.loadAllPagesAsync) await figma.loadAllPagesAsync();
let target = figma.root.children.find((p) => p.name === TARGET_PAGE);
if (!target) { target = figma.createPage(); target.name = TARGET_PAGE; }
const source = SOURCE_PAGE ? figma.root.children.find((p) => p.name === SOURCE_PAGE) : figma.root.children[0];
if (!source) throw new Error('source page not found');
if (source.loadAsync) await source.loadAsync();
if (target.loadAsync) await target.loadAsync();

const known = new Set(KNOWN_IDS);
const fresh = source.children.filter((n) => !known.has(n.id) && !n.getSharedPluginData('d2f', 'section'));
const placed = [], unmatched = [];
// Where to continue the grid: below everything already on the target page.
const existing = target.children.filter((n) => n.getSharedPluginData('d2f', 'section'));
let x = 0, y = existing.length ? Math.max(...existing.map((n) => n.y + n.height)) + GAP : 0, col = 0, rowH = 0;

fresh.forEach((node, i) => {
  const sec = SECTIONS[i];
  if (!sec) { unmatched.push({ id: node.id, name: node.name }); return; }
  node.setSharedPluginData('d2f', 'section', sec.id);
  node.setSharedPluginData('d2f', 'label', sec.label || '');
  node.name = `${sec.id} · ${sec.label || sec.id}`;
  target.appendChild(node);
  node.x = x; node.y = y;
  rowH = Math.max(rowH, node.height);
  col++;
  if (col >= COLUMNS) { col = 0; x = 0; y += rowH + GAP; rowH = 0; } else x += node.width + GAP;
  placed.push({ id: node.id, name: node.name, section: sec.id, w: Math.round(node.width), h: Math.round(node.height) });
});
figma.currentPage = target;
if (placed.length) figma.viewport.scrollAndZoomIntoView(placed.map((p) => figma.getNodeById(p.id)));
return JSON.stringify({ target: TARGET_PAGE, placed, unmatched, leftOnSource: source.children.length });
