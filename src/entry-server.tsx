import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';
import { Router } from 'wouter';
import { generateMetadata as generateSEOMetadata, generateMetaTags, generateStructuredData } from './lib/seo';

// Server-side data fetching function
export async function fetchContentData(url: string): Promise<any> {
  try {
    // Extract path from URL
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    // For server-side rendering, we'll fetch content from the API
    // This will be called during edge function execution
    const apiUrl = `${urlObj.origin}/.netlify/functions/content-management?action=current`;

    // Force fresh data on SSR to avoid serving stale HTML
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });
    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data && result.data.content_data) {
        return result.data.content_data;
      }
    }
  } catch (error) {
    console.error('SSR: Failed to fetch content data:', error);
  }
  
  // Fallback to default content structure
  return {
    hero: {
      title: "Professional SaaS Software & Figma Plugins",
      subtitle: "Streamline your development workflow with secure API management and world-class support for designers and developers.",
      primaryButton: "Start Free Trial",
      secondaryButton: "View Products"
    },
    features: {
      title: "Everything you need to succeed",
      subtitle: "Comprehensive tools and services designed for modern development teams"
    },
    pricing: {
      title: "Simple, transparent pricing",
      subtitle: "Choose the plan that's right for your team"
    }
  };
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
  const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
  
  // Use the comprehensive SEO system
  const metadata = generateSEOMetadata(path, contentData, baseUrl);
  
  return {
    title: metadata.title,
    description: metadata.description,
    metaTags: generateMetaTags(metadata),
    structuredData: generateStructuredData(metadata)
  };
}