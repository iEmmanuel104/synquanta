# SynQuanta ad creative

Generates pixel-exact, on-brand advertising creative for WhatsApp Status, Meta
placements and link ads, plus the video kits that go with them.

```bash
node build.mjs        # HTML → marketing/out/<concept>/<placement>.html
./render.sh           # HTML → pixel-exact PNG, via headless Chrome
node verify.mjs       # dimensions, safe zones, price claims
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

| Key | Size | Where |
|---|---|---|
| `status` | 1080×1920 | WhatsApp Status |
| `story` | 1080×1920 | IG/FB Stories + Reels (Meta unified these into one safe zone) |
| `feed45` | 1080×1350 | Feed, primary. 4:5 outperforms 1:1 on mobile |
| `feed11` | 1080×1080 | Feed / carousel. Meta rejects mixed ratios in one carousel |
| `link` | 1200×628 | Link ad |

**Design 9:16 first.** It is the hardest constraint — two or three seconds,
sound off, thumb hovering — and every other placement is a reflow of an idea
that already survived it. Content stays clear of the top 120px and bottom 200px,
where the Status UI puts the sender name and the reply bar. `verify.mjs` checks
this by sampling the rendered pixels, not by trusting the CSS.

## Concepts

| Key | Role | Line |
|---|---|---|
| `what-we-build` | what we do | The software your business actually runs on |
| `how-we-work` | how we do it | You see it every week. No black box. |
| `hard-part` | direct response | Bring us the hard part |

The set answers what → how → act. Video kits for each are in `video/`.

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
Two house rules apply to anything added: **no clearly recognisable faces** and
**no readable brand logos or on-screen text**.

Each photo sits at low opacity under a near-opaque forest gradient
(`GRADIENT.overlay`). That is not a style choice — ad copy has to stay legible
on a phone in daylight, so the image supplies texture and never competes with
the headline for contrast. Photos inline as base64, because Chrome renders from
`file://` with no server. A missing file logs a warning and renders without it
rather than failing the build.

## Adding a concept

Add a render function to `lib/concepts.mjs` and register it in `CONCEPTS`. Use
the shared `frame()` skeleton rather than a bespoke layout, so every concept
keeps the same vertical rhythm across all five canvases. Then rebuild, render
and verify.
