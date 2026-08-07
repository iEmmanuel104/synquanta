import { PortfolioProject } from '../types';

/**
 * Selected client work. Screenshots are static, captured live and stored under
 * /public/screens — these are showcase-only and never link off our site.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'fundedforge',
    logo: '/logos/fundedforge.png',
    name: 'Funded Forge',
    category: 'Fintech · Trading platform',
    image: '/screens/fundedforge.jpg',
    blurb:
      'A funded-trader platform with instant and challenge funding, smarter risk controls and transparent, on-demand payouts.',
    tags: ['Fintech', 'Web app'],
  },
  {
    slug: 'gritgateway',
    logo: '/logos/gritgateway.svg',
    name: 'GritGateway',
    category: 'Education · Talent intelligence',
    image: '/screens/gritgateway.jpg',
    blurb:
      'A talent-intelligence platform that looks past grades, connecting students to mentors and scholarships they would not otherwise have found.',
    tags: ['Education', 'AI'],
  },
  {
    slug: 'blkat',
    logo: '/logos/blkat.svg',
    name: 'BlackAt',
    category: 'Community · Professional network',
    image: '/screens/blkat.jpg',
    blurb:
      'A professional network putting Black executives, creatives and vendors in front of the opportunities and mentors they were missing.',
    tags: ['Community', 'Web app'],
  },
  {
    slug: 'busy2shop',
    logo: '/logos/busy2shop.png',
    name: 'Busy2Shop',
    category: 'E-commerce · Marketplace',
    image: '/screens/busy2shop.jpg',
    blurb:
      'A multi-market shopping platform. Browse trusted local markets and check out with agent-assisted delivery.',
    tags: ['E-commerce', 'Marketplace'],
  },
  {
    slug: 'nevelline',
    logo: '/logos/nevelline.png',
    name: 'Nevelline',
    category: 'Fashion · E-commerce',
    image: '/screens/nevelline.jpg',
    blurb:
      'A fashion storefront built around seasonal collections, with a checkout that gets out of the way.',
    tags: ['Fashion', 'E-commerce'],
  },
];
