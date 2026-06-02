import { Check } from 'lucide-react';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { FadeIn } from '../animations/FadeIn';
import wcStadium from '../../assets/worldcup/wc-stadium.svg';
import wcCup from '../../assets/worldcup/wc-cup.svg';

/**
 * Gold ball mark — trademark-safe original art ported from the design kit.
 * Colored via `currentColor` so it inherits the surrounding text color.
 */
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

interface Flagship {
  name: string;
  outcome: string;
  bullets: string[];
  price: string;
  cta: string;
}

// Single flagship product only — the World Cup campaign is single-product.
const flagship: Flagship = {
  name: 'World Cup Revenue Optimization',
  outcome:
    'Climb the maps, fix the site, and capture matchday crowds — before kickoff.',
  bullets: [
    'Local map climb to top-5 before Group Stage',
    'Mobile-first rebuild, 85+ PageSpeed',
    'Automated review velocity program',
    'Booking & contact flow built to convert tourist traffic',
  ],
  price: 'from $1,500',
  cta: 'Book the flagship',
};

export const WorldCupFlagship = () => {
  return (
    <Section id="worldcup" className="scroll-mt-20">
      {/* Pitch-night banner */}
      <FadeIn>
        <div className="wc-band wc-flag-ring relative overflow-hidden rounded-sq-xl px-6 py-10 sm:px-10 sm:py-12 mb-10 lg:mb-14">
          <div className="wc-pattern" aria-hidden="true" />
          <img
            src={wcStadium}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 right-2 w-72 max-w-[55%] opacity-60 sm:opacity-80"
          />
          <div className="relative max-w-2xl">
            <span className="wc-gold-chip mb-5">
              <GoldBall size={15} />
              Pitch-night · 2026 surge
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
              The 2026 crowds are coming. Be the business they find first.
            </h2>
            <p className="mt-4 text-lg text-white/75 max-w-xl leading-relaxed">
              Millions of visitors. One short window. Our flagship turns the
              World Cup surge into matchday revenue — before kickoff.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Single flagship product card */}
      <FadeIn delay={0.1}>
        <div className="wc-band wc-flag-ring relative overflow-hidden rounded-sq-xl p-8 sm:p-10">
          <div className="wc-pattern" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div className="flex flex-col">
              <span className="wc-gold-chip mb-5 self-start">
                <GoldBall size={15} />
                Built for the 2026 surge
              </span>

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="flex h-13 w-13 items-center justify-center rounded-sq-xl"
                  style={{
                    width: 52,
                    height: 52,
                    background: 'var(--sq-gradient-gold)',
                  }}
                >
                  <Trophy size={26} color="var(--sq-charcoal)" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white leading-tight">
                  {flagship.name}
                </h3>
              </div>

              <p className="text-base text-white/75 leading-relaxed mb-6 max-w-xl">
                {flagship.outcome}
              </p>

              <ul className="flex flex-col gap-3 mb-7">
                {flagship.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-wc-gold-bright"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-white/85 leading-snug">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-4">
                <span className="font-mono font-semibold text-lg text-wc-gold-bright">
                  {flagship.price}
                </span>
                <Button
                  href="#contact"
                  className="btn-gold border-0 font-semibold"
                >
                  {flagship.cta}
                </Button>
              </div>
            </div>

            {/* Trophy art */}
            <div className="hidden lg:flex justify-center">
              <img
                src={wcCup}
                alt="Championship trophy"
                className="w-40 drop-shadow-[0_8px_32px_rgba(200,161,75,0.25)]"
              />
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
};
