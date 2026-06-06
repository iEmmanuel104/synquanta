import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedGrid } from '../ui/AnimatedGrid';
import { FloatingCodeCard } from '../ui/FloatingCodeCard';
import { Picture } from '../ui/Picture';
import { AnimatedText } from '../animations/AnimatedText';

const MotionLink = motion.create(Link);

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToServices = () => {
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Technical Background (dark) */}
      <AnimatedGrid />

      {/* Aurora photographic accent — glows through the dark grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* noAvif: this is the LCP image — Safari decodes avif noticeably
            slower than webp, so the eager hero serves webp (68KB vs 47KB is
            worth the faster paint). */}
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

      {/* Content */}
      <div className="container-custom relative z-10 pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text Content */}
          <div className="flex-1 lg:max-w-[60%] text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Badge */}
              <motion.span
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-mint-pale bg-white/[0.08] rounded-full border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {!shouldReduceMotion && (
                  <motion.span
                    className="w-2 h-2 rounded-full bg-sage-light"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                A research-led product studio
              </motion.span>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-[-0.02em] leading-[1.1] mb-6">
                {/* quick + tight delays: the branded boot shell has already
                    covered the wait — the headline should be legible well
                    under half a second after React mounts. */}
                <AnimatedText
                  as="span"
                  text="We bring ideas"
                  light
                  quick
                  delay={0.05}
                  className="block"
                />
                <AnimatedText
                  as="span"
                  text="to life."
                  light
                  quick
                  delay={0.2}
                  className="block"
                  gradientClass="bg-gradient-to-r from-sage-light via-mint-soft to-mint-pale bg-clip-text text-transparent"
                />
              </h1>

              {/* Subheadline */}
              <motion.p
                className="max-w-2xl mx-auto lg:mx-0 text-lg md:text-xl text-white/60 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
              >
                We design platforms, build web &amp; mobile products, and help startups go from first
                sketch to launch — researched first, then engineered to last.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
              >
                <MotionLink
                  to="/contact"
                  className="inline-flex items-center justify-center font-medium rounded-sq px-8 py-4 text-lg bg-white text-forest-deep hover:bg-cream-green shadow-sq-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  Request a quote
                </MotionLink>
                <MotionLink
                  to="/services"
                  className="inline-flex items-center justify-center font-medium rounded-sq px-8 py-4 text-lg bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-light focus-visible:ring-offset-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  Explore services
                </MotionLink>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating Code Card */}
          <div className="flex-shrink-0 lg:max-w-[40%]">
            <FloatingCodeCard />
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToServices}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 p-2 text-white/40 hover:text-white/70 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{
            opacity: { delay: 1, duration: 0.5 },
            y: { delay: 1.5, duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          aria-label="Scroll to services"
        >
          <span className="text-xs font-medium tracking-wider uppercase">Explore</span>
          <ChevronDown size={24} />
        </motion.button>
      </div>
    </section>
  );
};
