// Schema.org JSON-LD builders. Pure functions over existing constants — no new
// data entry. Consumed per-page via <Seo jsonLd={...} />. The site-wide
// Organization + WebSite graph lives statically in index.html; these reference
// it by @id so crawlers stitch the entity together.
import type { FaqItem, Service, PortfolioProject } from '../types';

const SITE = 'https://www.synquanta.com';
const ORG_ID = `${SITE}/#organization`;

type Json = Record<string, unknown>;

export interface Crumb {
  name: string;
  /** Route path beginning with "/". */
  path: string;
}

/** BreadcrumbList — yields the readable path shown under the result title. */
export function breadcrumb(trail: Crumb[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE}${c.path}`,
    })),
  };
}

/**
 * AboutPage whose mainEntity is the global Organization (referenced by @id so
 * crawlers stitch the studio's identity together). Reinforces the entity for
 * Search's Knowledge Graph and AI overviews.
 */
export function aboutPageSchema(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About SynQuanta Technologies',
    url: `${SITE}/about`,
    mainEntity: { '@id': ORG_ID },
  };
}

/** FAQPage — Google retired FAQ rich results, but Bing + AI engines still parse it. */
export function faqPageSchema(faqs: FaqItem[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** ItemList of Service offerings. */
export function serviceListSchema(services: Service[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.description,
        image: `${SITE}${s.illustration}`,
        provider: { '@id': ORG_ID },
        areaServed: 'Worldwide',
      },
    })),
  };
}

/**
 * Service + Offer for the HVAC AI Receptionist landing page.
 *
 * The price here MUST match the price rendered in the pricing section and the
 * price configured in the Paddle catalog — all three come from `hvacPlan` in
 * src/constants/hvac.ts for exactly that reason. A mismatch between the price a
 * crawler reads and the price actually charged is both a rich-result penalty and
 * a payment-provider verification failure.
 */
export function hvacServiceSchema(plan: {
  name: string;
  priceUsd: number;
  currency: string;
  trialDays: number;
  includedMinutes: number;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE}/hvac#service`,
    name: 'AI Phone Receptionist for HVAC Contractors',
    serviceType: 'AI answering service for HVAC contractors',
    description:
      'An AI receptionist that answers the calls your HVAC business misses, whether that is after hours, on another line, or while you are on a roof. It qualifies the caller, books the job and texts you, using your existing business number.',
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'United States' },
    audience: { '@type': 'BusinessAudience', name: 'HVAC contractors' },
    offers: {
      '@type': 'Offer',
      name: plan.name,
      price: String(plan.priceUsd),
      priceCurrency: plan.currency,
      availability: 'https://schema.org/InStock',
      url: `${SITE}/hvac`,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: plan.priceUsd,
        priceCurrency: plan.currency,
        unitText: 'MONTH',
        billingDuration: 1,
        billingIncrement: 1,
      },
      eligibleCustomerType: 'https://schema.org/Business',
      description: `${plan.trialDays}-day free trial, then $${plan.priceUsd} per month including ${plan.includedMinutes} answered minutes. Cancel anytime.`,
    },
  };
}

/** ItemList of portfolio works. */
export function creativeWorkListSchema(projects: PortfolioProject[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.name,
        about: p.category,
        description: p.blurb,
        image: `${SITE}${p.image}`,
        ...(p.tags ? { keywords: p.tags.join(', ') } : {}),
        creator: { '@id': ORG_ID },
      },
    })),
  };
}
