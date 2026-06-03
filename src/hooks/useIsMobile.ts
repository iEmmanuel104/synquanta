import { useEffect, useState } from 'react';

/**
 * True on small / coarse-pointer screens. Used to skip GPU-expensive effects
 * (large animated blur blobs, blend modes) that make mobile feel janky.
 */
export const useIsMobile = (query = '(max-width: 768px)'): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return isMobile;
};
