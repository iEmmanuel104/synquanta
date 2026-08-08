# Start here — what to upload where

Everything is in `website/marketing/`. Nothing needs building or rendering to
use it; the finished files are committed.

```
marketing/out/<concept>/<placement>.png   the 15 finished images
marketing/copy/<concept>.md               the text that goes with each one
marketing/video/<concept>.md              scripts, shot lists, AI video prompts
```

Three concepts, five placements each. Run them in this order — `what-we-build`
to cold audiences, `how-we-work` to anyone who has seen it, `hard-part` to ask.

---

## The upload table

| Where you are posting | File | Size | Copy to paste |
|---|---|---|---|
| **WhatsApp Status** | `<concept>/status.png` | 1080×1920 | "WhatsApp Status" section |
| **Instagram Stories** | `<concept>/story.png` | 1080×1920 | image only — no text field |
| **Instagram Reels** | `<concept>/story.png` | 1080×1920 | image only, caption optional |
| **Facebook Stories** | `<concept>/story.png` | 1080×1920 | image only |
| **Facebook Reels** | `<concept>/story.png` | 1080×1920 | image only |
| **Instagram feed** | `<concept>/feed45.png` | 1080×1350 | "Facebook & Instagram feed" |
| **Facebook feed** | `<concept>/feed45.png` | 1080×1350 | "Facebook & Instagram feed" |
| **Feed carousel** | `<concept>/feed11.png` | 1080×1080 | "Feed carousel" in `what-we-build.md` |
| **Link / traffic ad** | `<concept>/link.png` | 1200×628 | "Link ad" |

**`status.png` and `story.png` are not interchangeable**, even though both are
1080×1920. See the next section — this is the one thing in here that will cost
you money if you get it wrong.

---

## Why there are two different 9:16 files

Instagram and Facebook reserve far more of the screen than WhatsApp does.

| | WhatsApp Status | IG/FB Stories + Reels |
|---|---|---|
| Top reserved | 120px — sender name, progress bar | **270px** — profile row, close button |
| Bottom reserved | 200px — reply field | **670px** — caption, audio row, Learn More button |
| Sides reserved | 60px | 65px, plus the like/comment/share rail on the right |
| Usable | 1080×1600 | **950×980** |

Meta unified Facebook Stories, Facebook Reels, Instagram Stories and Instagram
Reels into one 9:16 safe zone in March 2026, so `story.png` covers all four.

Because Stories and Reels leave only a 950×980 window, `story.png` drops the
numbered list that `status.png` carries and lets the headline do the work.
That is deliberate, not a missing feature — on that placement the ad has no
primary text field at all, so the image is the entire message.

Posting `status.png` to Instagram would bury the logo and the URL underneath
Instagram's own caption and button. `node verify.mjs` fails the build if the
two files are ever byte-identical again.

---

## Running a paid campaign

1. **Ads Manager → Create → Traffic** (or Leads, if you would rather collect
   the enquiry in-platform than send people to `/contact`).
2. Turn **Advantage+ placements off**. It will otherwise stretch one asset
   across every surface and undo the point of having five sizes.
3. Add each placement's own file from the table above.
4. Paste Primary text, Headline and Description from `copy/<concept>.md`.
   They are already written to the length Meta actually shows — do not pad them.
5. Set the CTA button: **Learn More** for `what-we-build` and `how-we-work`,
   **Contact Us** for `hard-part`.
6. Append the UTM string from `copy/README.md` to the destination URL. PostHog
   is already live on the site and will pick it up with no further setup; skip
   this and you will not be able to tell which ad produced an enquiry.

## Posting to WhatsApp Status

Status is organic — there is nothing to configure. Post `status.png` and use the
caption from the "WhatsApp Status" section of the concept file. Status has no
clickable link and no "see more", so keep the caption to two lines and put the
URL in it as plain text.

`hard-part` is the best of the three here, because Status cannot link out and
its caption has to carry the whole ask.

---

## Profile and cover art

`marketing/social/` holds the Page assets the ads run from. Meta shows the Page
avatar next to every ad, so this is part of the creative whether you treat it
that way or not.

| File | Size | Where |
|---|---|---|
| `avatar.png` | 1080×1080 | Facebook Page, Instagram, WhatsApp Business profile picture |
| `cover.png` | 1640×624 | Facebook Page cover |

Both are uploaded larger than they display, because every platform downscales
and none upscales. The avatar is cropped to a circle everywhere, and `cover.png`
keeps all its artwork inside the centre 1280px so Facebook's mobile crop cannot
cut the wordmark.

These replace `design-assets/brand/social-profile-image.svg` and
`social-banner.svg`, which draw the previous-generation logo — and whose
1500×500 is a Twitter/LinkedIn banner, not a Facebook cover. Do not upload
those. Regenerate with `node social.mjs`.

## Video

`video/<concept>.md` holds a 15-second script with timings, a shot list, and
prompts tuned separately for Veo, Runway and Sora — each with its own negative
prompt. Feed the prompts to whichever generator you are using; the opening
frame is already rendered at `out/<concept>/status.png`.

No video is rendered here. There is no ffmpeg in this workspace, and the
prompts are the part that is hard to write.

---

## Changing anything

```bash
cd website/marketing
node build.mjs && ./render.sh && node verify.mjs
```

Edit `lib/concepts.mjs` for the creative and `copy/*.md` for the text. Never
hand-edit anything in `out/` — `build.mjs` deletes that directory on every run.

`verify.mjs` is the gate. It checks pixel dimensions, that no copy sits under
platform UI, that no two placements are secretly the same image, that no price
contradicts `src/constants/hvac.ts`, and that every copy field fits inside the
limit Meta actually displays. It exits non-zero on any of them.
