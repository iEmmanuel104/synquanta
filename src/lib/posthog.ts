import type { PostHog } from 'posthog-js';

const KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined;
const HOST =
  (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined) ??
  'https://us.i.posthog.com';

/** True only when a PostHog project key is configured at build time. */
export const posthogEnabled = Boolean(KEY);

let instance: PostHog | null = null;
let initStarted = false;
let queuedPageviews = 0;
let queuedEvents: Array<{ event: string; properties?: Record<string, unknown> }> = [];

/**
 * Initialise PostHog in fully cookieless mode (persistence: 'memory' → no
 * cookies and no localStorage), so the site needs NO consent banner under
 * GDPR/ePrivacy. Geography, traffic source and per-session behaviour are still
 * captured; only cross-session visitor stitching is given up.
 *
 * posthog-js (~55KB gzip) is loaded with a DYNAMIC import so it never lands in
 * the home page's critical bundle — it's fetched on idle, after first paint.
 * Pageviews are captured manually (capture_pageview: false) because this is a
 * client-routed SPA — see capturePageview()/<PostHogPageviews> wired into <App>.
 */
export async function initPostHog() {
  if (!KEY || typeof window === 'undefined' || initStarted) return;
  initStarted = true;
  const { default: posthog } = await import('posthog-js');
  posthog.init(KEY, {
    api_host: HOST,
    persistence: 'memory',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
  });
  instance = posthog;
  // Flush anything that fired before the SDK finished loading — pageviews
  // first, so a conversion event never precedes the pageview it belongs to.
  for (; queuedPageviews > 0; queuedPageviews--) posthog.capture('$pageview');
  const pending = queuedEvents;
  queuedEvents = [];
  for (const { event, properties } of pending) posthog.capture(event, properties);
}

/**
 * Capture a $pageview. Queue-safe: if PostHog hasn't finished its lazy load yet,
 * the pageview is buffered and replayed once initPostHog() resolves.
 */
export function capturePageview() {
  if (!posthogEnabled) return;
  if (instance) instance.capture('$pageview');
  else queuedPageviews++;
}

/**
 * Capture a custom product event (e.g. a contact-form submission, a landing-page
 * CTA click) so conversions are visible in PostHog, not just pageviews.
 * Queue-safe in the same way as capturePageview(): posthog-js is lazy-loaded on
 * idle, so an event fired before that resolves — which on a paid-ad landing page
 * is exactly the fast-clicking visitor you most want to measure — is buffered
 * and replayed once initPostHog() completes, rather than dropped.
 *
 * The buffer is capped so a page that fires events in a loop can't grow it
 * without bound if PostHog never loads (blocked by an ad blocker, say).
 */
const MAX_QUEUED_EVENTS = 50;

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (!posthogEnabled) return;
  if (instance) instance.capture(event, properties);
  else if (queuedEvents.length < MAX_QUEUED_EVENTS) queuedEvents.push({ event, properties });
}
