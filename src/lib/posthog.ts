import posthog from 'posthog-js';

const KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined;
const HOST =
  (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined) ??
  'https://us.i.posthog.com';

/** True only when a PostHog project key is configured at build time. */
export const posthogEnabled = Boolean(KEY);

/**
 * Initialise PostHog in fully cookieless mode (persistence: 'memory' → no
 * cookies and no localStorage), so the site needs NO consent banner under
 * GDPR/ePrivacy. Geography, traffic source and per-session behaviour are still
 * captured; only cross-session visitor stitching is given up.
 *
 * Pageviews are captured manually (capture_pageview: false) because this is a
 * client-routed SPA — see usePageviews() wired into <App>.
 */
export function initPostHog() {
  if (!KEY || typeof window === 'undefined') return;
  posthog.init(KEY, {
    api_host: HOST,
    persistence: 'memory',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export { posthog };
