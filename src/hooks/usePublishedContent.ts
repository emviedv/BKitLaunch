import { useState, useEffect } from 'react';
import productData from '@/data/products.json';

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
  const {
    fallbackToLocalStorage = true,
    fallbackToStatic = true
  } = options;

  const [hasMounted, setHasMounted] = useState(false);
  
  const [state, setState] = useState<ContentState>({
    content: fallbackToStatic ? productData : null,
    loading: false, // Never show loading during initial hydration
    error: null,
    source: fallbackToStatic ? 'static' : null
  });

  // Mount detection effect
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    // Only run content loading after component has mounted
    if (!hasMounted) return;
    
    // Check for SSR data first after mount
    const ssrData = getSSRData();
    if (ssrData) {
      console.log('Using SSR content data after mount');
      setState({
        content: ssrData,
        loading: false,
        error: null,
        source: 'ssr'
      });
      return;
    }

    const loadContent = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        // First, try to fetch published content from API
        const response = await fetch('/.netlify/functions/content-management?action=current');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.content_data) {
            console.log('Loaded published content from API');
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
        console.error('Failed to fetch from API, trying fallbacks...', error);
      }

      // Fallback to localStorage
      if (fallbackToLocalStorage) {
        const saved = localStorage.getItem('bibliokit-content');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
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

      // Final fallback to static data
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
          content: null,
          loading: false,
          error: 'No content source available',
          source: null
        });
      }
    };

    loadContent();
  }, [fallbackToLocalStorage, fallbackToStatic, hasMounted]);

  return state;
};