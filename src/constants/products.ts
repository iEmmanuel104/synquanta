import { Gauge, MapPin, LucideIcon } from 'lucide-react';

export interface Product {
  flagship: boolean;
  /** Lucide icon for the standard cards (flagship renders the Trophy mark instead). */
  icon: LucideIcon;
  name: string;
  outcome: string;
  bullets: string[];
  cta: string;
}

export const products: Product[] = [
  {
    flagship: true,
    icon: Gauge, // unused for flagship (uses Trophy), kept for type parity
    name: 'World Cup Revenue Optimization',
    outcome: 'Climb the maps, fix the site, and capture matchday crowds — before kickoff.',
    bullets: [
      'Local map climb to top-5 before Group Stage',
      'Mobile-first rebuild, 85+ PageSpeed',
      'Automated review velocity program',
    ],
    cta: 'Request a quote',
  },
  {
    flagship: false,
    icon: Gauge,
    name: 'Conversion Site Rebuild',
    outcome: 'A fast, mobile-first website built to turn clicks into covers.',
    bullets: [
      'Sub-2-second mobile load',
      'Online booking & contact built in',
      'Designed to convert tourist traffic',
    ],
    cta: 'Request a quote',
  },
  {
    flagship: false,
    icon: MapPin,
    name: 'Local Growth Engine',
    outcome: 'Get found first when nearby customers search "near me".',
    bullets: [
      'Google Business Profile optimization',
      'Keyword & citation targeting',
      'Competitor positioning reports',
    ],
    cta: 'Request a quote',
  },
];
