# ERP campaign: which video goes where

All files are in `marketing/out/erp-promo/`. The ad text for each one is in `marketing/copy/erp.md`.

## The short answer

**Start with these 4 ads on Instagram and Facebook:**

| Ad | What it says | File for Reels and Stories | File for the Feed |
|---|---|---|---|
| A | "Your business shouldn't depend on one person's memory" | `adA-916.mp4` | `adA-45.mp4` |
| B | "How much of your business can you actually see?" | `adB-916.mp4` | `adB-45.mp4` |
| C | "What if your whole business ran on one system?" | `adC-916.mp4` | `adC-45.mp4` |
| E | "Your business isn't generic" | `adE-916.mp4` | `adE-45.mp4` |

When you create **one ad** in Meta Ads Manager, upload **both** files for that ad. Meta then shows the tall version in Reels and Stories and the 4:5 version in the Feed.

**Hold back for later:**

| File | When to use it |
|---|---|
| `adD-916.mp4` / `adD-45.mp4` | Week 2, as a fresh ad once you can see which of A, B, C and E works best. |
| `consider-916.mp4` / `consider-45.mp4` (30s) | Retargeting only: people who already watched a cold ad or visited the site. |
| `master-169.mp4` (79s, landscape) | Website, YouTube, LinkedIn. Not a cold Instagram ad: too long for strangers. |
| `master-916.mp4` (79s, tall) | Instagram/Facebook retargeting and a pinned Reel on the page. |

## What the file names mean

- **916** = tall 9:16. Use it for Reels, Stories and TikTok.
- **45** = 4:5. Use it for the Instagram and Facebook Feed.
- **169** = wide 16:9. Use it for YouTube, LinkedIn and the website.

## Where every ad sends people

Every ad links to **synquanta.com/erp**, using the tracked link in `copy/erp.md`. On that page, people choose one of two paths:

1. **Tell us about your business.** Five short steps, mostly taps, about 2 minutes. We learn:
   - the type of business, team size and country;
   - what they use today and what isn't working;
   - their timing and budget.
2. **Book a session.** A short form: who they are, what the business is, and when suits them. We confirm the time by email.

Every answer arrives in the enquiry email and is saved in our database. The email ends with a "Source" line naming the ad they came from. Our team replies by email within one working day, and the session follows from that.

Nobody is asked to phone us. No call length is promised.

## How the videos were made

- **The animation is ours, not AI.** Every scene is drawn in code in our brand colours (`tools/stage.js`) and rendered frame by frame. That keeps text sharp, spelling right and the look on-brand. AI video tools often mangle text.
- **AI made the voice and the music.** The voice is ElevenLabs ("George"). The music is ElevenLabs Music. Both were generated through fal.ai.
- **The real screens** (2–3 seconds) are EstateOS designs, labelled "Designed by SynQuanta", with demo data only.
- **To change a line:** edit `lines.json`, then run `FORCE=1 node tools/vo.mjs <id>`. This needs `FAL_KEY`, read from Railway at run time and never saved in this repo. Then re-render:
  - `node tools/build-stage.mjs`
  - `node tools/render.mjs <video> <916|45|169>`

  Each 15 seconds of video takes about 20 seconds to render.

## Before spending money

1. Deploy the website so `/erp` is live (`sq deploy website`).
2. Send one test enquiry on each path. Check that the email arrives with the answers and the Source line.
3. Show the 30-second cut to 3–5 business owners who don't know the word "ERP". Ask them what we do.
4. Then follow the test plan in `copy/erp.md`: about $20–30 a day, leave it alone for 7 days, then read the results.
