import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { generateMetadata, updatePageMetadata } from '@/lib/seo';

/**
 * Hook to manage SEO metadata on the client side
 * This ensures proper metadata for client-side navigation
 */
export function useSEO(contentData?: any) {
  const [location] = (typeof window !== 'undefined') ? useLocation() : (["/", () => {}] as unknown as ReturnType<typeof useLocation>);
  
  useEffect(() => {
    // Skip if this is SSR or if we don't have window
    if (typeof window === 'undefined') return;
    
    // Generate metadata for current route
    const metadata = generateMetadata(location, contentData);
    
    // Update page metadata
    updatePageMetadata(metadata);
    
    // Update browser history state with SEO data for better back/forward navigation
    if (window.history.replaceState) {
      const currentState = window.history.state || {};
      window.history.replaceState(
        { ...currentState, seo: { title: metadata.title, description: metadata.description } },
        '',
        window.location.href
      );
    }
  }, [location, contentData]);
}

/**
 * Hook specifically for dynamic content updates
 * Use this when content changes without route change
 */
export function useDynamicSEO(path: string, contentData?: any) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const metadata = generateMetadata(path, contentData);
    updatePageMetadata(metadata);
  }, [path, contentData]);
}