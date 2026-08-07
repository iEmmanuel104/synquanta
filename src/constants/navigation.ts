import { NavLink } from '../types';

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'AI Receptionist', to: '/hvac' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

/**
 * Policy pages. Footer only: they are deliberately kept out of `navLinks` (the
 * header) but must stay publicly reachable and indexable, because Paddle's
 * account verification requires live Terms, Privacy and Refund pages linked
 * from the site.
 *
 * `/hvac` used to sit in neither list, on the basis that it was a paid-ad
 * landing page. It is now the one product we actually sell, so it is in the
 * header nav and in the footer. The paid-ad traffic still lands on it directly.
 */
export const legalLinks: NavLink[] = [
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Refund & Cancellation', to: '/refund-policy' },
];
