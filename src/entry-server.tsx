import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';
import { Router } from 'wouter';
import { generateMetadata as generateSEOMetadata, generateMetaTags, generateStructuredData } from './lib/seo';
import { loadPublishedContent } from './lib/publishedContent';

const DEV_HOSTS = new Set(['localhost', '127.0.0.1']);

const normalizeOrigin = (raw?: string): string | null => {
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    try {
      return new URL(`https://${raw}`).origin;
    } catch {
      return null;
    }
  }
};

const collectHostRules = (raw?: string): string[] => {
  if (!raw) return [];
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((entry) => {
      if (entry.startsWith('*.')) {
        return entry.toLowerCase();
      }
      const origin = normalizeOrigin(entry);
      if (origin) {
        return new URL(origin).hostname.toLowerCase();
      }
      return entry.toLowerCase();
    });
};

const preferredOrigins = (() => {
  const origins = new Set<string>();
  const push = (value?: string) => {
    const origin = normalizeOrigin(value);
    if (origin) {
      origins.add(origin);
    }
  };
  push(process.env.SSR_CONTENT_BASE_URL);
  push(process.env.PUBLIC_SITE_URL);
  push(process.env.URL);
  push(process.env.DEPLOY_URL);
  return Array.from(origins);
})();

const allowedHostRules = (() => {
  const rules = new Set<string>();
  const addHosts = (value?: string) => {
    for (const host of collectHostRules(value)) {
      rules.add(host);
    }
  };
  addHosts(process.env.SSR_ALLOWED_HOSTS);
  addHosts(process.env.ALLOWED_ORIGINS);
  for (const origin of preferredOrigins) {
    try {
      rules.add(new URL(origin).hostname.toLowerCase());
    } catch {}
  }
  return Array.from(rules);
})();

const isHostAllowed = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase();
  if (DEV_HOSTS.has(normalized)) {
    return true;
  }
  if (allowedHostRules.length === 0) {
    return true;
  }
  return allowedHostRules.some((rule) => {
    if (rule.startsWith('*.')) {
      const suffix = rule.slice(1);
      return normalized === rule.substring(2) || normalized.endsWith(suffix);
    }
    return normalized === rule;
  });
};

const resolveTrustedOrigin = (urlObj: URL): string => {
  const hostname = urlObj.hostname.toLowerCase();
  if (DEV_HOSTS.has(hostname)) {
    return urlObj.origin;
  }
  if (isHostAllowed(hostname)) {
    return `${urlObj.protocol}//${urlObj.host}`;
  }
  for (const origin of preferredOrigins) {
    try {
      const parsed = new URL(origin);
      const parsedHost = parsed.hostname.toLowerCase();
      if (isHostAllowed(parsedHost)) {
        return parsed.origin;
      }
    } catch {}
  }
  throw new Error(`Untrusted request host for SSR content: ${hostname}`);
};

// Server-side data fetching function
export async function fetchContentData(_url: string): Promise<any> {
  return loadPublishedContent();
}

// Server-side render function
export function renderToString(url: string, contentData?: any): string {
  // Expose SSR content to hooks during server render to avoid static fallback
  const previousSSRContent = (globalThis as any).__SSR_CONTENT__;
  (globalThis as any).__SSR_CONTENT__ = contentData;

  // Provide a static location hook to Wouter during SSR to avoid accessing window
  const pathname = new URL(url).pathname;
  const makeStaticHook = (path: string) => () => [path, () => {}] as [string, (to: string) => void];

  // Render the app to string
  try {
    const html = ReactDOMServer.renderToString(
      <Router hook={makeStaticHook(pathname)}>
        <App />
      </Router>
    );
    return html;
  } finally {
    // Restore previous SSR content to avoid leaking across requests
    if (typeof previousSSRContent === 'undefined') {
      delete (globalThis as any).__SSR_CONTENT__;
    } else {
      (globalThis as any).__SSR_CONTENT__ = previousSSRContent;
    }
  }
}

// Generate page metadata based on route and content
export function generateMetadata(url: string, contentData: any): {
  title: string;
  description: string;
  metaTags: string;
  structuredData: string;
} {
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  const baseUrl = resolveTrustedOrigin(urlObj);
  
  // Use the comprehensive SEO system
  const metadata = generateSEOMetadata(path, contentData, baseUrl);
  
  return {
    title: metadata.title,
    description: metadata.description,
    metaTags: generateMetaTags(metadata),
    structuredData: generateStructuredData(metadata)
  };
}
