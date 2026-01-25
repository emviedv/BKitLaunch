import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';

type UseSEOOptions = {
  shouldSkip?: (path: string) => boolean;
};

const resolveClientBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname.toLowerCase();
    // Normalize to www for production canonical URLs
    if (hostname === 'bibliokit.com') {
      return 'https://www.bibliokit.com';
    }
    return `${window.location.protocol}//${window.location.host}`;
  }
  return 'https://www.bibliokit.com';
};

export function applyClientMetadata(
  path: string,
  contentData?: any,
  options?: { updateHistory?: boolean }
) {
  const metadata = generateMetadata(path, contentData, resolveClientBaseUrl());
  updatePageMetadata(metadata);

  if (options?.updateHistory !== false && typeof window !== 'undefined' && window.history?.replaceState) {
    const currentState = window.history.state || {};
    window.history.replaceState(
      { ...currentState, seo: { title: metadata.title, description: metadata.description } },
      '',
      window.location.href
    );
  }

  return metadata;
}

/**
 * Hook to manage SEO metadata on the client side
 * This ensures proper metadata for client-side navigation
 */
export function useSEO(contentData?: any, options?: UseSEOOptions) {
  const shouldSkip = options?.shouldSkip;
  const [location] = useLocation();
  
  useEffect(() => {
    // Skip if this is SSR or if we don't have window
    if (typeof window === 'undefined') return;

    const path = location || '/';
    if (shouldSkip?.(path)) return;
    
    applyClientMetadata(path, contentData, { updateHistory: true });
  }, [location, contentData, shouldSkip]);
}

/**
 * Hook specifically for dynamic content updates
 * Use this when content changes without route change
 */
export function useDynamicSEO(path: string, contentData?: any) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    applyClientMetadata(path, contentData, { updateHistory: false });
  }, [path, contentData]);
}
