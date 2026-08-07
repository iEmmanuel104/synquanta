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
| `research-first` | positioning | Most software fails because someone guessed |
| `shipped` | proof | Five products. Real users. |
| `hard-part` | direct response | Bring us the hard part |

Together they run a funnel: why us → proof → act. Video kits for each are in
`video/`.

A fourth concept, `missed-call`, is **commented out** in `lib/concepts.mjs`. It
sells the AI Receptionist, which is hidden from the site until the product is
finished end to end. Restore it alongside `/hvac`.

## Rules

- **Copy comes from the live site.** `src/constants/*.ts` and the shipped pages
  are the source. Do not invent a claim for an ad that the site does not make.
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

## Adding a concept

Add a render function to `lib/concepts.mjs` and register it in `CONCEPTS`. Use
the shared `frame()` skeleton rather than a bespoke layout, so every concept
keeps the same vertical rhythm across all five canvases. Then rebuild, render
and verify.
