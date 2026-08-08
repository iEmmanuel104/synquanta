# SynQuanta ad creative

Generates pixel-exact, on-brand advertising creative for WhatsApp Status, Meta
placements and link ads, plus the ad copy and video kits that go with them.

**Looking for the finished files to post?** → `DELIVERY.md`. This file is about
how they are made.

```bash
node build.mjs        # HTML → marketing/out/<concept>/<placement>.html
./render.sh           # HTML → pixel-exact PNG, via headless Chrome
node verify.mjs       # dimensions, safe zones, distinctness, prices, copy
```

`node build.mjs <concept>` builds one concept. Output is disposable — `build.mjs`
clears `out/` each run, so never hand-edit a file in there.

## Why headless Chrome and not an image library

**Clash Display exists only as woff2 in this repo.** There is no TTF or OTF
anywhere, so `sharp`, ImageMagick and Pillow cannot set the display face at all —
they would silently fall back to Inter and every headline would be wrong. Chrome
is the only rasteriser on this machine that can render the actual brand type.

`render.sh` therefore uses `--screenshot` with an explicit `--window-size`.
Note this differs from `documents/asll-bid/render.sh`, which uses
`--print-to-pdf`: that is page-sized (A4) and cannot produce a 1080×1920 canvas.
`--virtual-time-budget` plus `--run-all-compositor-stages-before-draw` is what
lets the inlined fonts load before the frame is captured. Remove either and the
type silently degrades.

## Placements

| Key | Size | Reserved (top/bottom/side) | Where |
|---|---|---|---|
| `status` | 1080×1920 | 120 / 200 / 60 | WhatsApp Status |
| `story` | 1080×1920 | **270 / 670 / 65** | IG/FB Stories + Reels |
| `feed45` | 1080×1350 | 48 | Feed, primary. 4:5 outperforms 1:1 on mobile |
| `feed11` | 1080×1080 | 48 | Feed / carousel. Meta rejects mixed ratios in one carousel |
| `link` | 1200×628 | 40 | Link ad |

**Design 9:16 first.** It is the hardest constraint — two or three seconds,
sound off, thumb hovering — and every other placement is a reflow of an idea
that already survived it.

**The two 9:16 placements are not the same size of problem.** WhatsApp only
takes the sender name and the reply bar. Meta unified Facebook Stories, Facebook
Reels, Instagram Stories and Instagram Reels into one 9:16 safe zone in March
2026, and it swallows the bottom 35% for the caption, audio row and Learn More
button, plus the engagement rail on the right — leaving about 950×980 to work
in. `story` therefore sets `compact: true` and `concepts.mjs` drops the
numbered aside for it, rather than shrinking type below arm's-length legibility.

These were identical until 2026-08-08, which shipped a Stories asset with its
logo and URL underneath Instagram's own UI. `verify.mjs` now fails if any two
renders in a concept come out byte-identical, and measures the reserved bands
per placement by thresholding the rendered pixels for near-white ink.

## Concepts

| Key | Role | Line |
|---|---|---|
| `what-we-build` | what we do | The software your business actually runs on |
| `how-we-work` | how we do it | You see it every week. No black box. |
| `hard-part` | direct response | Bring us the hard part |

The set answers what → how → act. Ad copy for each is in `copy/`, video kits in
`video/`. A concept without a `copy/<name>.md` cannot be launched — Ads Manager
requires Primary text, Headline and a CTA on every ad — so `verify.mjs` fails
if creative exists without a matching sheet.

Two concepts are **retired**, documented in `lib/concepts.mjs` and not exported:

- `shipped` named the five portfolio clients on the creative. An ad is the
  wrong surface for a client list, and putting other companies' brands in paid
  media raises a permission question we have no reason to open. The portfolio
  is one click away on the site.
- `missed-call` sold the AI Receptionist, hidden until the product is finished
  end to end. Restore it alongside `/hvac`, and re-check its price line against
  `src/constants/hvac.ts` then — `verify.mjs` only guards exported concepts.

## Rules

- **Copy comes from the live site.** `src/constants/*.ts` and the shipped pages
  are the source. Do not invent a claim for an ad that the site does not make.
- **No timeline claims.** Never put a duration on research, design or delivery.
  A line like "a week of research" reads as a fixed process, gets quoted back at
  you in a sales call, and is wrong for most projects. Scope drives the
  schedule, and the schedule is agreed per project, in writing.
- **No client names.** Same reason `shipped` was retired.
- **Prices must match `src/constants/hvac.ts` byte for byte.** Paddle
  cross-checks published prices against the catalog, so a typo here is a
  compliance problem, not a design one. `verify.mjs` enforces it.
- **Orbit Atom only.** The `synquanta-logo-*` set in `design-assets/brand/` is
  the previous generation. Use `public/brand-kit/orbit-atom-*`.
- **No FIFA marks.** No "26" emblem, no trophy, no host-city emblems. The World
  Cup campaign is retired; the trademark rule outlives it. See
  `design-assets/worldcup/WORLDCUP-DESIGN-REFERENCE.md`.
- **Minimum sizes** (from `design-assets/brand/brand-guidelines.html`): full
  lockup 120px wide, mark alone 24px. Clear space is the mark's inner core
  height, `18/96` of mark height — that ratio is set in `lib/brand.mjs` because
  the guidelines only ever said "adequate".

## Photography

Backgrounds come from `public/images/ad/`, royalty-free under Unsplash, Pexels
or Pixabay licences, with provenance recorded in `public/images/CREDITS.md`.
The three selection rules live there and govern anything added — no recognisable
faces, no third-party branding, and readable text only where it is the subject
of the shot rather than a message competing with the headline.

Each photo occupies a defined **band** — the top 44%, or the right 52% on the
landscape canvas — at full strength, and is masked so it dissolves into the
brand colour. An earlier version washed the image across the whole canvas at 28%
opacity under a near-opaque gradient, which kept the copy legible but made the
photograph invisible: it was paying file weight for nothing. Masking rather than
covering also avoids a hard seam, because the body sits on a two-stop gradient
that no single flat fade colour can meet.

Every word of copy still sits on solid brand colour, which is what keeps the
type legible on a phone in daylight. That in turn is what lets `verify.mjs`
detect intrusion by thresholding for near-white ink: the photography is darkened
to a maximum of 0.44 luminance and type sits above 0.9, so nothing in the
picture can be mistaken for a headline.

Photos inline as base64, because Chrome renders from `file://` with no server. A
missing file logs a warning and renders without it rather than failing the build.

## Adding a concept

Three things, all required:

1. A render function in `lib/concepts.mjs`, registered in `CONCEPTS`. Use the
   shared `frame()` skeleton rather than a bespoke layout, so every concept
   keeps the same vertical rhythm across all five canvases. Give it a `short`
   line — that is what the Stories/Reels frame uses in place of `body`.
2. A copy sheet at `copy/<name>.md`, following the shape of the existing three.
   `verify.mjs` fails without it.
3. A video kit at `video/<name>.md`, if the concept is going to be filmed.

Then rebuild, render and verify.
