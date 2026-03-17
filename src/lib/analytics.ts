/**
 * analytics.ts — Centralized PostHog wrapper
 *
 * All PostHog interaction goes through this module.
 * Components never touch window.posthog directly.
 */

import { ROUTE_PATHS } from '@/config/routes';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Typed event names for PostHog custom events */
export const AnalyticsEvent = {
  CTA_CLICK: 'cta_click',
  EXTERNAL_LINK_CLICK: 'external_link_click',
  WAITLIST_FORM_VIEWED: 'waitlist_form_viewed',
  WAITLIST_FORM_STARTED: 'waitlist_form_started',
  WAITLIST_FORM_SUBMITTED: 'waitlist_form_submitted',
  WAITLIST_FORM_SUCCESS: 'waitlist_form_success',
  WAITLIST_FORM_ERROR: 'waitlist_form_error',
  BLOG_POST_VIEW: 'blog_post_view',
  USE_CASE_VIEW: 'use_case_view',
  GLOSSARY_TERM_VIEW: 'glossary_term_view',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

export interface PageViewProps {
  page_type: string;
  product_slug?: string;
  content_slug?: string;
  referrer?: string;
}

export interface CTAClickProps {
  product_slug: string;
  cta_position: string;
  destination_url: string;
}

// ---------------------------------------------------------------------------
// PostHog safe accessor (SSR-safe)
// ---------------------------------------------------------------------------

/** Returns the posthog global or null when unavailable (SSR, blocked, etc.) */
function getPostHog(): any | null {
  if (typeof window === 'undefined') return null;
  return (window as any).posthog ?? null;
}

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

const POSTHOG_KEY_FALLBACK = 'phc_xR0jG1Uj4v7DMFULTIhDe6sr8cQTwBVOfPi88b4gbWM';

function getPostHogKey(): string {
  try {
    const envKey = import.meta.env.VITE_POSTHOG_KEY;
    return envKey || POSTHOG_KEY_FALLBACK;
  } catch {
    return POSTHOG_KEY_FALLBACK;
  }
}

/** True when we should fire analytics (browser, prod host, not admin, PH loaded) */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  const isProd = host !== 'localhost' && host !== '127.0.0.1';
  const isAdmin = window.location.pathname.startsWith('/admin');
  // Allow ?analytics=1 override in non-prod for testing
  const forceEnabled = new URLSearchParams(window.location.search).get('analytics') === '1';
  return (isProd || forceEnabled) && !isAdmin;
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

let _initialized = false;

/** Initialize PostHog with improved config. Safe to call multiple times. */
export function initAnalytics(): void {
  if (_initialized) return;
  if (typeof window === 'undefined') return;
  if (!isAnalyticsEnabled()) return;

  const ph = getPostHog();
  if (!ph || typeof ph.init !== 'function') return;

  ph.init(getPostHogKey(), {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: {
      css_selector_allowlist: [
        '[data-ph-capture-attribute]',
        'button',
        'a[href*="figma.com"]',
      ],
    },
    session_recording: {
      maskAllInputs: true,
    },
    property_denylist: ['$ip'],
  });

  _initialized = true;
  console.log('[Analytics] PostHog initialized');
}

// ---------------------------------------------------------------------------
// Page classification
// ---------------------------------------------------------------------------

interface PageClassification {
  page_type: string;
  product_slug?: string;
  content_slug?: string;
}

const ROUTE_TO_PRODUCT: Record<string, string> = {
  [ROUTE_PATHS.BIBLIO_RENAME]: 'rename-variants-ai',
  [ROUTE_PATHS.BIBLIO_AUDIT]: 'component-qa',
  [ROUTE_PATHS.BIBLIO_CLEAN]: 'biblio-clean',
  [ROUTE_PATHS.BIBLIO_TABLE]: 'fix-table',
  [ROUTE_PATHS.BIBLIO_STATES]: 'state-builder',
  [ROUTE_PATHS.BIBLIO_ORGANIZE]: 'organize-file',
  [ROUTE_PATHS.SCALE_RESIZER]: 'scale-resizer',
  [ROUTE_PATHS.UXBIBLIO]: 'uxbiblio',
};

const STATIC_PAGE_TYPES: Record<string, string> = {
  [ROUTE_PATHS.HOME]: 'landing',
  [ROUTE_PATHS.ABOUT]: 'about',
  [ROUTE_PATHS.PRODUCTS]: 'products',
  [ROUTE_PATHS.DOCS]: 'docs',
  [ROUTE_PATHS.BLOG]: 'blog',
  [ROUTE_PATHS.RESOURCES]: 'resources',
  [ROUTE_PATHS.LEARN]: 'learn',
  [ROUTE_PATHS.TUTORIALS]: 'tutorial',
  [ROUTE_PATHS.USE_CASES]: 'use_cases_index',
  [ROUTE_PATHS.PERSONAS]: 'personas_index',
  [ROUTE_PATHS.GLOSSARY]: 'glossary_index',
  [ROUTE_PATHS.ADMIN]: 'admin',
};

export function classifyPageType(path: string): PageClassification {
  const normalizedPath = (path || '/').split('?')[0].replace(/\/+$/, '') || '/';

  // Product pages
  if (ROUTE_TO_PRODUCT[normalizedPath]) {
    return { page_type: 'product', product_slug: ROUTE_TO_PRODUCT[normalizedPath] };
  }

  // Static pages
  if (STATIC_PAGE_TYPES[normalizedPath]) {
    return { page_type: STATIC_PAGE_TYPES[normalizedPath] };
  }

  // Dynamic content routes
  if (normalizedPath.startsWith('/blog/')) {
    return { page_type: 'blog_article', content_slug: normalizedPath.replace('/blog/', '') };
  }
  if (normalizedPath.startsWith('/use-cases/')) {
    return { page_type: 'use_case', content_slug: normalizedPath.replace('/use-cases/', '') };
  }
  if (normalizedPath.startsWith('/glossary/')) {
    return { page_type: 'glossary', content_slug: normalizedPath.replace('/glossary/', '') };
  }
  if (normalizedPath.startsWith('/for/')) {
    return { page_type: 'persona', content_slug: normalizedPath.replace('/for/', '') };
  }
  if (normalizedPath.startsWith('/learn/')) {
    return { page_type: 'learn', content_slug: normalizedPath.replace('/learn/', '') };
  }

  return { page_type: 'other' };
}

// ---------------------------------------------------------------------------
// Tracking helpers
// ---------------------------------------------------------------------------

/** Fire a manual $pageview with enriched properties */
export function trackPageView(props: PageViewProps): void {
  if (!isAnalyticsEnabled()) return;
  const ph = getPostHog();
  if (!ph) return;

  ph.capture('$pageview', {
    ...props,
    $current_url: window.location.href,
  });
}

/** Fire a typed custom event */
export function trackEvent(name: AnalyticsEventName | string, props?: Record<string, unknown>): void {
  if (!isAnalyticsEnabled()) return;
  const ph = getPostHog();
  if (!ph) return;

  ph.capture(name, props);
}

/** Fire a CTA click event (product page "Try Free" buttons) */
export function trackCTAClick(props: CTAClickProps): void {
  trackEvent(AnalyticsEvent.CTA_CLICK, { ...props });
}

/** Identify user by email (e.g. after waitlist signup) */
export function identifyUser(email: string): void {
  if (!isAnalyticsEnabled()) return;
  const ph = getPostHog();
  if (!ph) return;

  ph.identify(email);
}

// ---------------------------------------------------------------------------
// UTM capture
// ---------------------------------------------------------------------------

/** Parse UTM params from the current URL and register as super properties */
export function captureUTMParams(): void {
  if (!isAnalyticsEnabled()) return;
  if (typeof window === 'undefined') return;
  const ph = getPostHog();
  if (!ph) return;

  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
  const utms: Record<string, string> = {};

  for (const key of utmKeys) {
    const value = params.get(key);
    if (value) utms[key] = value;
  }

  if (Object.keys(utms).length > 0) {
    ph.register_once(utms);
    console.log('[Analytics] UTM params captured', utms);
  }
}
