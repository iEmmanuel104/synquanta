# design2figma

Moves a **Claude Design board export** (`*.dc.html` + `support.js` + `boards/` + `assets/`) into a **Figma page as
editable layers**, section by section, using Figma's own html-to-design capture script. The Node side stages and
serves the export, forces every lazily-mounted screen to render, discovers the board's sections, fires the captures
and verifies the result against DOM counts. The Figma side (create page, place, count) runs through the Figma MCP
(`generate_figma_design`, `use_figma`) — those calls cannot be made from Node, so the agent drives them with the
script templates in `figma/`.

Direction: **HTML → Figma**. The sibling `../figpipeline/` goes the other way (Figma `.fig` → HTML).

## Prerequisites

- Node ≥ 22, pnpm. `pnpm install` then `npx playwright install chromium` (one-off; ~150 MB). If Chromium cannot be
  installed, pass `--channel chrome` to use the system Google Chrome instead.
- macOS for the clipboard check (`osascript -e 'clipboard info'`); everything else is portable.
- A Figma plan with MCP quota (Starter exhausts after a handful of captures — that is what forced the clipboard flow
  on 6 Oct 2026). Professional: 200 captures/day, 10/min.
- Figma MCP signed in (`mcp__plugin_figma_figma__authenticate`) for the agent-side steps.

## Usage (one run)

```bash
cd website/documents/asll-design/design2figma

# 1. stage: unzip/copy, vendor React, inject window.__resources, write runs/<stamp>/run.json
node design2figma.mjs stage ~/Downloads/"SecureMe Design Baseline Review.zip" --no-serve
#    (without --no-serve it also keeps serving in the foreground; prep reuses that server if it is up)

# 2. prep: headed Chromium, mounts every lazy host, discovers sections → sections.json + expected.json
#    --keep leaves the browser open as a daemon so the next commands reuse the prepared page
node design2figma.mjs prep --board "SecurePeople Mobile Flow Board" --keep &
#    prints: hosts=155 empty=0 … sections=[flow-1(23), flow-2(10), …]   ← empty MUST be 0

# 3. (agent, Figma MCP) create the target page and move it to index 0 — captures land on the FIRST page.
#    snapshot.js → KNOWN_IDS.  Then per section:
#      generate_figma_design({fileKey})  → { captureId, endpoint }
node design2figma.mjs capture --section flow-1 --capture-id <cid> --endpoint "<url>"
#      poll generate_figma_design({fileKey, captureId}) ≥ 5 s apart until "completed"; next section.

# 4. (agent) use_figma figma/place.js   (fill TARGET_PAGE, KNOWN_IDS, SECTIONS in capture order)
#    (agent) use_figma figma/verify.js  → save the JSON as runs/<run>/actual.json
node design2figma.mjs verify --actual runs/<run>/actual.json     # → runs/<run>/report.md, exit 1 on any miss

node design2figma.mjs stop        # close the daemon's browser
node design2figma.mjs status      # run, boards, daemon, capture log
```

Clipboard fallback (no MCP quota): `capture --section flow-1 --mode clipboard`, then a human presses **Cmd+V** on the
target page in Figma. The command prints `clipboard info`; a full section is ≈ 20–30 MB of `figh2d` data. If it says
`string, 128` nothing was copied.

### How the daemon works

`prep --keep` holds the Playwright browser and watches `runs/<run>/queue/`. `capture`, `expected` and `stop` just
drop a JSON command there and wait for the matching `*.done.json`. No ports, no sockets, works from any shell — and the
page is never reloaded between captures, so the mounted screens stay mounted. `daemon.json` records the pid; a stale
one (process gone) is ignored. Chosen over a control server because it has nothing to secure and nothing to clash with.

### Files

| path | role |
|---|---|
| `design2figma.mjs` | CLI: `stage`, `prep`, `capture`, `expected`, `verify`, `status`, `stop` |
| `lib/stage.mjs` | unzip/copy → `runs/<run>/stage`; parses `support.js` for the CDN URL+SRI pairs, vendors them (SRI-checked), injects `window.__resources` into each board |
| `lib/server.mjs` | dependency-free static server on a free port |
| `lib/session.mjs` | Playwright session (persistent profile `runs/profile/`), prep driver, DOM counts, capture, queue daemon |
| `lib/inpage.js` | in-page helpers: host detection, section/screen discovery, label extraction, node counting |
| `lib/prep.js` | in-page: stable host count → scroll-mount passes → images/fonts → sections → `window.__sqReady` |
| `lib/dom-counts.js` | in-page: per-section + per-screen `texts/images/svgs/vectors` → `window.__sqExpected` |
| `verify.mjs` | expected vs actual → markdown table, PASS/FAIL |
| `figma/snapshot.js` | `use_figma` template: ids on the capture page before capturing |
| `figma/place.js` | `use_figma` template: tag + rename + move new frames to the target page, grid |
| `figma/verify.js` | `use_figma` template: per-frame TEXT / image-fill / vector counts → `actual.json` |
| `vendor/` | React 18.3.1 UMD (react + react-dom) matching `support.js`'s SRI; re-downloaded from unpkg if missing |
| `runs/<stamp>/` | `stage/`, `run.json` (port, boards, capture.js hash, captures), `sections.json`, `expected.json`, `actual.json`, `report.md`, `capture-log.txt`, `queue/` — git keeps only `report.md` |

`run.json` records the size and sha256 of the `capture.js` fetched for that run (387 273 bytes on 2026-10-08).

## Gotchas — all of these have bitten

1. **Serve over HTTP.** `file://` does not work: `support.js` boots React from `window.__resources` / the CDN and
   re-fetches `location.href` when no override is present. `stage` injects the override that maps the unpkg URLs to
   `./vendor/*.js` (same trick as the served board copies) so the board renders offline and with no SRI surprises.
2. **Every lazy host must be rendered before capturing.** Screens mount through an IntersectionObserver + idle queue
   (`SPScreen` in `boards/securepeople-mobile/screens.js`); hosts are `div.sc-host-x` and an unmounted one has
   < 5 DOM nodes. The 6 Oct capture lost 20/99 screens by skipping this. `prep` scrolls every empty host into view,
   up to 6 passes, and refuses nothing — *you* must check `empty=0` before capturing (`capture` warns too).
3. **No hardcoded host count.** The 6 Oct wrapper waited for exactly 138 hosts; the 8 Oct export has 155. `prep`
   waits until the count has been stable for 2 s instead.
4. **Tab visible and focused.** The capture script serialises in the foreground and shows "Capture timed out. Try
   keeping this tab in the foreground" otherwise. `capture` calls `bringToFront()` and activates the browser app;
   do not click into another window while a capture runs.
5. **Captures land on the file's first page.** Create the target page and move it to index 0 before capturing
   (`figma:figma-use` → `figma.root.insertChild(0, page)`), or use `figma/place.js` to move them afterwards.
6. **captureIds are single-use** — one `generate_figma_design` per section — and `figmaselector` must match exactly
   one element (`#flow-1` …; the ids are *not* contiguous: `flow-6` is missing and `flow-7` is labelled "Flow 6").
7. **Never await `captureForDesign`.** It can hang; the tool fires it inside a `setTimeout` and watches the console and
   the POST to `…/submit` instead. Poll `generate_figma_design({fileKey, captureId})` ≥ 5 s apart.
8. **Hash vs API.** First capture: set the URL hash (`#figmacapture=<id>&figmaendpoint=…&figmaselector=…&figmadelay=500`)
   and add the script tag — the script reads the hash on boot. Later captures: `window.figma.captureForDesign({...})`
   (`--via api`, the default once loaded) so the page is never reloaded. Re-adding the script tag also works (no load
   guard as of 2026-10) — `--via hash` forces it.
9. **Counts are approximate across the boundary.** `texts` = DOM elements owning text (≈ Figma TEXT); `vectors` = SVG
   shape elements (Figma may flatten an `<svg>` into one VECTOR, so compare `svgs` too when vectors miss);
   `images` = `<img>` + background-image + canvas/video (≈ image fills). Text is checked exactly, images/vectors ±10 %.
10. **Fonts.** The board uses Bricolage Grotesque / Figtree from Google Fonts; the Figma file substitutes
    Circular Std / Matter. Missing-font warnings in Figma are expected, not a capture failure.
11. **The affiliate board is embedded.** `SecurePeople Mobile Flow Board.dc.html` `<dc-import>`s
    `AffiliatePartnersBoard.dc.html` as section `flow-11`, so one run of the mobile board covers section 10 as well;
    the affiliate file only needs its own run if you want it on a separate page.
12. **Rate limits.** Professional MCP: 200 captures/day, 10/min. One capture per section (≈ 10 per board) is far
    inside that; one capture per *screen* (≈ 150) is not.
13. **The persistent profile** (`runs/profile/`) keeps clipboard permissions and avoids first-run dialogs. Delete it
    if Chromium starts misbehaving; nothing else lives there.

## Troubleshooting

| symptom | cause / fix |
|---|---|
| `hosts=0` after 30 s | the board did not boot: check the console lines printed by `prep` (404 on `support.js` / `sp.bundle.js` means the zip had a wrapper folder the stager did not detect — pass the inner folder) |
| `empty=N` stays > 0 | screens did not mount in 6 passes: enlarge the window, rerun `prep`, or check the console for a bundle error |
| `no daemon for this run` | start `prep --board … --keep` first; `status` shows the daemon pid |
| capture: `no outcome within 90 s` | tab lost focus, or the section is huge; look at the browser (a Figma toast shows progress), then re-run with `--wait 180` and a fresh captureId |
| capture: `HTTP 4xx …/submit` | expired / already-submitted captureId → new `generate_figma_design` |
| `Element not found` | selector does not match: `sections.json` has the exact selector per section |
| clipboard shows `string, 128` | nothing copied — the tab was not focused or clipboard permission was denied; retry with the window in front |
| `SRI mismatch` during stage | the export's `support.js` wants a different React build than `vendor/`; delete `vendor/*.js` to re-download |
| Chromium fails to launch | `npx playwright install chromium`, or `--channel chrome` |
| verify FAILs on vectors only | SVG flattening (gotcha 9) — check `svgs` in `expected.json` against the Figma count before re-capturing |

Set `D2F_DEBUG=1` for stack traces.

## Learned on the 2026-10-08 run (SecurePeople board → `j5ifhew2ShnVua97ASIkH6`)

- `generate_figma_design({fileKey, nodeId: <PAGE id>})` makes the capture land on that page, as a page-level frame named
  "Section". Passing a SECTION node id does **not** nest the capture inside it — create no placeholder sections; just
  rename and stack the frames afterwards (`figma/place.js`).
- Images and vectors matched the DOM exactly in all 10 sections; texts came out 94–100 % because Figma merges adjacent
  spans — `verify` therefore allows ±8 % on texts (min slack 2) and is exact-ish (±10 %) on images/vectors.
- Ten endpoint captures of a 233-screen board took ~20 s each and ~12 MCP calls in total (1 id + 1 poll per section).
- Run capture loops with `bash -c '…'` — zsh does not word-split `$pair`, so a `for … set -- $pair` loop silently runs once.
- The page list from `get_metadata` can lag; read pages with a `use_figma` script when in doubt.
- **Prefer ONE whole-board capture over per-section captures.** `capture --section '#dc-root > .sc-host > div'`
  (the common ancestor of all `#flow-N` sections) sends the whole board (23.6 MB for 233 screens) and lands as a single
  frame that reproduces the board layout exactly — sections in columns, rows intact, nothing to re-stack. capture.js
  reports "Request timed out after 60 seconds" on the upload, **but the server still processes it**: poll the capture
  id / read the page children before trying anything else. Per-section captures stay the fallback for boards > 50 MB.
- **Do NOT re-flow a capture.** Every attempt to regroup/reposition cards (card-boundary rows, DOM-order wrapping,
  text-class heuristics) scrambled or elongated the layout, and one pass that recursed into screens stretched/blanked
  them with no undo. The capture is already the board; keep it.
- **Overlapping screens are the board's own flex-shrink, fixed by hugging (`figma/unshrink.js`)**: sections 04/05 had
  29 + 21 overlapping pairs because the board's step columns shrink below their 402-px screens and capture.js keeps those
  wrappers as auto-layout frames with a FIXED counter axis. Setting every overflowing non-screen wrapper to hug
  (`counterAxisSizingMode = 'AUTO'`, `layoutSizingHorizontal = 'HUG'`, deepest first) re-flows the rows natively and the
  auto-layout board widens by itself (34265 → 35192). Moving cards by `x` does nothing inside auto-layout parents.
- Ground truth for any layout doubt: `runs/dom-layout-probe.mjs <served url> <out.json>` dumps every section's DOM size
  and child rows headlessly (screens unmount off-screen in headless, so use it for sizes, not per-screen boxes).
- **Image shortfall = re-capture that section**: one section came back with 39/46 image fills (lazy avatars not yet
  loaded); a second capture of just that section a minute later matched exactly. Compare counts, swap the frame.
- `generate_figma_design` node ids from a batch are not contiguous (72/76 were skipped) — read the page children, don't assume.
