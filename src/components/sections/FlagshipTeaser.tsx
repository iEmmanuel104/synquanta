import { Check, ArrowRight } from 'lucide-react';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { FadeIn } from '../animations/FadeIn';

const points = [
  'Climb local maps before the Group Stage',
  'Mobile-first rebuild, 85+ PageSpeed',
  'Capture matchday crowds near every host stadium',
];

/** World Cup flagship highlight on the home page → links to the Products page. */
export const FlagshipTeaser = () => {
  return (
    <Section className="!py-0">
      <div className="relative overflow-hidden rounded-sq-2xl">
        {/* Stadium backdrop */}
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="/images/products-stadium.jpg"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/85 to-forest-deep/60" />
        </div>

        <div className="relative z-10 grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
          <FadeIn>
            <span className="wc-gold-chip mb-5">Built for the 2026 surge</span>
            <h2 className="mb-4 text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              Win the World Cup crowd before kickoff
            </h2>
            <p className="mb-6 max-w-xl text-lg leading-relaxed text-white/75">
              Our flagship turns deep local research into matchday revenue for businesses near every
              2026 host city — across the USA, Canada and Mexico.
            </p>
            <ul className="mb-8 flex flex-col gap-3">
              {points.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <Check className="mt-px h-[18px] w-[18px] flex-shrink-0 text-wc-gold-bright" aria-hidden="true" />
                  <span className="text-[15px] leading-snug text-white/85">{b}</span>
                </li>
              ))}
            </ul>
            <Button href="/products" className="btn-gold border-0 font-semibold">
              Explore products
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
};
