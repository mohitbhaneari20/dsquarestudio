import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToElement } from '../lib/smoothScroll';

/**
 * Scrolls to `#id` after a route change. Waits briefly so the
 * page transition finishes and the target has mounted.
 */
export function useHashScroll() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = window.setTimeout(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) scrollToElement(el);
    }, 150);
    return () => window.clearTimeout(id);
  }, [hash]);
}
