import { useEffect, useState } from 'react';

/**
 * Animates a number from 0 → target with an ease-out cubic, but only once
 * `active` is true. Respects prefers-reduced-motion by jumping straight to
 * the target value.
 */
export const useCountUp = (target: number, active: boolean, dur = 1100): number => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVal(target);
      return;
    }

    let raf = 0;
    let start: number | undefined;
    const tick = (ts: number) => {
      if (start === undefined) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target, active, dur]);

  return val;
};
