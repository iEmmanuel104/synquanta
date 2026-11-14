# SynQuanta on Umbrelar: video library, brand brief, idea bank

This is the handoff for the Umbrelar app (`~/Desktop/Projects/marketingapp`) to post on SynQuanta's connected
Facebook Page and Instagram account.

- **Part 1:** the finished videos, ready to upload today.
- **Part 2:** the brand profile that Umbrelar's auto-post generator should write from.
- **Part 3:** 30 new video ideas to keep the feed going.

Paid ads are covered separately, in `erp/GUIDE.md` and `copy/erp.md`. This file is **organic posting only**.

## House rules (apply to every post)

1. **Language.**
   - Use plain words: "one system for your whole business".
   - "ERP" comes second, never first.
   - No jargon: no "synergy", "leverage" or "digital transformation".
2. **Claims.**
   - Never use "automatic", "real-time", "never miss" or "guaranteed".
   - No invented numbers, client names, prices or delivery dates.
3. **Call to action.**
   - The CTA is always the website: *Tell us about your business at synquanta.com/erp*, or *book a session* there.
   - Never "call us", and never promise how long a session lasts.
4. **Link.** Use the organic link, so enquiries show they came from social:
   `https://www.synquanta.com/erp?utm_source=umbrelar&utm_medium=organic_social&utm_campaign=erp_organic&utm_content=<post-id>`
   (on Instagram, the link goes in the bio and the caption says "link in bio").
5. **Real screens.**
   - The EstateOS screens are labelled "Designed by SynQuanta" and use demo data only.
   - Never show a real client's data.

---

## Part 1: The finished videos (upload as `upload` posts, review gate ON)

Files are in `marketing/out/erp-promo/`. For Reels/Stories post the `-916` file; for a Feed post use the `-45` file.

| # | File | Length | Post as | Caption (first line is the hook) |
|---|---|---|---|---|
| 1 | `master-916.mp4` | 77s | Reel, **pin to profile** | What is an ERP? One system for your whole business, explained in plain words. Sales, stock, money, staff and reports in one place, built around how you already work. Tell us about your business: link in bio. |
| 2 | `adA-916.mp4` | 15s | Reel | Your business shouldn't depend on one person's memory. We build one system around how your business actually runs. Link in bio. |
| 3 | `adB-916.mp4` | 15s | Reel | How much of your business can you actually see right now? Invoices here, expenses there, reports that take hours. Let's bring it into one place. Link in bio. |
| 4 | `adC-916.mp4` | 15s | Reel | What if your sales, stock, money and staff all lived in one system? That's an ERP, and we build yours around the way you work. Link in bio. |
| 5 | `adE-916.mp4` | 15s | Reel | Your business isn't generic. Why squeeze it into software that wasn't built for you? Link in bio. |
| 6 | `adD-916.mp4` | 15s | Reel | Warehouses, service firms, property businesses: different work, same problem. Information everywhere. Link in bio. |
| 7 | `consider-45.mp4` | 30s | Feed post | Your business grew. Did your system? We learn how you run, then plan, build and launch one system with your team. Tell us about your business: link in bio. |

**Order and cadence.**
- Post #1 first and pin it.
- Then post #2–#7 at one every 2–3 days, mixed with the new ideas below.
- Re-post the best performer after 4–6 weeks with a new first line.

**Hashtags (3–5 max, end of caption):**
- Core set: `#SmallBusiness #BusinessOwner #ERP #BusinessSystems #SynQuanta`.
- Add a country tag only when you post for that market, e.g. `#NigerianBusiness`.

**Video settings already done in the files:**
- captions are burned in (works with sound off);
- the 9:16 safe zones are respected;
- audio is about −14 LUFS.

So Umbrelar should **not** add another caption overlay or re-crop these.

### Batch 1 of the organic series (rendered 2026-11-14)

- **Files:** `marketing/out/social/`. Use `sN-916.mp4` for Reels and `sN-45.mp4` for the Feed.
- **Sound and captions:** same voice, music and burned-in captions as the ads.
- **To edit a line:**
  1. Change it in `erp/lines.json`.
  2. Run `FORCE=1 node erp/tools/vo.mjs sN`.
  3. Run `node erp/tools/build-stage.mjs`.
  4. Run `node erp/tools/render.mjs sN 916|45`.

**Captions** (`utm_content` = the file id):

| # | Idea | Length | Caption |
|---|---|---|---|
| s1 | A3 Five spreadsheets | 19s | Spreadsheets aren't the problem. Five of them are. When every team keeps its own file, nobody agrees on the numbers. In one system, everyone works from the same ones. Tell us about your business: link in bio. |
| s2 | B3 Stock that doesn't match | 18s | System says 40. Shelf says 12. 📦 When sales and stock live in different places, the numbers drift apart. In one system, every sale updates your stock. Link in bio. |
| s3 | C1 A distributor's day | 18s | A distributor's day, in one system: order in, stock set aside, delivery out, invoice sent, paid. Everyone sees the same order from start to finish. Link in bio. |
| s4 | D1 What happens next | 21s | You told us about your business. What happens next? A real person on our team reads every answer, we reply by email within one working day, then we plan the first step together. Link in bio. |
| s5 | E1 5 signs | 27s | 5 signs you've outgrown spreadsheets. How many sound familiar? Tell us in the comments 👇 Then tell us about your business: link in bio. |
| s6 | B1 The key person is away | 21s | What happens when the one person who knows everything is away? When your business knowledge lives in one system, not one person, work keeps moving. Link in bio. |

**Posting order:** s5 → s2 → s4 → s1 → s3 → s6, interleaved with the Part 1 ads.

---

## Part 2: Brand profile for Umbrelar's auto-post generator

Paste this into SynQuanta's business profile in Umbrelar, so the posts it generates sound like us.

- **Business:** SynQuanta Technologies. We design and build custom business systems (ERPs) and software for growing
  businesses.
- **Who we talk to:**
  - Owners and managers of small and mid-size businesses: distribution, retail, manufacturing, services, property,
    logistics, healthcare, education, hospitality.
  - Main markets: Nigeria, UK, US, UAE, Ghana, Kenya, South Africa, Canada.
- **What we offer:**
  - One system for sales, stock, money, staff, projects and reports, built around how the business already works.
  - Process: we learn how you work, plan it with you, build it, launch it and help your team get started.
- **Tone:** calm, clear, warm and confident. Short sentences. Talk to one owner, not "enterprises". Show the problem
  they recognise, then the relief.
- **Look:**
  - Colours: forest green / mint / cream (Orbit Atom brand kit, `public/brand-kit/`).
  - Style: clean flat illustration and simple diagrams.
  - Avoid: stock photos of handshakes, robots and code on screens.
- **Always:**
  - CTA = synquanta.com/erp (link in bio).
  - Plain words.
  - One idea per post.
- **Never:**
  - Prices, numbers we have not measured, client names, "automatic / real-time / guaranteed".
  - Asking people to call.

**Suggested Umbrelar auto-post settings:**

| Setting | Value |
|---|---|
| `postsPerDay` | 1 |
| `timeWindows` | 07:00–09:00 and 17:00–19:00 UTC (morning and evening in Lagos/London) |
| `reviewGate` | **ON** (nothing posts without a human tap) |
| `carouselImages` | 3 (carousels suit the checklist ideas below) |

---

## Part 3: Idea bank (30 videos)

**Pipeline:**
- **S** = our stage pipeline (`erp/tools`; text-heavy, diagrams, exact wording; best quality).
- **U** = Umbrelar's video generator (scene-based; fine for simple visual stories and less text).

**Lengths:** 15–30s Reels unless marked.

### A. Plain-language explainers ("what is…")

| # | Title | Hook (first 2 seconds, on screen) | Beats | Pipe |
|---|---|---|---|---|
| A1 | ERP in 15 seconds | "ERP, explained in 15 seconds." | Scattered tools → one hub → 6 modules light up → CTA | S |
| A2 | ERP vs accounting software | "Is accounting software an ERP?" | Accounting = money only → ERP = money + stock + sales + staff together | S |
| A3 | ERP vs spreadsheets | "Spreadsheets aren't the problem. Five of them are." | 5 files, 5 versions → one record everyone sees | S |
| A4 | Off-the-shelf vs built for you | "Should you buy software or build it?" | Off-the-shelf: you change for it. Built: it fits you. When each makes sense | S |
| A5 | What's a "module"? | "Your business already has modules. You just call them departments." | Sales, stock, money, staff → each becomes a part of one system | S |
| A6 | What "one source of truth" means | "Which number is the real one?" | Three people, three different totals → one shared number | S |

### B. "Sound familiar?" pain posts

| # | Title | Hook | Beats | Pipe |
|---|---|---|---|---|
| B1 | The one-person bottleneck | "What happens when she goes on leave?" | Everyone asks one person → knowledge in a system instead | U/S |
| B2 | The Monday report | "Why does the weekly report take all of Monday?" | Copying from 4 places → report from one place | S |
| B3 | Stock that doesn't match | "System says 40. Shelf says 12." | Sales and stock not linked → linked | S |
| B4 | "Did they pay?" | "Invoice sent. Paid? Nobody's sure." | Invoices, payments and follow-ups in one view | S |
| B5 | Typed twice | "How many times does your team type the same order?" | Order → WhatsApp → spreadsheet → invoice → one entry | S |
| B6 | The chat group database | "Your WhatsApp group is not a database." | Scrolling for an order from last month → search in one system | U/S |
| B7 | Growth breaks the system | "It worked at 5 staff. It's breaking at 25." | What changes as you grow → when it's time for one system | S |

### C. Industry vignettes (one business, one day)

Use these to warm up each market.

| # | Title | Hook | Beats | Pipe |
|---|---|---|---|---|
| C1 | Distributor | "A distributor's day, in one system." | Order in → stock reserved → delivery → invoice → paid | S |
| C2 | Retail with branches | "Three shops. One view." | Branch stock and sales side by side | S |
| C3 | Manufacturer | "From raw material to sold product." | Materials → production → finished stock → sale | S |
| C4 | Service company | "Every job, every client, every invoice." | Job booked → staff assigned → done → billed | S |
| C5 | Property business (EstateOS) | "How we organised a property sales pipeline." | Real EstateOS screens, "Designed by SynQuanta", demo data | S |
| C6 | Clinic / school | "Records, schedules and fees in one place." | Pick one per post; plain flow | S |

### D. How we work (trust builders)

| # | Title | Hook | Beats | Pipe |
|---|---|---|---|---|
| D1 | What happens after you fill the form | "You told us about your business. Now what?" | We read it → reply by email → session → plan | S |
| D2 | The first session | "What we ask in the first session." | 4 questions on screen: who does what, where info lives, what breaks, what first | S |
| D3 | Start with one part | "You don't have to build everything at once." | Start with the part that hurts most, add the rest later | S |
| D4 | Your team stays involved | "You see it before it's finished." | Learn → Plan → Build (regular check-ins) → Launch + training | S |
| D5 | Behind the build | "From whiteboard to working screen." | Sketch → design → working screen (EstateOS or our own work, demo data) | S |

### E. Checklists and myths

These also work as 3-image carousels.

| # | Title | Hook | Beats | Pipe |
|---|---|---|---|---|
| E1 | 5 signs you've outgrown spreadsheets | "5 signs you've outgrown spreadsheets." | One sign per beat → CTA | S / carousel |
| E2 | Prepare before building a system | "Before you build any system, write down these 3 things." | Your steps, your people, your must-haves | S / carousel |
| E3 | Myth: "ERP is for big companies" | "ERP is only for big companies. True?" | No: it's for any business with more than one moving part | S |
| E4 | Myth: "We'll have to change how we work" | "Will a new system change how we work?" | We build around how you already work | S |
| E5 | Questions to ask any software builder | "Ask these before you hire anyone to build your system." | Who owns it, how you're involved, what happens after launch | S / carousel |
| E6 | One question for owners (engagement) | "How many apps does your business run on? Comment the number." | Simple question card, no hard sell | U |

### Suggested weekly rhythm (once Part 1 is used up)

| Day | Pillar |
|---|---|
| Mon | B (pain) |
| Wed | A or E (explainer / checklist) |
| Fri | C or D (industry / how we work) |
| + | Umbrelar auto-post fills the other days with on-brand still posts from the Part 2 profile |

**Production batch.**
- Render 6 at a time through the stage pipeline: one per pillar plus one spare, as 9:16 and 4:5.
- Measure after 2 weeks: saves, shares, profile visits and link clicks.
- Make more of the best pillar.
- Anything that does well organically becomes a paid test in `copy/erp.md`.
