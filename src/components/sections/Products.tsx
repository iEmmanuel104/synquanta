import { Check, Gauge, MapPin, LucideIcon } from 'lucide-react';
import { Section } from '../layout/Section';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { FadeIn } from '../animations/FadeIn';
import { AnimatedIcon } from '../ui/AnimatedIcon';

/** Gold ball mark — trademark-safe original art ported from the design kit. */
const GoldBall = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2.5" />
    <path d="M24 10 L33 17 L29.5 28 L18.5 28 L15 17 Z" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="24" y1="10" x2="24" y2="4.5" />
      <line x1="33" y1="17" x2="38" y2="13.5" />
      <line x1="29.5" y1="28" x2="33.5" y2="36" />
      <line x1="18.5" y1="28" x2="14.5" y2="36" />
      <line x1="15" y1="17" x2="10" y2="13.5" />
    </g>
  </svg>
);

/** Trophy mark — trademark-safe original art ported from the design kit. */
const Trophy = ({ size = 26, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" style={{ color }} aria-hidden="true">
    <path d="M16 6 H32 V18 a8 8 0 0 1 -16 0 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M16 9 H10 v3 a6 6 0 0 0 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M32 9 H38 v3 a6 6 0 0 1 -6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="24" y1="26" x2="24" y2="34" stroke="currentColor" strokeWidth="2.5" />
    <path d="M17 42 q7 -8 14 0 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    <line x1="14" y1="42" x2="34" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

interface Product {
  flagship: boolean;
  icon: LucideIcon;
  name: string;
  outcome: string;
  bullets: string[];
  cta: string;
}

const products: Product[] = [
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

const FlagshipCard = ({ p, delay }: { p: Product; delay: number }) => (
  <FadeIn delay={delay} className="flex">
    <div className="wc-band wc-flag-ring relative flex w-full flex-col overflow-hidden rounded-sq-xl p-7 sm:p-8">
      <div className="wc-pattern" aria-hidden="true" />
      <div className="relative flex flex-1 flex-col">
        <span className="wc-gold-chip mb-5 self-start">
          <GoldBall size={15} />
          Built for the 2026 surge
        </span>
        <div className="mb-3.5 flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-sq-xl"
            style={{ width: 52, height: 52, background: 'var(--sq-gradient-gold)' }}
          >
            <Trophy size={26} color="var(--sq-charcoal)" />
          </div>
          <h3 className="text-xl font-semibold leading-tight text-white sm:text-2xl">{p.name}</h3>
        </div>
        <p className="mb-5 text-base leading-relaxed text-white/75">{p.outcome}</p>
        <ul className="mb-6 flex flex-col gap-3">
          {p.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5">
              <Check className="mt-px h-[18px] w-[18px] flex-shrink-0 text-wc-gold-bright" aria-hidden="true" />
              <span className="text-sm leading-snug text-white/85">{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Button href="/contact" className="btn-gold border-0 font-semibold">
            {p.cta}
          </Button>
        </div>
      </div>
    </div>
  </FadeIn>
);

const StandardCard = ({ p, delay, index }: { p: Product; delay: number; index: number }) => {
  const Icon = p.icon;
  return (
    <FadeIn delay={delay} className="flex">
      <div className="flex w-full flex-col rounded-sq-xl border border-cream-green bg-white p-7 shadow-sq transition-all duration-200 hover:-translate-y-1.5 hover:shadow-sq-xl sm:p-8">
        <AnimatedIcon
          index={index}
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-sq-lg bg-cream-green text-forest-primary"
        >
          <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
        </AnimatedIcon>
        <h3 className="mb-2.5 text-xl font-semibold text-neutral-charcoal">{p.name}</h3>
        <p className="mb-4.5 text-sm leading-relaxed text-neutral-medium-gray">{p.outcome}</p>
        <ul className="mb-5 flex flex-col gap-2.5">
          {p.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5">
              <Check className="mt-px h-[17px] w-[17px] flex-shrink-0 text-sage-medium" aria-hidden="true" />
              <span className="text-sm leading-snug text-neutral-dark-gray">{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Button href="/contact" variant="secondary" size="sm">
            {p.cta}
          </Button>
        </div>
      </div>
    </FadeIn>
  );
};

export const Products = () => {
  return (
    <Section id="products" className="scroll-mt-20">
      <SectionHeading
        title="Productized Growth"
        subtitle="Three ways we turn deep research into revenue — led by our 2026 flagship."
      />
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {products.map((p, i) =>
          p.flagship ? (
            <FlagshipCard key={p.name} p={p} delay={i * 0.09} />
          ) : (
            <StandardCard key={p.name} p={p} delay={i * 0.09} index={i} />
          )
        )}
      </div>
    </Section>
  );
};
