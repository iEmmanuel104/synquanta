export interface Service {
  id: string;
  icon: string;
  /** Storyset illustration path under /illustrations. */
  illustration: string;
  title: string;
  description: string;
}

export interface Value {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  /** Route path (react-router). May include a #hash to scroll within a page. */
  to: string;
}

/** The product-type groups the portfolio filter tabs are built from. */
export type PortfolioType = 'platforms' | 'marketplaces' | 'ai' | 'websites';

export interface PortfolioProject {
  slug: string;
  name: string;
  /** Short category label, e.g. "Fashion · E-commerce". */
  category: string;
  /** Filter groups this project appears under. A project can sit in several. */
  types: PortfolioType[];
  /** Static screenshot path under /screens. */
  image: string;
  /** The live product. Opens in a new tab. Omit when there is nothing live worth sending people to. */
  url?: string;
  /** The client's own logo, shown in the home-page RecentWork strip. */
  logo: string;
  blurb: string;
  tags?: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}
