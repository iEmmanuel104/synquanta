# ERP campaign — ad copy (Meta + LinkedIn)

The videos are in `marketing/out/erp-promo/`. The scripts and the reasoning are in `marketing/erp/`.

House rules (from `erp/SCRIPT.md`):
- Plain words. Say "one system for your business"; "ERP" comes second, never first.
- No promises the website doesn't make. Avoid "automatic", "real-time" and "never miss".
- The CTA is always **go to the website**: tell us about your business, or book a session. Never "call us" and no time length (changed 2026-11-13).

**Landing URL** (the `/erp` page: questionnaire + book-a-session, built 2026-11-13, live once deployed):
`https://www.synquanta.com/erp?utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign=erp_launch&utm_content=<ad>`

The UTM tags are kept for the whole visit and written into every enquiry email ("Source: …"), so each enquiry says which ad brought it. Add `&path=book` to open the booking form first (warm ads only).

**Meta CTA button:** `Learn More` for cold ads, `Contact Us` for warm ads.

---

## Cold ads (awareness): 15s, files `adX-916.mp4` (Reels/Stories) + `adX-45.mp4` (Feed)

### A — Memory · `utm_content=adA`
- **Primary text:** Spreadsheets, chat groups, and one person who remembers everything. That works until your business grows. We build one system around how your business actually runs. Tell us about your business at synquanta.com.
- **Headline:** One system for your whole business
- **Description:** Tell us about your business

### B — See your money · `utm_content=adB`
- **Primary text:** Invoices in one place. Expenses in another. Reports that take hours. SynQuanta builds one system that brings your business information together, so you can see the full picture.
- **Headline:** See your whole business in one place
- **Description:** Tell us about your business

### C — Imagine · `utm_content=adC`
- **Primary text:** What if your sales, stock, money and staff all lived in one system? That's what an ERP is. SynQuanta builds yours around the way you already work.
- **Headline:** One system. Built around you.
- **Description:** Custom business systems (ERP)

### D — Different businesses (wave 2) · `utm_content=adD`
- **Primary text:** Warehouses, service companies, property businesses: different work, same problem. Information everywhere. We learn how your business runs and build one system around it.
- **Headline:** Built for how you work
- **Description:** Tell us about your business

### E — Built for you, not generic · `utm_content=adE`
- **Primary text:** Your business has its own way of working. Why squeeze it into software that wasn't built for you? SynQuanta designs and builds business systems around your process.
- **Headline:** Your business isn't generic
- **Description:** Custom business systems (ERP)

---

## Warm audiences (consideration): `consider-916.mp4` / `consider-45.mp4` (30s), `master-916.mp4` (~79s)
- **Primary text:** Your business grew. Did your system? We learn how your business runs, then plan, build and launch one system around it, and help your team get started. Tell us how your business runs, or book a session with our team.
- **Headline:** Tell us about your business
- **CTA:** Contact Us
- **Link:** add `&path=book`
- **Audiences:**
  - people who watched 25% or more of any cold ad;
  - website visitors (last 30 days);
  - IG/FB engagers (last 60 days).

## Website, YouTube, LinkedIn: `master-169.mp4` (16:9)

**LinkedIn post / video ad:**
> Most growing businesses don't run on one system. They run on spreadsheets, chat groups, emails and separate apps, and nobody sees the full picture.
>
> We build custom business systems (ERPs) around the way each business actually works: sales, stock, money, staff and reports in one place. We learn how you run, then plan, build and launch it with your team.
>
> If that sounds like your business, tell us about your business at synquanta.com/erp

**YouTube title:** What is an ERP? One system for your whole business | SynQuanta

---

## Test plan (from `erp/RESEARCH.md`)

**Setup**
- **Wave 1:** one Advantage+ campaign, Leads objective (the Meta `Lead` event already fires on a successful form submit). One ad set with **A, B, C, E** as separate ads, broad targeting, country breakdown on.
- **Starter budget:** about $20–30/day for 7 days before judging. Leave the ads alone for the first 3–4 days so Meta can finish learning.
- **Countries, first read:** NG, GH, KE, ZA, GB, AE, US, CA. Reporting is split by country. Cut a country after 7 days only if it produced no enquiries *and* has a poor CTR.

**Day 7 read**
- **Hook rate** (3s plays ÷ impressions): Reels 30% or more is fine. Below 25%, rework the first 3s.
- **Hold rate** (15s plays ÷ 3s plays) and **CTR**.
- **Cost per enquiry and lead quality.** These are the real scorecard.

**After the read**
- Promote the winning cold concept. Add D, plus a variant of the winner with a new first line.
- Turn on the warm retargeting campaign once there are 1,000 or more 25%-viewers.
