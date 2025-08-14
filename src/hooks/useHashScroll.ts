import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Ensures that when the URL contains a #hash, the app scrolls to the element
 * with the matching id. Works on initial load, route changes and hash changes.
 * Includes light retry logic for async-rendered sections.
 */
export const useHashScroll = (): void => {
  const [location] = (typeof window !== 'undefined')
    ? useLocation()
    : (["/", () => {}] as unknown as ReturnType<typeof useLocation>);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isCancelled = false;

    const tryScrollToHash = (attempt: number = 0) => {
      if (isCancelled) return;
      const { hash } = window.location;
      if (!hash) return;
      const id = decodeURIComponent(hash.slice(1));
      if (!id) return;

      const target = document.getElementById(id);
      if (target) {
        // Rely on CSS scroll-margin-top for header offset
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // Retry briefly in case content renders after route change
      if (attempt < 10) {
        window.setTimeout(() => tryScrollToHash(attempt + 1), 100);
      }
    };

    const onHashChange = () => {
      // Defer to next tick to ensure DOM updates
      window.requestAnimationFrame(() => tryScrollToHash());
    };

    // Initial load and on route change
    window.requestAnimationFrame(() => tryScrollToHash());

    // Listen for hash changes
    window.addEventListener('hashchange', onHashChange);

    return () => {
      isCancelled = true;
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [location]);
};


