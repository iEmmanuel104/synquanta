# SEO & Analytics — SynQuanta Website

What's automated in the codebase, and the few manual steps that live in external dashboards. Primary domain: **`https://www.synquanta.com`** (apex 307-redirects to www).

## What's automated (in the codebase)

- **`public/robots.txt`** — allows all crawlers, points to the sitemap.
- **`public/sitemap.xml`** — the 6 routes, `www`, with honest `lastmod` (no `priority`/`changefreq` — Google ignores them). **Maintenance:** add a `<url>` when you add a route.
- **Per-page meta** — `src/components/Seo.tsx` (react-helmet-async): unique `<title>`, description, canonical, OG/Twitter per route. The static `og:`/`twitter:` block + Organization/WebSite graph in `index.html` are the homepage social-card + entity fallback for non-JS scrapers.
- **Structured data (JSON-LD):**
  - Static in `index.html`: **Organization** (with `contactPoint`, `sameAs` ready/empty) + **WebSite**.
  - Per-page via `src/lib/structuredData.ts` → `<Seo jsonLd={…}/>`: **BreadcrumbList** on every inner page; **FAQPage** (/faq), **Service ItemList** (/services), **CreativeWork ItemList** (/portfolio), **Service ItemList** (/products).
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

## Known limitation / next phase — Prerendering (deferred)

The site is a client-rendered SPA, so **per-page** JSON-LD and OG cards are JS-injected: Google/Gemini read them on the render wave, but non-JS scrapers (LinkedIn/Slack/WhatsApp/Bing) see the homepage card + the static Organization graph for sub-pages. The fix is build-time **prerendering** (puppeteer postbuild snapshot → per-route static HTML), tracked as a separate focused pass to avoid destabilizing the Safari-tuned build. Until then, Google/AI-Overviews visibility is fully covered; only non-JS social/Bing *per-page* previews wait on Phase 2.

## On "being found in Gemini / AI search"
No API forces inclusion. Google AI Overviews/Gemini draw from Google's index — covered by the structured data + sitemap + fast crawl above. ChatGPT/Copilot draw from Bing — covered by Bing import + IndexNow. There is no general Google "request indexing" API (the Indexing API is jobs/livestream only), so step 1.2 stays manual.

## Reference
- PostHog project "Default project" (id 415405), key `phc_wRmy…4Qfk` (public), cookieless. Vercel env: Production + Development.
- IndexNow key: `92c0eb543a99c29c906522d60f53c711` (file in `public/`).
