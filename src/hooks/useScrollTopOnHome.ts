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

  const scrollTopNow = () => {
    if (typeof window === 'undefined') return;
    try { window.scrollTo(0, 0); } catch {}
    try { document.documentElement.scrollTop = 0; } catch {}
    try { (document.body as any).scrollTop = 0; } catch {}
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
    const handler = (e: PageTransitionEvent) => {
      try {
        const { pathname, hash } = window.location;
        if (pathname === '/' && !hash) {
          scrollTopNow();
          requestAnimationFrame(scrollTopNow);
          window.setTimeout(scrollTopNow, 50);
        }
      } catch {}
    };
    window.addEventListener('pageshow', handler as any);
    return () => window.removeEventListener('pageshow', handler as any);
  }, []);
};


