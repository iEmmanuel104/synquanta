import { motion, useReducedMotion } from 'framer-motion';
import { createElement } from 'react';
import { EASE_OUT, DUR, VIEWPORT } from '../../lib/motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
  delay?: number;
  /** Slightly larger blur on light-on-dark text reads better; cosmetic only. */
  light?: boolean;
}

const containerVariants = (delay: number) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delay,
      staggerChildren: 0.045,
    },
  },
});

const wordVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DUR.fast, ease: EASE_OUT },
  },
};

/**
 * Reveals a heading word-by-word with a cohesive stagger. The full string
 * stays available to screen readers via `aria-label`; per-word spans are
 * `aria-hidden`. Under reduced-motion it renders plain, static text.
 */
export const AnimatedText = ({
  text,
  className,
  as = 'span',
  delay = 0,
  light = false,
}: AnimatedTextProps) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    // Plain accessible text node, no per-word motion.
    return createElement(as, { className }, text);
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={containerVariants(delay)}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block">
          <motion.span
            className="inline-block"
            style={light ? { willChange: 'transform, filter, opacity' } : undefined}
            variants={wordVariants}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </MotionTag>
  );
};
