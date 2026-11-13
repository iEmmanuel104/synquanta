/**
 * Ad attribution for enquiries.
 *
 * An ad click lands on a URL carrying utm_* tags (and Meta's fbclid). The
 * visitor may then browse two or three pages before they submit a form, and by
 * then the tags are gone from the address bar. This keeps the FIRST set of
 * tags seen in the tab (sessionStorage), so the enquiry still says which ad
 * produced it.
 *
 * Nothing here is personal data: campaign tags, the landing path and the
 * referring site. Storage access is wrapped because it throws in some private
 * modes; attribution is a nice-to-have and must never break the form.
 */
const KEY = 'sq_attr';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | 'landing' | 'referrer', string>>;

export function captureAttribution() {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem(KEY)) return; // first touch in this tab wins
    const q = new URLSearchParams(window.location.search);
    const a: Attribution = {};
    for (const p of PARAMS) {
      const v = q.get(p);
      if (v) a[p] = v.slice(0, 200);
    }
    a.landing = window.location.pathname;
    const ref = document.referrer;
    if (ref && !ref.startsWith(window.location.origin)) a.referrer = ref.slice(0, 200);
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* storage blocked: no attribution, form still works */
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

/** One readable line for the enquiry email, e.g. "facebook / paid_social / erp_launch / adA · landed on /erp". */
export function attributionLine(a: Attribution = getAttribution()): string {
  const utm = [a.utm_source, a.utm_medium, a.utm_campaign, a.utm_content].filter(Boolean).join(' / ');
  const parts = [utm || (a.fbclid ? 'Meta ad (no UTM)' : a.referrer ? `referral: ${a.referrer}` : 'direct / organic')];
  if (a.landing) parts.push(`landed on ${a.landing}`);
  return parts.join(' · ');
}
