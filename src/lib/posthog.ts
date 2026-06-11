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
  // Flush any pageviews that fired before the SDK finished loading.
  for (; queuedPageviews > 0; queuedPageviews--) posthog.capture('$pageview');
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
