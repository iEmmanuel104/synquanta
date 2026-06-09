# SEO & Analytics — SynQuanta Website

What's wired in, and the few manual steps that must be done in external dashboards.

## What's automated (in the codebase)

- **`public/robots.txt`** — allows all crawlers, points to the sitemap.
- **`public/sitemap.xml`** — the 6 routes. **Maintenance:** when you add a route in `src/App.tsx`, add a matching `<url>` here and bump its `<lastmod>`.
- **Per-page meta** — `src/components/Seo.tsx` (react-helmet-async) sets a unique `<title>`, `description`, `canonical`, and Open Graph/Twitter tags per route. Each page renders `<Seo path="/x" title=… description=… />`.
  - The static `og:`/`twitter:` block in `index.html` is the **homepage social-card fallback** for non-JS scrapers (LinkedIn/WhatsApp). Sub-pages share the homepage card on those platforms — Google renders JS so it reads the correct per-page tags. (To make sub-page social cards exact, add build-time prerendering later — currently out of scope.)
- **Structured data** — `Organization` + `WebSite` JSON-LD is static in `index.html`. (`sameAs` is empty — add social profile URLs when they exist.)
- **Analytics** — PostHog, **cookieless** (`persistence: 'memory'` in `src/lib/posthog.ts`), so **no consent banner is required**. SPA `$pageview` is captured on every route change in `src/App.tsx`.

## Manual step 1 — Vercel env vars — ✅ DONE

Already set on the `synquanta` Vercel project for **Production** and **Development**:

```
VITE_PUBLIC_POSTHOG_KEY  = phc_wRmyBvotzLRbce2dRTanYboUeArGGXM8w3qwdTCY4Qfk   (public client key)
VITE_PUBLIC_POSTHOG_HOST = https://us.i.posthog.com
```

Preview is intentionally left unset so PR-preview traffic doesn't pollute the production PostHog project. The vars take effect on the **next build/deploy**.

The PostHog project is "Default project" (id 415405) in org *Synquanta technologies* — it had zero prior events, so the website now owns it. Rename it to **"SynQuanta Website"** in PostHog → Settings if you like.

Local dev already works via the gitignored `website/.env` (see `.env.example`).

## Manual step 2 — Google Search Console (required for indexing)

1. Go to [search.google.com/search-console](https://search.google.com/search-console) and add a **Domain** property: `synquanta.com`.
2. Verify via **DNS TXT** — add the TXT record Google gives you to the domain's DNS (in your registrar or Vercel DNS). Domain verification covers all subdomains; better than a meta tag.
3. **Sitemaps** → submit `https://synquanta.com/sitemap.xml`.
4. **URL Inspection** → test each of the 6 routes → *Request indexing*.
5. Coverage/Indexing reports populate over the following days.

Optional, also free: [Bing Webmaster Tools](https://www.bing.com/webmasters) — import directly from Search Console.

## How to verify after deploy

- `https://synquanta.com/robots.txt` and `/sitemap.xml` load.
- View a sub-page (e.g. `/products`), inspect `<head>`: one `canonical`, one `description`, both route-specific.
- [Google Rich Results Test](https://search.google.com/test/rich-results) on the homepage → Organization + WebSite detected.
- PostHog → **Activity / Web Analytics** shows live pageviews with country + referrer.
- Lighthouse → SEO score (target 100).
