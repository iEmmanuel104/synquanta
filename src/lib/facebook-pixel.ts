/**
 * Meta (Facebook) Pixel.
 *
 * Loaded for paid-social attribution — the ad creative in `marketing/` drives
 * traffic here, and without this there is no way to tell Ads Manager which ad
 * produced an enquiry, or to let Meta optimise delivery toward people who
 * actually convert.
 *
 * THIS SETS COOKIES. `_fbp` on every visit, plus `_fbc` when someone arrives
 * with an `fbclid` on the URL. That is a material change from the rest of this
 * site's analytics: lib/posthog.ts runs cookieless precisely so no consent
 * banner is needed. /privacy has been updated to say so — if you change what
 * fires here, change that page in the same commit.
 *
 * WHY THE STUB LIVES IN THE BUNDLE, NOT index.html
 * Meta's standard snippet ends with `fbq('track', 'PageView')`. Pasted into
 * index.html that fires once per hard page load, which in a client-routed SPA
 * means the home page is counted and no other route ever is. So the stub is
 * defined here and React owns every PageView (see <Pageviews> in App.tsx).
 * Dropping the snippet's own PageView call is what stops the first route being
 * counted twice.
 *
 * The stub is ~1KB and queues calls, so anything fired before fbevents.js
 * finishes loading is replayed in order — no hand-rolled buffer needed, unlike
 * the PostHog module.
 */

/** Public identifier. Not a secret — it is visible in the page source. */
const PIXEL_ID =
  (import.meta.env.VITE_FACEBOOK_PIXEL_ID as string | undefined) ?? '1358780625858062';

/**
 * Production only. Without this guard every `npm run dev` reload and every
 * Vercel preview deploy writes into the same pixel that ad optimisation reads
 * from, and that data cannot be deleted after the fact.
 */
export const facebookPixelEnabled = Boolean(PIXEL_ID) && import.meta.env.PROD;

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let scriptRequested = false;

/**
 * Define `fbq` and queue `init` — in that order, on the first call, whoever
 * calls first.
 *
 * THE ORDERING HERE IS THE WHOLE POINT. `init` must be the first entry in the
 * queue. fbevents.js drains the queue in order when it loads, and a `track`
 * that arrives before the pixel is registered is silently discarded — no error,
 * no beacon, nothing in Events Manager.
 *
 * This bit us: `init` used to live in initFacebookPixel(), which runs on idle,
 * while trackPageView() runs on React mount and created the stub first. The
 * queue came out as [track PageView, init], so the landing-route PageView was
 * dropped on every single visit — which is most of the ad traffic. Verified
 * fixed by watching for the facebook.com/tr beacon in a real browser.
 *
 * So: every entry point calls this, and init is always queued here.
 */
function ensurePixel(): Fbq {
  if (window.fbq) return window.fbq;
  const fbq = function (...args: unknown[]) {
    // Once fbevents.js loads it assigns callMethod; until then everything is
    // queued and replayed in order. Meta's own snippet writes this as a ternary
    // statement, which this repo's lint config rejects.
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  fbq('init', PIXEL_ID);
  return fbq;
}

/**
 * Load fbevents.js, which drains whatever the stub has queued.
 *
 * Called on idle from main.tsx alongside PostHog, so a ~70KB third-party script
 * never competes with first paint on a slow phone. Deferring costs nothing —
 * the stub has been queuing since first paint, and ensurePixel() guarantees
 * `init` sits at the front of that queue.
 */
export function initFacebookPixel() {
  if (!facebookPixelEnabled || typeof window === 'undefined' || scriptRequested) return;
  scriptRequested = true;

  ensurePixel();

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
}

/**
 * A single PageView. Fired by React for the initial route AND every subsequent
 * client-side navigation — Meta's snippet only ever sees the first.
 *
 * Safe to call before initFacebookPixel(): the stub queues it. Safe to call
 * when disabled: it becomes a no-op.
 */
export function trackPageView() {
  if (!facebookPixelEnabled) return;
  ensurePixel()('track', 'PageView');
}

/**
 * The `Lead` standard event — someone submitted the contact form.
 *
 * This is the one that matters commercially. A pixel firing only PageView can
 * report traffic but cannot optimise for conversions, so Meta would keep buying
 * the cheapest clicks rather than the ones that turn into enquiries.
 */
export function trackLead(properties?: Record<string, unknown>) {
  if (!facebookPixelEnabled) return;
  ensurePixel()('track', 'Lead', properties);
}

/**
 * The `ViewContent` standard event, fired only on the pages that signal buying
 * intent rather than on every route.
 *
 * This is what makes retargeting possible. The campaign runs cold traffic on
 * `what-we-build`, then re-targets with `how-we-work` and `hard-part` (see
 * marketing/copy/), and a "people who read Services or Portfolio" audience is
 * far more valuable to re-target than "everyone who loaded any page".
 *
 * Deliberately NOT on every route. An event that fires everywhere carries no
 * information, and Meta weights a conversion signal by how selective it is.
 */
export function trackViewContent(properties?: Record<string, unknown>) {
  if (!facebookPixelEnabled) return;
  ensurePixel()('track', 'ViewContent', properties);
}

/**
 * The `Contact` standard event — someone started a conversation by email rather
 * than through the form.
 *
 * Our own ads tell people to "email or synquanta.com", so this is a real
 * conversion path, and until this existed it produced no signal whatsoever:
 * a visitor who clicked the address and wrote to us looked identical to one who
 * bounced.
 *
 * A click is not a sent email, so this is a weaker signal than `Lead` and
 * should not be optimised against once `Lead` has the volume to carry a
 * campaign on its own.
 */
export function trackContact(properties?: Record<string, unknown>) {
  if (!facebookPixelEnabled) return;
  ensurePixel()('track', 'Contact', properties);
}

/**
 * `FormStart` — a CUSTOM event (trackCustom, not track), fired the first time
 * someone types into the contact form.
 *
 * WHY A CUSTOM EVENT AND NOT InitiateCheckout
 * InitiateCheckout is the obvious-looking fit and it is the wrong one. It is a
 * commerce event; using it for a contact form corrupts every report that
 * assumes it means a checkout, permanently, and Meta optimises against custom
 * conversions perfectly well.
 *
 * WHY IT EXISTS AT ALL
 * Meta needs roughly 50 optimisation events per ad set per week to leave the
 * learning phase. A B2B studio will not get 50 enquiries a week from a cold
 * start, so optimising straight for `Lead` leaves ad sets stuck in learning and
 * spending badly. This is the middle rung of the ladder:
 *
 *   ViewContent  (lots of volume)  →  FormStart  (some)  →  Lead  (the real thing)
 *
 * Move down a rung as volume allows. Switch to Lead once it clears ~50/week.
 */
export function trackFormStart(properties?: Record<string, unknown>) {
  if (!facebookPixelEnabled) return;
  ensurePixel()('trackCustom', 'FormStart', properties);
}
