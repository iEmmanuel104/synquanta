import { lazy, Suspense, useRef } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedGrid } from '../ui/AnimatedGrid';
import { HeroPipeline } from '../ui/HeroPipeline';
import { Picture } from '../ui/Picture';
import { useHeroCycle } from '../../hooks/useHeroCycle';
import { useIsMobile } from '../../hooks';
import { EASE_OUT } from '../../lib/motion';

const MotionLink = motion.create(Link);

// Desktop-only decoration: split out so phones never download it.
const HeroScene = lazy(() => import('../ui/HeroScene').then((mod) => ({ default: mod.HeroScene })));

/* One word per stage of the Research → Design → Build → Launch loop. */
const WORDS = ['ideas', 'apps', 'platforms', 'brands'];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: EASE_OUT },
});

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { step, cycle } = useHeroCycle(sectionRef);
  // The live scene is desktop-only. This starts false and only turns true once
  // a desktop-width screen is confirmed, so phones never download the scene.
  const desktop = useIsMobile('(min-width: 1024px)');

  const scrollToServices = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden">
      <AnimatedGrid />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* noAvif: this is the LCP image — Safari decodes avif noticeably
            slower than webp, so the eager hero serves webp. */}
        <Picture
          src="/images/hero-abstract.jpg"
          alt=""
          loading="eager"
          fetchPriority="high"
          noAvif
          className="h-full w-full object-cover opacity-30 md:mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/45 via-forest-deep/10 to-forest-deep/35" />
      </div>

      <div className="container-custom relative z-10 pb-16 pt-24 lg:pb-24 lg:pt-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-10">
          <div className="min-w-0 flex-1 text-center lg:text-left">
            <motion.span
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-1.5 text-sm font-medium text-mint-pale backdrop-blur-sm"
              {...rise(0.05)}
            >
              <span className="sq-livedot h-2 w-2 rounded-full bg-sage-light" />
              A research-led product studio
            </motion.span>

            <motion.h1
              className="mb-6 text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-[3.3rem] xl:text-[3.85rem] 2xl:text-7xl"
              {...rise(0.12)}
            >
              <span className="sr-only">We bring ideas to life.</span>
              <span aria-hidden="true" className="block">
                We bring{' '}
                {/* Every word sits in the same grid cell, so the widest one
                    reserves the space and the line never jumps. */}
                <span className="relative grid justify-items-center align-bottom lg:inline-grid lg:justify-items-start">
                  {WORDS.map((w) => (
                    <span key={w} className="invisible col-start-1 row-start-1">
                      {w}
                    </span>
                  ))}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={WORDS[step]}
                      className="col-start-1 row-start-1 text-center lg:text-left"
                      initial={{ opacity: 0, y: '0.35em' }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: '-0.35em' }}
                      transition={{ duration: 0.28, ease: EASE_OUT }}
                    >
                      {WORDS[step]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
              <span
                aria-hidden="true"
                className="block bg-gradient-to-r from-sage-light via-mint-soft to-mint-pale bg-clip-text text-transparent"
              >
                to life.
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/65 md:text-xl lg:mx-0"
              {...rise(0.22)}
            >
              Web and mobile products for founders and teams, taken from the first sketch all the
              way to launch. We find out what to build before we build it.
            </motion.p>

            <motion.div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
              {...rise(0.3)}
            >
              <MotionLink
                to="/contact"
                className="sq-sheen group inline-flex items-center justify-center gap-2 rounded-sq bg-white px-8 py-4 text-lg font-medium text-forest-deep shadow-sq-lg transition-colors duration-200 hover:bg-cream-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', bounce: 0.3, visualDuration: 0.25 }}
              >
                Request a quote
                <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
              </MotionLink>
              <MotionLink
                to="/services"
                className="inline-flex items-center justify-center rounded-sq border-2 border-white/30 bg-transparent px-8 py-4 text-lg font-medium text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', bounce: 0.3, visualDuration: 0.25 }}
              >
                Explore services
              </MotionLink>
            </motion.div>

            <motion.div {...rise(0.4)}>
              <HeroPipeline step={step} cycle={cycle} />
            </motion.div>
          </div>

          {desktop && (
            <div className="hidden flex-shrink-0 lg:block lg:h-[376px] lg:w-[432px] xl:h-[423px] xl:w-[486px] 2xl:h-[470px] 2xl:w-[540px]">
              <div className="origin-top-left lg:scale-[0.8] xl:scale-90 2xl:scale-100">
                <Suspense fallback={null}>
                  <HeroScene step={step} cycle={cycle} />
                </Suspense>
              </div>
            </div>
          )}
        </div>

        <motion.button
          onClick={scrollToServices}
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 p-2 text-white/40 transition-colors hover:text-white/70 md:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          aria-label="Scroll to services"
        >
          <span className="sq-scroll-cue flex flex-col items-center gap-1">
            <span className="text-xs font-medium uppercase tracking-wider">Explore</span>
            <ChevronDown size={24} />
          </span>
        </motion.button>
      </div>
    </section>
  );
};
