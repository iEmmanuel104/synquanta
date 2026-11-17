import { useReducedMotion } from 'framer-motion';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { FadeIn } from '../animations/FadeIn';
import { AnimatedText } from '../animations/AnimatedText';

export const CallToAction = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section className="bg-aurora-soft">
      {/* Self-contained gradient card on a light section — keeps it visually
          separate from the flagship band above and the footer below. */}
      <div className="relative overflow-hidden rounded-sq-2xl bg-gradient-to-br from-forest-deep via-forest-primary to-sage-medium px-6 py-14 text-center shadow-sq-xl lg:py-20">
        {/* Dot grid texture overlay */}
        <div className="absolute inset-0 bg-dot-grid-white pointer-events-none" />

        {/* Floating geometric shapes */}
        {!shouldReduceMotion && (
          <>
            <div className="sq-drift-a absolute top-10 left-[10%] w-16 h-16 rounded-full border border-white/[0.07]" />
            <div className="sq-drift-b absolute bottom-12 right-[15%] w-10 h-10 rounded-lg border border-white/[0.05]" />
            <div className="sq-drift-c absolute top-1/2 right-[8%] w-6 h-6 rounded-full bg-white/[0.04]" />
          </>
        )}

        <div className="relative z-10">
          <AnimatedText
            as="h2"
            text="Bring us the hard part"
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 tracking-tight"
          />

          <FadeIn delay={0.1}>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              A half-formed idea, or a product that has stopped scaling. Either way you get back a
              written plan and a price before anyone starts work.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                className="bg-white text-forest-deep hover:bg-cream-green hover:text-forest-deep border-white"
              >
                Request a quote
              </Button>
              <Button
                href="/portfolio"
                variant="secondary"
                size="lg"
                className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white"
              >
                See our work
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
};
