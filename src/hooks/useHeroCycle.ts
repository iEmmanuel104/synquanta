import { useEffect, useState, type RefObject } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export const HERO_STEPS = ['Research', 'Design', 'Build', 'Launch'] as const;
export const HERO_STEP_MS = 2600;

/**
 * Drives the hero's Research → Design → Build → Launch loop. Only ticks while
 * the hero is on screen and the tab is visible; under reduced motion it rests
 * on the final "Launch" state.
 */
export const useHeroCycle = (ref: RefObject<HTMLElement | null>) => {
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.2 });
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    let id = 0;
    const tick = () => {
      if (document.visibilityState !== 'visible') return;
      setStep((s) => {
        const next = (s + 1) % HERO_STEPS.length;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    };
    id = window.setInterval(tick, HERO_STEP_MS);
    return () => window.clearInterval(id);
  }, [reduce, inView]);

  return { step: reduce ? HERO_STEPS.length - 1 : step, cycle };
};
