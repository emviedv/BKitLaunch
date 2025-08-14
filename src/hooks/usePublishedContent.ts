import { useState, useEffect } from 'react';
import productData from '@/data/products.json';
import { createEmptyContent } from '@/lib/defaultContent';

interface UsePublishedContentOptions {
  fallbackToLocalStorage?: boolean;
  fallbackToStatic?: boolean;
}

interface ContentState {
  content: any;
  loading: boolean;
  error: string | null;
  source: 'api' | 'localStorage' | 'static' | 'ssr' | null;
}

// SSR data interface for type safety
interface SSRData {
  contentData?: any;
  url?: string;
}

// Get SSR data from window if available
function getSSRData(): any | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const ssrData = (window as any).__SSR_DATA__ as SSRData;
    return ssrData?.contentData || null;
  } catch (error) {
    console.error('Failed to parse SSR data:', error);
    return null;
  }
}

/**
 * Custom hook to fetch published content with graceful fallbacks
 * 
 * Loading hierarchy:
 * 1. SSR data (from server-side rendering)
 * 2. API (published content from database)
 * 3. localStorage (saved local changes)
 * 4. Static productData (bundled fallback)
 */
export const usePublishedContent = (options: UsePublishedContentOptions = {}) => {
  const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const {
    fallbackToLocalStorage = false,
    // In local dev (no SSR), prefer static content immediately to avoid empty UI until API loads
    fallbackToStatic = isLocalDev
  } = options;

  // use shared empty content

  // Prefer SSR content immediately to avoid any flash of static data during hydration
  const ssrInitData = (() => {
    const clientSSR = getSSRData();
    if (clientSSR) return clientSSR;
    try {
      if (typeof window === 'undefined' && typeof globalThis !== 'undefined') {
        return (globalThis as any).__SSR_CONTENT__ || null;
      }
    } catch {
      // no-op
    }
    return null;
  })();

  const [hasMounted, setHasMounted] = useState(false);
  
  const [state, setState] = useState<ContentState>({
    content: ssrInitData ?? (fallbackToStatic ? productData : createEmptyContent()),
    // If SSR data exists, mark loading true to revalidate in background; otherwise block stale flash
    loading: true,
    error: null,
    source: ssrInitData ? 'ssr' : (fallbackToStatic ? 'static' : null)
  });

  // Mount detection effect
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // Only run content loading after component has mounted
    if (!hasMounted) return;

    let isActive = true;

    // If SSR data exists, show it immediately but still revalidate in background
    const ssrData = getSSRData();
    if (ssrData) {
      console.log('Using SSR content data after mount (will revalidate)');
      setState({
        content: ssrData,
        loading: true, // keep loading true while we revalidate
        error: null,
        source: 'ssr'
      });
    } else {
      // Begin loading if no SSR available; avoid showing static fallback by default
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    const controller = new AbortController();

    const loadAndRevalidate = async () => {
      try {
        // Try to fetch published content from API with no-store to avoid cached responses
        const response = await fetch('/.netlify/functions/content-management?action=current', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          signal: controller.signal,
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.content_data) {
            if (!isActive) return;
            console.log('Loaded published content from API (revalidated)');
            setState({
              content: result.data.content_data,
              loading: false,
              error: null,
              source: 'api'
            });
            return;
          }
        }
      } catch (error) {
        if ((error as any)?.name !== 'AbortError') {
          console.error('Failed to fetch from API, trying fallbacks...', error);
        }
      }

      // Fallback to localStorage
      if (fallbackToLocalStorage) {
        const saved = localStorage.getItem('bibliokit-content');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (!isActive) return;
            console.log('Loaded content from localStorage');
            setState({
              content: parsed,
              loading: false,
              error: null,
              source: 'localStorage'
            });
            return;
          } catch (error) {
            console.error('Failed to load saved content:', error);
          }
        }
      }

      // Final fallback
      if (!isActive) return;
      if (fallbackToStatic) {
        console.log('Using static productData as fallback');
        setState({
          content: productData,
          loading: false,
          error: null,
          source: 'static'
        });
      } else {
        setState({
          content: createEmptyContent(),
          loading: false,
          error: 'No content source available',
          source: null
        });
      }
    };

    loadAndRevalidate();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [fallbackToLocalStorage, fallbackToStatic, hasMounted]);

  return state;
};