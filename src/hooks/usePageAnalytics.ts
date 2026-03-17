import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  classifyPageType,
  trackPageView,
  captureUTMParams,
  isAnalyticsEnabled,
} from '@/lib/analytics';

/**
 * Hook that fires enriched $pageview events on every SPA route change.
 * Also captures UTM params on first mount.
 *
 * Install once in AppContent (src/App.tsx).
 */
export function usePageAnalytics(): void {
  const [location] = useLocation();
  const hasInitRef = useRef(false);
  const prevPathRef = useRef<string | null>(null);

  // Capture UTM params once on first mount
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    captureUTMParams();
  }, []);

  // Fire pageview on every route change
  useEffect(() => {
    if (!isAnalyticsEnabled()) return;

    const path = (location || '/').split('?')[0].replace(/\/+$/, '') || '/';
    // Skip duplicate fires for the same path
    if (path === prevPathRef.current) return;
    prevPathRef.current = path;

    const classification = classifyPageType(path);

    trackPageView({
      page_type: classification.page_type,
      product_slug: classification.product_slug,
      content_slug: classification.content_slug,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    });
  }, [location]);
}
