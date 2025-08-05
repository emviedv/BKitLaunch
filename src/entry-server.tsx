import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';
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
    
    const response = await fetch(apiUrl);
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
      subtitle: "Streamline your development workflow with secure API management, comprehensive documentation, and world-class support for designers and developers.",
      primaryButton: "Start Free Trial",
      secondaryButton: "View Documentation"
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
  // Create a context for SSR
  const ssrContext = {
    url,
    contentData
  };
  
  // Render the app to string
  const html = ReactDOMServer.renderToString(
    <App />
  );
  
  return html;
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