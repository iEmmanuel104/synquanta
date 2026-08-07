# Video kit — "Most software fails because someone guessed"

**Concept role:** positioning · **Length:** 15s · **Format:** 1080×1920 (9:16)
**Opening frame:** `marketing/out/research-first/status.png` — feed this as the
image input for image-to-video, so shot 1 is on-brand from frame one.

Safe zone: nothing important in the top 120px or bottom 200px. Burn subtitles
in — most of this will be watched with the sound off.

---

## Script

| Time | On screen | Voiceover |
|---|---|---|
| 0.0–2.5s | **HOOK.** Hard cut to the line, white on forest green, no build. | "Most software fails for a boring reason." |
| 2.5–5.0s | The word **guessed** lands in mint. | "Somebody guessed what people wanted." |
| 5.0–8.5s | Cut to a desk: notes, a screen with a call in progress. | "We do the unglamorous part first. We read the market. We talk to the people who'll actually use it." |
| 8.5–12.0s | Four steps stack in: Research → Design → Build → Launch. | "Then we design it, build it, and stay with it to launch." |
| 12.0–15.0s | Logo lockup, `synquanta.com`. | "SynQuanta. We find out what to build, then we build it." |

**Read it flat.** No upsell inflection, no smile in the voice on the hook line.
The claim is the interesting part; performing it makes it sound like an ad.

## Shot list

1. **0–2.5s** Static type card. No motion but a slow 1.02× push. Text must be legible in the first 300ms — nothing animates in.
2. **2.5–5.0s** Same card, the last two words swap to mint. One cut, no transition.
3. **5.0–8.5s** Live action or stock: over-shoulder at a desk, notebook with real handwriting, a video call on the monitor. Shallow depth of field. No stock-photo smiling.
4. **8.5–12.0s** Motion graphic over dark green: four rows stack in, 120ms apart, mono numerals `01`–`04` in sage.
5. **12.0–15.0s** Logo on the dark hero gradient, orbit node completes one pass, URL fades up.

## Model prompts

Structure is Subject → Action → Environment → Cinematics. Present tense.
Keep each between 60 and 120 words.

### Shot 3 — Veo (precise camera language)
> A software designer in their early thirties sits at a wooden desk in a quiet home office, writing in a notebook beside a laptop showing a video call with a client. Late afternoon light rakes in from a window on the left, catching dust in the air. The camera performs a slow 20cm dolly-in at chest height, shallow depth of field at f/1.8, focus resting on the pen and paper while the screen stays softly out of focus behind. Muted greens and warm neutrals. Calm, unhurried, documentary realism. No text, no logos, no direct eye contact with the camera.

**Negative:** text overlays, watermarks, logos, stock-photo smiling, glossy corporate lighting, extra fingers, warped hands, screen glare obscuring the laptop.

### Shot 3 — Runway (stylised visual descriptors)
> Documentary-style close shot of hands writing notes in a notebook on a wooden desk, laptop screen glowing softly behind with a video call. Muted forest-green and warm neutral palette, natural side light, film grain, shallow focus, gentle handheld drift. Unhurried and observational, editorial rather than corporate.

**Negative:** text, logos, watermark, cartoon, oversaturated, fast cuts, lens flare.

### Shot 3 — Sora (narrative framing)
> Before anyone writes a line of code, someone has to find out what is actually needed. We watch a designer at a desk in the late afternoon, notebook open, a client talking on the laptop screen. They are listening more than they are typing. The camera stays with the pen and the paper, drifting in almost imperceptibly. Natural window light, muted greens, no music cue, nothing performed for the camera.

**Negative:** on-screen text, brand logos, stock-footage gloss, people smiling at camera.

---

## Deliverable checklist

- [ ] 1080×1920, H.264 MP4
- [ ] Subtitles burned in, inside the safe zone
- [ ] Final frame holds the logo for at least 1.5s
- [ ] No claim that is not already on the live site
