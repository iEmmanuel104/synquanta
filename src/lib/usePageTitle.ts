import { useEffect } from 'react';

/** Sets document.title for the current page (multi-page SEO/UX). */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
