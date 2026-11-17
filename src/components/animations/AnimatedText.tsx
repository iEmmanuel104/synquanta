import { m as motion, useReducedMotion } from 'framer-motion';
import { createElement, Fragment } from 'react';
import { EASE_OUT, VIEWPORT } from '../../lib/motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
  delay?: number;
  /** Kept for existing callers; the reveal no longer differs on dark text. */
  light?: boolean;
  /**
   * Gradient/clip classes (e.g. bg-gradient-to-r ... bg-clip-text text-transparent).
   * Applied per-word so `background-clip:text` clips to the actual glyphs — putting
   * it on the container fails because the words sit in inline-block spans.
   */
  gradientClass?: string;
  /** Compressed timing for above-the-fold text that animates on page load. */
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

/* Each word rises from behind its own clipped line: a transform-only reveal
   that reads as "typeset into place" rather than a fade. */
const wordVariants = (duration: number) => ({
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration, ease: EASE_OUT },
  },
});

/**
 * Reveals a heading word by word. The full string stays available to screen
 * readers via `aria-label`; per-word spans are `aria-hidden`. Under
 * reduced motion it renders plain, static text.
 */
export const AnimatedText = ({
  text,
  className,
  as = 'span',
  delay = 0,
  gradientClass,
  quick = false,
}: AnimatedTextProps) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');
  const stagger = quick ? 0.035 : 0.055;
  const duration = quick ? 0.4 : 0.6;

  if (shouldReduceMotion) {
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
          {/* The padding/negative margin pair keeps descenders (g, y, p) inside
              the clip without changing the line height. */}
          <span aria-hidden="true" className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span
              className={`inline-block ${gradientClass ?? ''}`}
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
