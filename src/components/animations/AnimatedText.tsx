import { motion, useReducedMotion } from 'framer-motion';
import { createElement, Fragment } from 'react';
import { EASE_OUT, DUR, VIEWPORT } from '../../lib/motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
  delay?: number;
  /** Slightly larger blur on light-on-dark text reads better; cosmetic only. */
  light?: boolean;
  /**
   * Gradient/clip classes (e.g. bg-gradient-to-r ... bg-clip-text text-transparent).
   * Applied per-word so `background-clip:text` clips to the actual glyphs — putting
   * it on the container fails because the words sit in inline-block spans.
   */
  gradientClass?: string;
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
  gradientClass,
}: AnimatedTextProps) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    // Plain accessible text node — gradient (if any) goes on the element itself,
    // which holds the text directly so background-clip:text works.
    return createElement(as, { className: gradientClass ? `${className ?? ''} ${gradientClass}` : className }, text);
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
        <Fragment key={`${word}-${i}`}>
          <span aria-hidden="true" className="inline-block">
            <motion.span
              className={`inline-block ${gradientClass ?? ''}`}
              style={light ? { willChange: 'transform, filter, opacity' } : undefined}
              variants={wordVariants}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </MotionTag>
  );
};
