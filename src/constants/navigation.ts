import { NavLink } from '../types';

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  // HIDDEN 2026-08-07 — the AI Receptionist stays out of the nav until the
  // product is finished end to end. Restore this line (and the <Flagship/>
  // band in HomePage.tsx, plus the /hvac route in App.tsx) to relaunch it.
  // { label: 'AI Receptionist', to: '/hvac' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

/**
 * THIS WEBSITE'S policy pages. Footer only, deliberately kept out of the header.
 *
 * These are scoped to www.synquanta.com itself: the contact form and cookieless
 * analytics. They are NOT the AI Receptionist's legal documents — that product
 * has its own Terms, Privacy and Refund policy (HvacTermsPage.tsx and siblings,
 * routed under /hvac/*), currently hidden along with the product.
 *
 * Keep the two sets separate. Paddle's account verification needs the PRODUCT's
 * three documents live and linked at launch; pointing it at these website pages
 * would not satisfy it, because they describe no paid service.
 */
export const legalLinks: NavLink[] = [
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  // No refund policy on the website: nothing is sold here. The AI Receptionist
  // has its own refund policy, which ships with that product.
];
