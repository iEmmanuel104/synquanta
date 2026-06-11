import { m as motion, useInView, useReducedMotion, type Transition } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { EASE_OUT, DUR } from '../../lib/motion';

interface AnimatedIconProps {
  /** Icon element(s) to render inside the chip. */
  children: ReactNode;
  /** The chip's existing background/shape classes (unchanged visuals). */
  className?: string;
  /** Index for de-synchronising the idle loop across a row of chips. */
  index?: number;
}

/**
 * Motion wrapper for the coloured icon "chips" across the site.
 *
 * - reveal: scale 0.6 -> 1 + slight rotate (-8deg -> 0) when scrolled into view.
 * - idle:   a tiny, varied float/pulse loop (disabled under reduced-motion).
 * - hover:  subtle lift + rotate + brand glow.
 *
 * Reveal uses the `useInView` hook + `animate` rather than `whileInView`:
 * these chips sit inside variant-driven StaggerContainers, and a nested
 * whileInView prop conflicts with the parent's variant propagation (the icons
 * were stuck at opacity:0 on mobile). The hook drives `animate` directly, so
 * it is independent of any parent variants — scroll-reveal that can never be
 * left invisible.
 */
export const AnimatedIcon = ({ children, className, index = 0 }: AnimatedIconProps) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const revealTransition: Transition = { duration: DUR.base, ease: EASE_OUT };

  if (shouldReduceMotion) {
    // Reveal still allowed (simple fade), but no looping idle/hover motion.
    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={revealTransition}
      >
        {children}
      </motion.div>
    );
  }

  // Vary the idle loop per index so a row of chips never beats in sync.
  const idleDelay = (index % 4) * 0.45;
  const idleDuration = 4 + (index % 3);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
      animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.6, rotate: -8 }}
      transition={revealTransition}
      whileHover={{
        y: -3,
        rotate: 3,
        boxShadow: '0 8px 24px rgba(82, 183, 136, 0.35)',
        transition: { duration: DUR.fast, ease: EASE_OUT },
      }}
    >
      <motion.div
        className="flex h-full w-full items-center justify-center"
        animate={{ y: [0, -2.5, 0] }}
        transition={{
          duration: idleDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: idleDelay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
