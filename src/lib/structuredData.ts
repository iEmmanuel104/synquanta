// Schema.org JSON-LD builders. Pure functions over existing constants — no new
// data entry. Consumed per-page via <Seo jsonLd={...} />. The site-wide
// Organization + WebSite graph lives statically in index.html; these reference
// it by @id so crawlers stitch the entity together.
import type { FaqItem, Service, PortfolioProject } from '../types';
import type { Product } from '../constants/products';

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

/** ItemList of productized Services (World Cup line). */
export function productListSchema(products: Product[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: p.name,
        description: p.outcome,
        provider: { '@id': ORG_ID },
        areaServed: ['US', 'CA', 'MX'],
      },
    })),
  };
}
