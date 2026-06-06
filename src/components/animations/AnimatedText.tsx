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
  /**
   * Compressed timing for above-the-fold text that animates on page load
   * (the hero). The user has already waited through the network + JS mount —
   * the reveal should finish fast. Scroll-triggered reveals keep the default,
   * more theatrical pace.
   */
  quick?: boolean;
}

const containerVariants = (delay: number, stagger: number) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delay,
      staggerChildren: stagger,
    },
  },
});

const wordVariants = (duration: number) => ({
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration, ease: EASE_OUT },
  },
});

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
  quick = false,
}: AnimatedTextProps) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');
  const stagger = quick ? 0.03 : 0.045;
  const duration = quick ? 0.28 : DUR.fast;

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
      variants={containerVariants(delay, stagger)}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span aria-hidden="true" className="inline-block">
            <motion.span
              className={`inline-block ${gradientClass ?? ''}`}
              style={light ? { willChange: 'transform, filter, opacity' } : undefined}
              variants={wordVariants(duration)}
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
