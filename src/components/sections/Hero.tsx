import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-off-white">
      {/* Animated Gradient Mesh Background */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Blob 1 */}
          <motion.div
            className="absolute -top-40 -left-40 w-96 h-96 bg-mint-pale/40 rounded-full blur-3xl"
            animate={{
              x: [0, 60, 0],
              y: [0, 40, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Gradient Blob 2 */}
          <motion.div
            className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-sage-light/30 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 60, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Gradient Blob 3 */}
          <motion.div
            className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-cream-green/60 rounded-full blur-3xl"
            animate={{
              x: [0, 80, 0],
              y: [0, -40, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-off-white/30 to-neutral-off-white" />
        </div>
      )}

      {/* Content */}
      <div className="container-custom relative z-10 text-center pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Badge */}
          {/* <motion.span
            className="inline-block px-4 py-2 mb-6 text-sm font-medium text-forest-primary bg-cream-green rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Since 2026 - Nigeria
          </motion.span> */}

          {/* Main Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-forest-deep tracking-tight leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Modern Digital
            <br />
            <span className="bg-gradient-to-r from-forest-primary to-sage-light bg-clip-text text-transparent">
              Solutions
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-medium-gray mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            SynQuanta Technologies delivers innovative software solutions across web, mobile, and emerging technologies.
            We turn ideas into reliable, scalable products.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button href="#contact" size="lg">
              Get Started
            </Button>
            <Button href="#services" variant="secondary" size="lg">
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToServices}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 text-forest-primary hover:text-forest-deep transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1, duration: 0.5 },
            y: { delay: 1.5, duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          aria-label="Scroll to services"
        >
          <ChevronDown size={32} />
        </motion.button>
      </div>
    </section>
  );
};
