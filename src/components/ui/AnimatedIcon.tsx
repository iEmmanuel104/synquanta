import { motion, useReducedMotion, type Transition } from 'framer-motion';
import { ReactNode } from 'react';
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
 * - reveal: scale 0.6 -> 1 + slight rotate (-8deg -> 0) on whileInView (once).
 * - idle:   a tiny, varied float/pulse loop (disabled under reduced-motion).
 * - hover:  subtle lift + rotate + brand glow.
 *
 * Visual chip styling stays with the caller's `className`; this only adds motion.
 */
export const AnimatedIcon = ({ children, className, index = 0 }: AnimatedIconProps) => {
  const shouldReduceMotion = useReducedMotion();

  const revealTransition: Transition = { duration: DUR.base, ease: EASE_OUT };

  if (shouldReduceMotion) {
    // Reveal on mount (not whileInView): these chips sit inside a variant-driven
    // StaggerContainer, and a nested whileInView observer can fail to fire there
    // — leaving the icon stuck at opacity:0 (was invisible on mobile). animate
    // guarantees the icon always ends visible.
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
      className={className}
      initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
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
