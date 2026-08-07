# SEO & Analytics — SynQuanta Website

What's automated in the codebase, and the few manual steps that live in external dashboards. Primary domain: **`https://www.synquanta.com`** (apex 307-redirects to www).

## What's automated (in the codebase)

- **`public/robots.txt`** — allows all crawlers, points to the sitemap.
- **`public/sitemap.xml`** — the 10 routes, `www`, with honest `lastmod` (no `priority`/`changefreq` — Google ignores them). **Maintenance:** add a `<url>` when you add a route.
- **Per-page meta** — `src/components/Seo.tsx` (react-helmet-async): unique `<title>`, description, canonical, OG/Twitter per route. The static `og:`/`twitter:` block + Organization/WebSite graph in `index.html` are the homepage social-card + entity fallback for non-JS scrapers.
- **Structured data (JSON-LD):**
  - Static in `index.html`: **Organization** (with `contactPoint`, `sameAs` ready/empty) + **WebSite**.
  - Per-page via `src/lib/structuredData.ts` → `<Seo jsonLd={…}/>`: **BreadcrumbList** on every inner page; **FAQPage** (/faq, /hvac), **Service ItemList** (/services), **CreativeWork ItemList** (/portfolio), **Service + Offer** (/hvac).
- **Real 404** — `src/pages/NotFoundPage.tsx` with `noindex,follow` (replaced the old soft-404 redirect to `/`).
- **PWA manifest** — `public/site.webmanifest`, linked in `index.html`.
- **Analytics** — PostHog, cookieless (no consent banner), SPA `$pageview` per route.
- **IndexNow** — `scripts/indexnow.mjs` + key file `public/92c0eb543a99c29c906522d60f53c711.txt`. Pings Bing/Yandex/DuckDuckGo (which feed ChatGPT/Copilot). Runs automatically via `npm run deploy`.

## Deploy

```bash
npm run deploy   # = vercel --prod && npm run indexnow
```
This builds+deploys to production (Vercel env vars already set: Production + Development) and pings IndexNow. Pushing to git is for source backup; production ships via this CLI command.

---

## Manual steps (one-time, no API — dashboards only)

### 1. Google Search Console (Domain property `synquanta.com` already verified ✅)
1. **Submit sitemap:** [Search Console](https://search.google.com/search-console) → pick `synquanta.com` → **Indexing → Sitemaps** → type `sitemap.xml` → **Submit**. Expect "Success", 6 URLs discovered.
2. **Request indexing (×6):** top **URL Inspection** bar → paste each full URL (`https://www.synquanta.com/`, `/services`, `/products`, `/portfolio`, `/faq`, `/contact`) → if "URL is not on Google" → **Request Indexing** (live test ~30–60s). ~10 requests/day; 6 is fine. Re-requesting the same URL doesn't speed it up.
3. **Monitor:** **Indexing → Pages** (watch "Crawled – currently not indexed" / "Discovered – not indexed"; usually resolves for new sites). **Experience → Core Web Vitals** (field data accrues ~28 days). **Settings → Crawl stats**.
4. **International targeting:** leave default — you're globally available, no hreflang needed.
5. **Timeline:** discovery hours→days; first indexing days→~2 weeks; full settling 2–6 weeks for a young domain.

### 2. Bing Webmaster Tools (powers ChatGPT/Copilot)
[bing.com/webmasters](https://www.bing.com/webmasters) → **Import** → sign in with Google → **Allow** → select `synquanta.com` → **Import**. Ownership + sitemap transfer automatically; data within ~48h.

### 3. Validate
- [Rich Results Test](https://search.google.com/test/rich-results) on `https://www.synquanta.com/faq` and `/services` → Organization + BreadcrumbList (+ FAQPage) detected, 0 errors.
- [opengraph.xyz](https://www.opengraph.xyz/) for social cards (sub-pages share the homepage card until prerendering ships — see below).

---

## 2026-06-23 — Brand-entity repair (DO THESE after deploy)

**Why:** Live Google checks showed the brand looked unprofessional and off-message:
- `synquanta` → *"Did you mean: cinquanta"* (a perfume/wine); only our **homepage** indexed (no sitelinks); page 1 polluted with the Apple App Store apps, a parked `synquanta.net`, the unrelated `synquanta.tech`, and the unrelated `@synquantalabs` restaurant brand.
- `synquanta technologies` → AI Overview said *"best known as the developer of **Uplivon** … and **IQBotix**"* and confused us with **Syngenta** (agri-giant).
- SERP title/description were **stale** (pre-2026-06-09 copy) — Google simply hadn't re-crawled.

**What changed in code (this pass):**
- **Removed** the `MobileApplication` (IQBotix, Uplivon) nodes and the Apple-developer `sameAs` from `index.html` — these were the direct cause of the "Uplivon developer" AI description.
- **Strengthened** the Organization schema (`alternateName`, `disambiguatingDescription`, `slogan`, `knowsAbout`, `areaServed`, `ProfessionalService` type).
- **Added `/about`** — a factual entity page (best on-page signal for the Knowledge Graph / AI overviews); added to nav, prerender routes, sitemap, IndexNow.
- **Fixed** the double-encoded `<title>` (`&amp;amp;`) in `entry-prerender.tsx`.
- **Refreshed** all sitemap `lastmod` to 2026-06-23 (signals freshness → re-crawl).
- **apex→www** is now a **308 permanent** redirect (`vercel.json`) instead of 307.

**Manual actions required (none of the above surfaces without these):**
1. **Google Search Console → re-submit `sitemap.xml`**, then **URL Inspection → Request Indexing** for all **7** URLs incl. the new `/about`: `/`, `/about`, `/services`, `/products`, `/portfolio`, `/faq`, `/contact`. This is what forces the stale cache to refresh — do it the day you deploy.
2. **Confirm Bing Webmaster Tools** import is done (powers ChatGPT/Copilot); re-submit sitemap if needed.
3. **Rich Results Test** on `/` and `/about` → Organization parses clean with **no `MobileApplication`** and **no Apple `sameAs`**.
4. **Establish the entity (the real cinquanta/Syngenta fix — off-page).** On-page signals help, but Google needs external corroboration to give us a distinct identity. In priority order, create and cross-link:
   - **LinkedIn company page** for *SynQuanta Technologies* (strongest single signal).
   - **Crunchbase** listing (and/or Companies House page for the Ltd).
   - **Google Business Profile** (if eligible).
   - **Wikidata** item (optional, but directly feeds the Knowledge Graph).
   As each goes live, **add its URL to the Organization `sameAs` array in `index.html`** and redeploy.
5. **Provide the X/Twitter URL** → it was selected as the one authoritative profile but no URL was given, so `sameAs` currently ships **empty**. Paste the handle and add it to `sameAs` in `index.html`.
6. **Name-collision notes (out of our control — not bugs in our site):** `synquanta.net` (parked squatter — reclaim/redirect to us if it's yours, else ignore), `synquanta.tech` (a different company), `@synquantalabs` (an unrelated restaurant-ordering brand). Don't chase these in code; a strong, distinct entity is what separates us from them over time.
7. **Expectation:** re-crawl days→~2 weeks; the AI description and cinquanta/Syngenta confusion settle over **2–6 weeks**. Apple's App Store pages keep ranking for a while regardless — we've stopped *reinforcing* them, not deleted Apple's own URLs.

---

---

## 2026-07-28 — HVAC campaign + legal pages

Four routes added: **`/hvac`** (paid-ad landing page for the AI Receptionist product) and the three
policy pages **`/terms`**, **`/privacy`**, **`/refund-policy`** — the last three are a hard
prerequisite for Paddle account verification, which requires live, publicly linked Terms, Privacy and
Refund policies.

- All four are registered in the six places (`App.tsx`, `entry-prerender.tsx` `ROUTES`,
  `sitemap.xml`, `scripts/indexnow.mjs`, `src/pages/index.ts`).
- **The legal three are in `legalLinks`** (`src/constants/navigation.ts`) and render in the footer —
  *not* in `navLinks`, so they stay out of the header.
- **`/hvac` is in neither nav list, deliberately.** It is an ad destination: reachable, prerendered
  and indexed, but not part of the site's own navigation.
- `scripts/indexnow.mjs` no longer submits `/products` — that route was deleted in `b1abf8a` and had
  been returning 404 to Bing on every deploy since.
- The `/hvac` price in the **Offer** JSON-LD, in the pricing card, and in the prose on `/terms` and
  `/refund-policy` all trace back to `src/constants/hvac.ts`. Paddle cross-checks published prices
  against the catalog — keep them in step.

**Manual, after the next deploy:** Search Console → re-submit `sitemap.xml`, then URL-inspect and
request indexing for `/hvac`, `/terms`, `/privacy` and `/refund-policy`.

---

## Prerendering — shipped ✅

The site is now prerendered at build time via **vite-prerender-plugin** (`src/entry-prerender.tsx`): each route in `ROUTES` is rendered to static HTML with its per-page `<title>`/meta/canonical/OG/Twitter/JSON-LD baked in, so non-JS scrapers (Bing/LinkedIn/Slack/WhatsApp/AI) and Google both see correct per-page content. When you add a route, add it to `ROUTES` in `entry-prerender.tsx`, the `<Route>` in `App.tsx`, `navLinks`, `sitemap.xml`, and `scripts/indexnow.mjs`.

## On "being found in Gemini / AI search"
No API forces inclusion. Google AI Overviews/Gemini draw from Google's index — covered by the structured data + sitemap + fast crawl above. ChatGPT/Copilot draw from Bing — covered by Bing import + IndexNow. There is no general Google "request indexing" API (the Indexing API is jobs/livestream only), so step 1.2 stays manual.

## Reference
- PostHog project "Default project" (id 415405), key `phc_wRmy…4Qfk` (public), cookieless. Vercel env: Production + Development.
- IndexNow key: `92c0eb543a99c29c906522d60f53c711` (file in `public/`).

## Hidden product URLs (2026-08-07)

`/hvac`, `/hvac/*` and `/refund-policy` are **307 (temporary) redirects to `/`**
in `vercel.json`.

Why they exist: those pages were prerendered, listed in `sitemap.xml` and pinged
to IndexNow, so search engines know them. When the AI Receptionist was hidden,
the SPA rewrite (`/(.*) → /index.html`) started serving the root shell at those
paths — HTTP 200, generic title, and a `noindex` that only appears after
hydration. That is a soft 404 on an indexed URL, which is worse than either a
real 404 or a redirect.

Why **307 and not 308**: these URLs come back when the product launches. A
permanent redirect tells Google to drop them for good, and we would have to earn
the indexing again. `vercel.json` cannot carry comments, which is why this note
lives here.

When the product relaunches: remove those three redirect blocks, uncomment the
`/hvac` route in `src/App.tsx` and the five other places listed in its comment,
and re-add the sitemap entries.
