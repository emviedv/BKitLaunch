import productData from '../data/products.json' with { type: 'json' };
import { debugService } from './debugService.ts';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const debugEnabled = () => {
  if (typeof process !== 'undefined' && process.env?.DEBUG_FIX) {
    return process.env.DEBUG_FIX !== '0';
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_DEBUG_FIX) {
    return (import.meta as any).env.VITE_DEBUG_FIX !== '0';
  }
  return false;
};

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

/**
 * Returns the statically bundled content payload that previously came from the CMS.
 * Debug logging can be enabled by setting DEBUG_FIX=1 or VITE_DEBUG_FIX=1.
 */
export const loadPublishedContent = () => {
  const content = clone(productData);
  if (debugEnabled()) {
    console.debug('[cms-removal] loadPublishedContent returning bundled data', {
      keys: Object.keys(content ?? {}),
    });
  }
  if (heroDiagnosticsEnabled()) {
    debugService.debug('hero:loadPublishedContent-snapshot', {
      timestamp: new Date().toISOString(),
      heroTitle: content?.hero?.title,
      heroSubtitle: content?.hero?.subtitle,
      heroVisibleSetting: content?.settings?.visibility?.hero,
      heroFlagVisible: (content as any)?.hero?.visible,
      hasRootProduct: Boolean((content as any)?.product),
      productSlugs: content?.products ? Object.keys(content.products) : [],
      heroButtons: {
        primary: content?.hero?.primaryButton,
        primaryLink: content?.hero?.primaryButtonLink,
        secondary: content?.hero?.secondaryButton,
        secondaryLink: content?.hero?.secondaryButtonLink,
      },
    });
  }
  return content;
};
