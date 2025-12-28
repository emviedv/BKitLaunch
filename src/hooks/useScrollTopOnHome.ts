import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Ensures that on the home route without a hash, the window is scrolled to top
 * after hydration and on client-side navigations to '/'.
 * Keeps hash behavior intact (handled by useHashScroll).
 */
export const useScrollTopOnHome = (): void => {
  const [location] = useLocation();

  const scrollTopNow = () => {
    if (typeof window === 'undefined') return;
    try { window.scrollTo(0, 0); } catch { /* empty */ }
    try { document.documentElement.scrollTop = 0; } catch { /* empty */ }
    try { (document.body as any).scrollTop = 0; } catch { /* empty */ }
  };

  // After initial hydration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { pathname, hash } = window.location;
    if (pathname === '/' && !hash) {
      scrollTopNow();
      requestAnimationFrame(scrollTopNow);
      window.setTimeout(scrollTopNow, 50);
    }
  }, []);

  // On route change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { pathname, hash } = window.location;
    if (pathname === '/' && !hash) {
      scrollTopNow();
      requestAnimationFrame(scrollTopNow);
      window.setTimeout(scrollTopNow, 50);
    }
  }, [location]);

  // Handle BFCache and pageshow
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      try {
        const { pathname, hash } = window.location;
        if (pathname === '/' && !hash) {
          scrollTopNow();
          requestAnimationFrame(scrollTopNow);
          window.setTimeout(scrollTopNow, 50);
        }
      } catch { /* empty */ }
    };
    window.addEventListener('pageshow', handler as any);
    return () => window.removeEventListener('pageshow', handler as any);
  }, []);
};


