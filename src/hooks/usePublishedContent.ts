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
  source: 'api' | 'localStorage' | 'static' | null;
}

/**
 * Custom hook to fetch published content with graceful fallbacks
 * 
 * Loading hierarchy:
 * 1. API (published content from database)
 * 2. localStorage (saved local changes)
 * 3. Static productData (bundled fallback)
 */
export const usePublishedContent = (options: UsePublishedContentOptions = {}) => {
  const {
    fallbackToLocalStorage = true,
    fallbackToStatic = true
  } = options;

  const [state, setState] = useState<ContentState>({
    content: fallbackToStatic ? productData : null,
    loading: true,
    error: null,
    source: fallbackToStatic ? 'static' : null
  });

  useEffect(() => {
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
  }, [fallbackToLocalStorage, fallbackToStatic]);

  return state;
};