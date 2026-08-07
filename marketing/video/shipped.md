# Video kit — "Five products. Real users."

**Concept role:** proof · **Length:** 15s · **Format:** 1080×1920 (9:16)
**Opening frame:** `marketing/out/shipped/status.png`

The only concept that uses real footage of real work. Product screenshots come
from `public/screens/` — they are ours to show. **Do not generate fake app UI**
for this one: the whole point is that these shipped.

Safe zone: top 120px, bottom 200px. Subtitles burned in.

---

## Script

| Time | On screen | Voiceover |
|---|---|---|
| 0.0–2.5s | **HOOK.** "Five products." then "Real users." in mint. | "Five products. Real users." |
| 2.5–8.0s | Screenshots cut in sequence, ~1.1s each, name chip under each. | "A trading platform. A talent network. A professional community. A marketplace. A fashion storefront." |
| 8.0–11.5s | The five name chips assemble into the grid from the still. | "Fintech, education, community, commerce. Different problems, same approach." |
| 11.5–15.0s | Logo, `synquanta.com/portfolio`. | "Each one started as a conversation. Yours can too." |

**Pace the middle section fast and the last line slow.** The rhythm change is
what makes the close land.

## Shot list

1. **0–2.5s** Type card, two beats, hard cut between them.
2. **2.5–8.0s** Five screenshot cards, each on the dark gradient with a subtle 1.03× push and a 150ms crossfade. Order: Funded Forge → GritGateway → BlackAt → Busy2Shop → Nevelline. Source images: `public/screens/{fundedforge,gritgateway,blkat,busy2shop,nevelline}.jpg`.
3. **8.0–11.5s** Chips animate into the wrapped grid, 80ms stagger, matching the still.
4. **11.5–15.0s** Logo on the dark hero gradient, URL fades up, orbit node completes a pass.

## Model prompts

This concept is **mostly motion graphics over real screenshots**, so there is
little for a video model to generate. If you want one atmospheric establishing
shot to open on instead of the type card:

### Optional establishing shot — Veo
> A phone lies face-up on a dark desk, its screen showing a clean app interface, the glow lighting the surface around it. A hand reaches in and scrolls once, unhurried. The camera holds a static top-down framing at 50mm, shallow depth of field, the far edge of the desk falling out of focus. Low warm key light from the upper left, deep green ambient fill. Calm, quiet, no urgency. Real device, real use.

**Negative:** readable app text, brand logos, watermarks, fake or garbled UI, extra fingers, warped hands, screen flicker or moiré.

### Optional establishing shot — Runway
> Top-down static shot of a phone on a dark desk, screen glowing, a hand scrolling once slowly. Deep green ambient light, warm key from upper left, shallow focus, subtle film grain. Quiet and understated.

**Negative:** readable text, logos, watermark, garbled interface, fast motion, oversaturation.

> **Note:** models still render fake app UI badly, and garbled interface text
> reads as fake instantly — which would undo the entire point of a proof ad.
> Prefer the type card, or shoot this on a real phone showing a real build.

---

## Deliverable checklist

- [ ] 1080×1920, H.264 MP4
- [ ] Real screenshots only, no generated app UI
- [ ] Every product name spelled as in `src/constants/portfolio.ts`
- [ ] Subtitles burned in, inside the safe zone
