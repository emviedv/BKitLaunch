import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Ensures that on the home route without a hash, the window is scrolled to top
 * after hydration and on client-side navigations to '/'.
 * Keeps hash behavior intact (handled by useHashScroll).
 */
export const useScrollTopOnHome = (): void => {
  const [location] = (typeof window !== 'undefined')
    ? useLocation()
    : (['/', () => {}] as unknown as ReturnType<typeof useLocation>);

  // After initial hydration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { pathname, hash } = window.location;
    if (pathname === '/' && !hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, []);

  // On route change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { pathname, hash } = window.location;
    if (pathname === '/' && !hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location]);
};


