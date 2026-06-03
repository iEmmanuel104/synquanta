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

export interface PortfolioProject {
  slug: string;
  name: string;
  /** Short category label, e.g. "Fashion · E-commerce". */
  category: string;
  /** Static screenshot path under /screens. Showcase only — never links off-site. */
  image: string;
  blurb: string;
  tags?: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}
