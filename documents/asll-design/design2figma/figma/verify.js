// use_figma template — run AFTER place.js. For every top-level frame on TARGET_PAGE, counts TEXT nodes,
// nodes with an image fill, and vector-ish nodes (VECTOR, BOOLEAN_OPERATION, STAR, POLYGON, LINE, ELLIPSE).
// Save the returned JSON as runs/<run>/actual.json and run: node design2figma.mjs verify --actual runs/<run>/actual.json
// Load the figma:figma-use skill before any use_figma call.
const TARGET_PAGE = 'Flow Board — 2026-10-08';
const VECTOR_TYPES = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'LINE', 'ELLIPSE']);

if (figma.loadAllPagesAsync) await figma.loadAllPagesAsync();
const page = figma.root.children.find((p) => p.name === TARGET_PAGE);
if (!page) throw new Error('page not found: ' + TARGET_PAGE);
if (page.loadAsync) await page.loadAsync();

const hasImageFill = (n) => 'fills' in n && Array.isArray(n.fills) && n.fills.some((f) => f.type === 'IMAGE' && f.visible !== false);
const frames = page.children.map((f) => {
  const c = { texts: 0, images: 0, vectors: 0, nodes: 0, children: [] };
  const walk = (n) => {
    c.nodes++;
    if (n.visible === false) return;
    if (n.type === 'TEXT') c.texts++;
    else if (VECTOR_TYPES.has(n.type)) c.vectors++;
    if (hasImageFill(n)) c.images++;
    if ('children' in n) n.children.forEach(walk);
  };
  walk(f);
  // Per direct child (≈ screen) counts, for the per-screen table in the report.
  if ('children' in f) for (const k of f.children) {
    const kc = { texts: 0, images: 0, vectors: 0 };
    const w = (n) => { if (n.visible === false) return; if (n.type === 'TEXT') kc.texts++; else if (VECTOR_TYPES.has(n.type)) kc.vectors++; if (hasImageFill(n)) kc.images++; if ('children' in n) n.children.forEach(w); };
    w(k);
    c.children.push({ id: k.id, name: k.name, w: Math.round(k.width), h: Math.round(k.height), ...kc });
  }
  return { id: f.id, name: f.name, section: f.getSharedPluginData('d2f', 'section') || null, w: Math.round(f.width), h: Math.round(f.height), ...c };
});
return JSON.stringify({ page: TARGET_PAGE, fileKey: figma.fileKey || null, at: new Date().toISOString(), frames });
