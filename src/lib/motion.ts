import type { Variants } from 'framer-motion';

/**
 * Shared motion system for the SynQuanta marketing site.
 * One source of truth for easing, durations and stagger timings so every
 * section reveal feels like the same cohesive, premium motion language.
 */

/** Premium easeOutQuint-ish curve used across all reveals. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Canonical durations (seconds). */
export const DUR = {
  fast: 0.4,
  base: 0.6,
  slow: 0.85,
} as const;

/** Canonical stagger spacings (seconds between children). */
export const STAGGER = {
  tight: 0.06,
  base: 0.1,
} as const;

/** Standard viewport config for whileInView reveals. */
export const VIEWPORT = { once: true, margin: '-80px' } as const;

/** Simple fade + rise, e.g. for a single block. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

/** Stagger child variant — slightly faster so groups settle quickly. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.fast, ease: EASE_OUT },
  },
};
