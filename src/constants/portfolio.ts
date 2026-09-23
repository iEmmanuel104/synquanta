import { PortfolioProject, PortfolioType } from '../types';

/** Filter tabs on /portfolio, in display order. "All" is added by the grid. */
export const portfolioTypes: { id: PortfolioType; label: string }[] = [
  { id: 'platforms', label: 'Platforms & SaaS' },
  { id: 'marketplaces', label: 'Marketplaces & E-commerce' },
  { id: 'ai', label: 'AI Products' },
  { id: 'websites', label: 'Websites & Non-profit' },
];

/**
 * Selected client work, newest first. Screenshots are static, captured live at
 * 1440×900 and stored under /public/screens. `url` links to the live product
 * and opens in a new tab; leave it out when the product is no longer live
 * (Nevelline's domain stopped resolving, so it has none).
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'umbrelar',
    logo: '/logos/umbrelar.png',
    name: 'Umbrelar',
    category: 'Marketing · AI marketing employee',
    types: ['ai', 'platforms'],
    image: '/screens/umbrelar.jpg',
    url: 'https://umbrelar.com',
    blurb:
      'An AI marketing employee for small businesses across Africa. It designs the creatives, posts to Instagram, Facebook and TikTok, runs click-to-WhatsApp ads and answers the leads they bring in.',
    tags: ['AI', 'Web app', 'Mobile app'],
  },
  {
    slug: 'hommesalon',
    logo: '/logos/hommesalon.png',
    name: 'HommeSalon',
    category: 'Beauty · Booking marketplace',
    types: ['marketplaces', 'platforms'],
    image: '/screens/hommesalon.jpg',
    url: 'https://hommesalon.com',
    blurb:
      'Book verified barbers, hairdressers and stylists who come to you. Payment sits in escrow and is only released once the job is confirmed done.',
    tags: ['Marketplace', 'Payments'],
  },
  {
    slug: 'hopedelivery',
    logo: '/logos/hopedelivery.png',
    name: 'The Hope Delivery Foundation',
    category: 'Non-profit · Donations & volunteering',
    types: ['websites'],
    image: '/screens/hopedelivery.jpg',
    url: 'https://thehopedeliveryfoundation.ca',
    blurb:
      'A Calgary non-profit site with live online donations, volunteer sign-up and a content editor the foundation runs itself.',
    tags: ['Non-profit', 'Website', 'CMS'],
  },
  {
    slug: 'fundedforge',
    logo: '/logos/fundedforge.png',
    name: 'Funded Forge',
    category: 'Fintech · Trading platform',
    types: ['platforms'],
    image: '/screens/fundedforge.jpg',
    url: 'https://www.fundedforge.com',
    blurb:
      'A funded-trader platform with instant and challenge funding, smarter risk controls and transparent, on-demand payouts.',
    tags: ['Fintech', 'Web app'],
  },
  {
    slug: 'gritgateway',
    logo: '/logos/gritgateway.svg',
    name: 'GritGateway',
    category: 'Education · Talent intelligence',
    types: ['ai', 'platforms'],
    image: '/screens/gritgateway.jpg',
    url: 'https://www.gritgateway.com',
    blurb:
      'A talent-intelligence platform that looks past grades, connecting students to mentors and scholarships they would not otherwise have found.',
    tags: ['Education', 'AI'],
  },
  {
    slug: 'blkat',
    logo: '/logos/blkat.svg',
    name: 'BlackAt',
    category: 'Community · Professional network',
    types: ['platforms'],
    image: '/screens/blkat.jpg',
    url: 'https://www.blkat.org',
    blurb:
      'A professional network putting Black executives, creatives and vendors in front of the opportunities and mentors they were missing.',
    tags: ['Community', 'Web app'],
  },
  {
    slug: 'busy2shop',
    logo: '/logos/busy2shop.png',
    name: 'Busy2Shop',
    category: 'E-commerce · Marketplace',
    types: ['marketplaces'],
    image: '/screens/busy2shop.jpg',
    url: 'https://www.busy2shop.com',
    blurb:
      'A multi-market shopping platform. Browse trusted local markets and check out with agent-assisted delivery.',
    tags: ['E-commerce', 'Marketplace'],
  },
  {
    slug: 'nevelline',
    logo: '/logos/nevelline.png',
    name: 'Nevelline',
    category: 'Fashion · E-commerce',
    types: ['marketplaces'],
    image: '/screens/nevelline.jpg',
    blurb:
      'A fashion storefront built around seasonal collections, with a checkout that gets out of the way.',
    tags: ['Fashion', 'E-commerce'],
  },
];
