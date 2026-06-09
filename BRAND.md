# SynQuanta — Brand Ownership & Impersonation Playbook

Goal: when anyone searches **"synquanta"**, *your* site/products dominate (ideally with a knowledge panel), and the **@synquantalabs ("SynQuanta Labs®")** impersonator is gone. The code side (prerendering, structured data, App Store entity link) is shipped — these are the **manual** steps only you can do (external accounts/registries), in priority order.

> Reality check from research: the exact term **"synquanta" is uncontested** — no competitor owns it. You're not fighting for it; you just need to (1) get **indexed**, (2) prove you're the **entity**, and (3) remove the squatter. The main confuser is **"SynQuant"** (no trailing 'a', an academic tool) — strong Organization schema (already shipped) stops Google auto-correcting you to it.

---

## 1. Finish Google indexing — THE gating step (do first)

Until indexed, you can't rank for "synquanta" at all.

1. [Google Search Console](https://search.google.com/search-console) → property `synquanta.com` → **Indexing → Sitemaps** → submit the **full URL** `https://www.synquanta.com/sitemap.xml` (the bare `sitemap.xml` fails because the apex redirects to www). Expect **Success, 6 pages**.
2. **URL Inspection** (top bar) → paste each of the 6 URLs → **Request Indexing**: `/`, `/services`, `/products`, `/portfolio`, `/faq`, `/contact`.
3. **Bing Webmaster Tools** → [bing.com/webmasters](https://www.bing.com/webmasters) → **Import** from GSC (powers ChatGPT/Copilot).
4. Timeline: indexing days→~2 weeks; full settling 2–6 weeks for a young domain.

## 2. Report the @synquantalabs impersonator

You confirmed it's **not yours** and you hold **no registered trademark** — so use the **impersonation** route (based on it posing as *you* — identity, not trademark; no registration required).

- **Before filing — verify it's truly impersonation, not a coincidental namesake.** Screenshot the profile. It's reportable if it uses **your** logo/bio, links to **synquanta.com** or your apps, or claims to *be* SynQuanta Technologies. If it's a genuinely separate operation that merely shares a similar word, a report will likely be rejected.
- ⚠️ **The ® matters:** if "SynQuanta Labs" actually holds a *registered* "SynQuanta Labs" mark and you hold none, a report can be contested and they may have rights you don't. This is the strongest reason to do step 3 (register your mark) in parallel.
- **File:** Instagram impersonation form → [help.instagram.com/contact/636276399721841](https://help.instagram.com/contact/636276399721841). You file as SynQuanta Technologies' **authorized representative** (you do NOT need to own an Instagram account). Provide: company registration, `synquanta.com`, your App Store developer listing, and the impersonating handle.
- **Removing it from Google:** you **cannot** deindex someone else's page via your Search Console. Once Instagram removes the account, the URL 404s and Google drops it. Speed that up with **Refresh Outdated Content** → [search.google.com/search-console/remove-outdated-content](https://search.google.com/search-console/remove-outdated-content) (works without owning the page). Google's [legal/trademark removal form](https://support.google.com/legal/troubleshooter/1114905) is a backstop only — Google defers to Instagram.

## 3. Register the SynQuanta trademark (the real long-term fix)

You have a Ltd company but **no registered mark** — which is *why* a squatter can wave a ® at you. Registering converts "please believe we own this" into a number every platform (Meta, Google, Apple) honors, and unlocks Meta **Brand Rights Protection** + Google trademark removal for the next infringer.

- **UKIPO** (home base, cheapest/fastest): ~**£170**/class, ~**4 months**. [ipo.gov.uk](https://www.ipo.gov.uk/tm3-servicesfees) (note a fee rise ~£205 from 1 Apr 2026).
- **USPTO** (you have a US App Store presence): ~**$350**/class, **8–14 months**. Recommended as a second filing.
- EUIPO only if the EU is a real market (~€850).

## 4. Build the entity → trigger a Google Knowledge Panel

This is what makes Google show *your* brand panel for "synquanta" and visually displaces lookalikes. Google needs the brand recognized as an **entity**, corroborated across trusted sources. Create the missing ones (none exist yet):

1. **LinkedIn company page** — top missing signal for a B2B studio.
2. **Crunchbase** organization profile.
3. **Wikidata** item for "SynQuanta Technologies Ltd" (well-sourced) — the single strongest Knowledge-Graph input.
4. **Lock the official handles** on the exact `synquanta` stem (Instagram/X/LinkedIn/GitHub) so no one else can squat them. Get **Meta Verified** for the business.
5. Keep name/logo/URL **byte-for-byte consistent** across all of them + the App Store + the site.

➡️ **Send me the URLs** of any of these you create, and I'll add them to the site's `Organization` `sameAs` (currently it lists only your App Store developer page) — that's the on-site half of the entity link.

When a knowledge panel appears (after the entity is recognized), search your brand → **"Claim this knowledge panel"** → verify via an official profile.

## 5. Skip Google Business Profile
You're a remote, online-only studio with no storefront/service-area → **ineligible** for GBP. The Knowledge Panel (step 4) is the right mechanism instead.

---

## Already shipped on the site (no action needed)
- Per-page prerendered HTML + title/description/canonical/OG + JSON-LD (Organization, WebSite, your iOS apps, Breadcrumb, FAQ, Service/Portfolio/Product) — so Google/Bing/AI/social all see real content + your entity.
- `sameAs` → your App Store developer page. IndexNow auto-pings Bing on every deploy.
