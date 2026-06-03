import { PortfolioProject } from '../types';

/**
 * Selected client work. Screenshots are static, captured live and stored under
 * /public/screens — these are showcase-only and never link off our site.
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'fundedforge',
    name: 'Funded Forge',
    category: 'Fintech · Trading platform',
    image: '/screens/fundedforge.jpg',
    blurb:
      'A funded-trader platform with instant and challenge funding, smarter risk controls and transparent, on-demand payouts.',
    tags: ['Fintech', 'Web app'],
  },
  {
    slug: 'gritgateway',
    name: 'GritGateway',
    category: 'Education · Talent intelligence',
    image: '/screens/gritgateway.jpg',
    blurb:
      'An AI talent-intelligence platform that looks beyond grades to connect students with mentors, scholarships and global opportunities.',
    tags: ['Education', 'AI'],
  },
  {
    slug: 'blkat',
    name: 'BlackAt',
    category: 'Community · Professional network',
    image: '/screens/blkat.jpg',
    blurb:
      'A professional network connecting Black executives, creatives and vendors with opportunity, mentorship and community.',
    tags: ['Community', 'Web app'],
  },
  {
    slug: 'busy2shop',
    name: 'Busy2Shop',
    category: 'E-commerce · Marketplace',
    image: '/screens/busy2shop.jpg',
    blurb:
      'A multi-market online shopping platform — browse trusted local markets and check out with agent-assisted delivery.',
    tags: ['E-commerce', 'Marketplace'],
  },
  {
    slug: 'nevelline',
    name: 'Nevelline',
    category: 'Fashion · E-commerce',
    image: '/screens/nevelline.jpg',
    blurb:
      'A fashion storefront with seasonal collections, trending categories and a clean, conversion-focused shopping experience.',
    tags: ['Fashion', 'E-commerce'],
  },
];
