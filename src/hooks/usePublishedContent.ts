import { useMemo } from 'react';
import { loadPublishedContent } from '../lib/publishedContent';
import { debugService } from '../lib/debugService.ts';

const heroDiagnosticsEnabled = () => {
  if (typeof process !== 'undefined') {
    const envValue = process.env?.DEBUG_LANDING_HERO ?? process.env?.DEBUG_FIX;
    if (typeof envValue !== 'undefined') {
      return envValue !== '0';
    }
  }

  if (typeof import.meta !== 'undefined') {
    const envValue = (import.meta as any)?.env?.VITE_DEBUG_LANDING_HERO ?? (import.meta as any)?.env?.VITE_DEBUG_FIX;
    if (typeof envValue !== 'undefined') {
      return envValue !== '0';
    }
  }

  return false;
};

type ContentSource = 'static';

interface PublishedContentState<TContent = any> {
  content: TContent;
  loading: boolean;
  error: string | null;
  source: ContentSource;
}

/**
 * Simplified published content hook that serves the bundled JSON payload.
 * Previously this revalidated via the CMS; now we rely solely on the static data
 * packaged with the site build.
 */
export const usePublishedContent = (): PublishedContentState => {
  const content = useMemo(() => {
    const snapshot = loadPublishedContent();

    if (heroDiagnosticsEnabled()) {
      debugService.contentLoad('hero:usePublishedContent', {
        timestamp: new Date().toISOString(),
        heroTitle: snapshot?.hero?.title,
        heroSubtitle: (snapshot?.hero as any)?.subtitle,
        heroVisibleSetting: snapshot?.settings?.visibility?.hero,
        heroFlagVisible: (snapshot as any)?.hero?.visible,
        hasRootProduct: Boolean((snapshot as any)?.product),
        productSlugs: snapshot?.products ? Object.keys(snapshot.products) : [],
      });
    }

    return snapshot;
  }, []);
  return {
    content,
    loading: false,
    error: null,
    source: 'static',
  };
};
