# ERP campaign — scripts + storyboard (Step 2)

**Status: DRAFT, awaiting founder approval.** No voice or credit spend until it is approved.

Brief: [`RESEARCH.md`](RESEARCH.md).
- **Audience:** owners and operators of growing businesses, worldwide, English first.
- **Offer / CTA:** "Book a free process review: synquanta.com". This is a 30-minute call where we map the workflow and show where an ERP fits. The landing page is the existing contact form, which has the "A custom ERP system" option.
- **Voice:** calm and warm, neutral international accent, about 140 words per minute, with unhurried pauses.

**Claims guardrail:**
- Every capability must come from the shipped site copy (`src/constants/services.ts`: "Inventory, finance, HR, procurement and reporting in one system, built around how your business actually works").
- No client names, no invented metrics, no prices.
- Examples are generic industries. The property example mirrors our EstateOS work without naming it or any client.

---

## 1. Master explainer: ~75s (16:9 + 9:16)

| # | Time | Voiceover | On-screen text (burned in) | Visual | Source |
|---|---|---|---|---|---|
| 1 | 0–4s | Most businesses don't run on a system. They run on a dozen spreadsheets… and someone's memory. | **A dozen spreadsheets. And someone's memory.** | Frame 1 is already moving: spreadsheet tiles, sticky notes and chat bubbles pile up around a small illustrated owner at a desk. | HTML/SVG |
| 2 | 4–14s | Sales lives in WhatsApp. Invoices in email. Stock in a sheet nobody trusts. And every follow-up depends on someone remembering. | Sales → chats · Invoices → email · Stock → ? | Four disconnected islands drift apart. A dotted line between "Quote sent" and "Follow up" fades out. A small red "overdue" tag blinks once. | HTML/SVG over **H1** (textless paper-storm texture) |
| 3 | 14–24s | An ERP, enterprise resource planning, is one system that connects all of it. Sales, stock, finance, people and reporting, working from the same information. | **ERP = one connected system** | The islands glide inward and snap onto one calm hub (the Orbit Atom motif as the centre). Five labelled nodes light up in sequence. | **H2** transition (chaos settling) → HTML/SVG |
| 4 | 24–36s | Picture your business as a pipeline. A lead becomes a sale. The sale becomes a delivery, an invoice, a line in your books. When every step is connected, nothing falls through the gaps. | Lead → Sale → Delivery → Invoice → Books | A horizontal pipeline draws itself left to right. A single "order" token travels the whole line. Each stage ticks green. | HTML/SVG |
| 5 | 36–50s | At SynQuanta, we start by mapping how your business actually works. Then we design the workflow, build the system around it, not the other way round, and train your team to run it. | **Map → Design → Build → Train** | Four steps as cards. In "Map", a hand sketches boxes. "Design" tidies them into a flow. "Build" turns it into a clean dashboard frame. "Train" shows three people at screens. | HTML/SVG |
| 6 | 50–66s | A distributor sees stock move from warehouse to invoice, as it happens. A services firm never loses a follow-up, or an unpaid bill. A property developer tracks every unit, from first enquiry to final payment. | Distribution · Services · Real estate | Three quick vignettes, each the same pipeline re-skinned: boxes and trucks; a client card with a "reminder sent ✓"; a building with units turning from "Enquiry" to "Paid". | HTML/SVG |
| 7 | 66–75s | One system, built around how you work. Book a free process review at synquanta.com. | **Book a free process review** · synquanta.com | Everything settles into the hub, and the Orbit Atom logo resolves. The CTA and URL hold for 3s or more. | HTML/SVG over **H3** (soft ambient office, textless) |

About 175 words, which is about 75s at a calm pace with pauses.

---

## 2. Consideration cut: 30s (9:16 + 4:5), warm audiences

| Time | Voiceover | On-screen |
|---|---|---|
| 0–3s | Still running your business on spreadsheets and memory? | **Spreadsheets + memory ≠ a system** |
| 3–12s | An ERP connects sales, stock, finance and people in one system, so a lead becomes a sale, an invoice, and a line in your books, with nothing lost in between. | Lead → Sale → Invoice → Books |
| 12–24s | SynQuanta maps how your business actually works, then builds the system around it, and trains your team to run it. | Map → Design → Build → Train |
| 24–30s | Book a free process review at synquanta.com. | **Book a free process review** · synquanta.com |

About 70 words. The visuals reuse scenes 1, 4, 5 and 7.

---

## 3. Cold ads A–D: 15s each (9:16 + 4:5), prospecting

Each ad is a **different concept** for Andromeda's creative-diversity ranking, not a re-cut of the same story. All four share the same end card (2.5s).

**A — Chaos (owner pain)**
> VO: A dozen spreadsheets. Three chat groups. And one person who remembers everything. That's not a system. SynQuanta builds you one. Free process review at synquanta.com.
> Visual: the pile-up from scene 1 snaps into the hub.

**B — Lost money (finance pain)**
> VO: The invoice went out. The follow-up didn't. Multiply that by a year. A connected system chases it for you. Book a free process review: synquanta.com.
> Visual: a single invoice slides off-screen into a gap between two tools, and coins trickle after it. The gap then closes with a connector and a "Paid ✓" stamp.

**C — "What is an ERP?" (education)**
> VO: What's an ERP? One system where your sales, stock, finance and people share the same information. SynQuanta builds it around how you work. Free process review: synquanta.com.
> Visual: a giant "ERP?" splits into five nodes that join into the hub.

**D — Industry flip (persona)**
> VO: Distribution. Services. Real estate. Different businesses, same problem: work that falls through the gaps. We map yours and build the system. Free process review: synquanta.com.
> Visual: the same pipeline re-skinned three times in quick 2s cuts.

Each script is about 30–35 words.

---

## 4. Style frame spec

- **Look:** flat, rounded vector illustration with soft shadows, lots of air and no gradients on characters. It follows the house style of `public/illustrations/custom-erp.svg`.
- **Palette** (`marketing/lib/brand.mjs`):
  - backgrounds `offWhite #F8FAF9` / `creamGreen #D8F3DC`;
  - structure `forestDeep #1B4332` / `forestPrimary #2D6A4F`;
  - accents `sageLight #52B788` / `mintPale #95D5B2`;
  - a single warm "problem" accent, used only in mess scenes (a muted coral for overdue tags).
- **Type:** Clash Display for headlines and Inter for captions. Captions are at most 2 lines and at least 48px on 1080w.
- **Motion:** ease-in-out at 400–700ms, a gentle parallax drift and one idea per beat. Mess scenes jitter slightly; order scenes are still and aligned. The contrast between the two *is* the message.
- **Higgsfield shots H1–H3:** these are texture and atmosphere only, with **no text, UI or faces in focus**. They sit behind the HTML layers at about 40–60% opacity.
- **Audio:** an ambient piano or pad bed at −24 to −20 LUFS under the voiceover, with a −14 LUFS integrated master.

## 5. Production notes

- Build the scenes once at 1920×1080 and 1080×1920 layouts (4:5 is reflowed from 9:16). The cold ads and the 30s cut are assembled from the same scene library.
- 9:16 safe zone: 270px top, 670px bottom, 65px sides. The CTA and captions stay inside it.
- The voiceover is rendered line by line, so scene durations can snap to the real audio lengths.

## 6. Generation provider: fal.ai (decided 2026-11-13)

- Use **fal.ai pay-per-use** for both the Higgsfield-style texture shots (Veo 3.1, Kling or Seedance on fal) and the voiceover (ElevenLabs TTS models on fal). This replaces separate Higgsfield and ElevenLabs subscriptions.
- The key is the Umbrelar `FAL_KEY` on Railway (`umbrelar-api` / `umbrelar-worker`). Read it at run time with `railway variables -s umbrelar-api --kv` from `~/Desktop/Projects/marketingapp`. **Never write it into this repo**, which has a public deployment remote.
- Spend checkpoint: post a per-shot cost estimate before generating.
