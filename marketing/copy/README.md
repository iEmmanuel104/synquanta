# Ad copy

The images in `../out/` cannot be launched on their own. Meta Ads Manager asks
for **Primary text, Headline, Description and a CTA button** on every ad, and
WhatsApp needs a caption. Those live here, one file per concept, written to the
character limits below so nothing gets clipped mid-sentence in the preview.

| File | Concept | Use it for |
|---|---|---|
| `what-we-build.md` | The software your business actually runs on | Cold audiences. Says what we are. |
| `how-we-work.md` | You see it every week. No black box. | Warm / retargeting. Answers the objection. |
| `hard-part.md` | Bring us the hard part | Direct response. Asks for the enquiry. |

## Character limits

Verified 2026-08. Meta accepts far more than it *shows* — the numbers that
matter are the visible ones, because everything past them collapses behind
"See more" and is read by almost nobody.

| Field | Accepts | Visible | Write to |
|---|---|---|---|
| Primary text | 500 | 125 | **≤125** |
| Headline | 255 | 40, collapsing to 27 on small phones | **≤27** |
| Description | — | 30 | **≤30** |
| Carousel card headline | — | 45 | ≤45 |
| Carousel card description | — | 18 | ≤18 |

Stories and Reels ads show **no primary text at all** — only the image and the
CTA button. That is why every 9:16 creative has to carry the whole message in
the picture, and why `story.png` drops the numbered list: on that placement the
image is the entire ad.

## CTA buttons

Pick from Meta's fixed list. Ours:

- **Learn More** — awareness concepts (`what-we-build`, `how-we-work`)
- **Contact Us** — direct response (`hard-part`)

Do not use *Get Quote*. It sets an expectation of an instant number, and the
site's own line is that a price comes after a written plan, not before it.

## Tracking

There is no UTM convention in the repo yet, so this sets one. PostHog is live on
the site and captures `utm_*` automatically, so a campaign tagged this way is
attributable without any further instrumentation.

```
?utm_source=<facebook|instagram|whatsapp>
&utm_medium=paid_social      (use `status` for organic WhatsApp)
&utm_campaign=<concept-key>
&utm_content=<placement-key>
```

Example, the Reels ad for the direct-response concept:

```
https://synquanta.com/contact?utm_source=instagram&utm_medium=paid_social&utm_campaign=hard-part&utm_content=story
```

Keep `utm_campaign` identical to the concept folder name in `../out/`. That is
the only thing joining spend in Ads Manager to sessions in PostHog.

## Rules

The same guardrails as the creative, in `../README.md`: copy comes from the live
site, **no timeline claims**, no client names, and no price that does not match
`src/constants/hvac.ts`. A headline invented for an ad becomes a promise
somebody has to keep on a sales call.
