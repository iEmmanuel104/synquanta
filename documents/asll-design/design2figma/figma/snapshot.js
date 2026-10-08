// use_figma template — run BEFORE capturing. Records the top-level node ids on the page captures land on
// (index 0) so place.js can tell new frames from old ones. Paste the returned ids into place.js KNOWN_IDS.
// Load the figma:figma-use skill before any use_figma call.
const SOURCE_PAGE = ''; // '' = first page (where html-to-design drops captures); or a page name

const source = SOURCE_PAGE ? figma.root.children.find((p) => p.name === SOURCE_PAGE) : figma.root.children[0];
if (!source) throw new Error('source page not found');
if (source.loadAsync) await source.loadAsync();
return JSON.stringify({ page: source.name, ids: source.children.map((n) => n.id), count: source.children.length });
