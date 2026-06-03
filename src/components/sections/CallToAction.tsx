import { motion, useReducedMotion } from 'framer-motion';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { FadeIn } from '../animations/FadeIn';

export const CallToAction = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="gradient">
      <div className="relative text-center py-8 lg:py-12 overflow-hidden">
        {/* Dot grid texture overlay */}
        <div className="absolute inset-0 bg-dot-grid-white pointer-events-none" />

        {/* Floating geometric shapes */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-10 left-[10%] w-16 h-16 rounded-full border border-white/[0.07]"
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-12 right-[15%] w-10 h-10 rounded-lg border border-white/[0.05] rotate-45"
              animate={{ y: [0, 12, 0], rotate: [45, 55, 45] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-1/2 right-[8%] w-6 h-6 rounded-full bg-white/[0.04]"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}

        <div className="relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 tracking-tight">
              Ready Before Kickoff?
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Let's review your business and show you exactly what we'd build to win the 2026 surge.
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
                Book a 15-min review
              </Button>
              <Button
                href="/products"
                variant="secondary"
                size="lg"
                className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white"
              >
                See the flagship
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
};
