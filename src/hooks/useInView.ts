import { useEffect, useRef, useState } from 'react';

/**
 * IntersectionObserver-based "has this entered the viewport yet?" hook.
 * Returns a ref to attach and a boolean that flips to `true` once (and stays).
 * Used to trigger the scroll-animated data-viz (gauges, count-ups, bars, map arcs).
 */
export const useInView = (threshold = 0.3): [React.RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    // Already on screen at mount.
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 800) - 40 && r.bottom > 0) {
      setSeen(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.unobserve(el);
          }
        }),
      { threshold }
    );
    io.observe(el);

    // Safety fallback so content never gets stuck hidden.
    const t = window.setTimeout(() => setSeen(true), 2000);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [seen, threshold]);

  return [ref, seen];
};
