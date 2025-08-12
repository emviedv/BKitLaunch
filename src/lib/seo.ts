// SEO Metadata Management System

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any[];
}

export interface RouteMetadata {
  [path: string]: SEOMetadata;
}

// Default metadata for all pages
const defaultMetadata: SEOMetadata = {
  title: "BiblioKit - SaaS Software & Figma Plugins",
  description: "Professional SaaS software and Figma plugins with secure API management and world-class support.",
  keywords: "SaaS software, Figma plugins, API management, secure proxy, developer tools, design tools",
  ogType: "website",
  twitterCard: "summary_large_image"
};

// Route-specific metadata configurations
export const routeMetadata: RouteMetadata = {
  '/': {
    title: "BiblioKit - Professional SaaS Software & Figma Plugins",
    description: "Streamline your development workflow with secure API management and world-class support for designers and developers.",
    keywords: "SaaS software, Figma plugins, API management, developer tools, secure proxy, react components",
    ogTitle: "BiblioKit - Professional SaaS Software & Figma Plugins",
    ogDescription: "Streamline your development workflow with secure API management and comprehensive tools.",
    ogImage: "/og-home.jpg",
    twitterTitle: "BiblioKit - Professional SaaS Software & Figma Plugins",
    twitterDescription: "Streamline your development workflow with secure API management and comprehensive tools.",
    twitterImage: "/twitter-home.jpg",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BiblioKit",
        "description": "Professional SaaS software and Figma plugins with secure API management and world-class support.",
        "url": "https://bibliokit-launch.netlify.app",
        "logo": "https://bibliokit-launch.netlify.app/vite.svg",
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "hello@bibliokit.com",
          "contactType": "customer service"
        },
        "sameAs": [
          "https://twitter.com/bibliokit",
          "https://github.com/bibliokit"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "BiblioKit",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Plan",
            "price": "0",
            "priceCurrency": "USD",
            "description": "1,000 API requests/month, Basic Figma plugin support, Community support"
          },
          {
            "@type": "Offer",
            "name": "Pro Plan",
            "price": "29",
            "priceCurrency": "USD",
            "description": "50,000 API requests/month, Advanced Figma plugin features, Priority email support"
          }
        ]
      }
    ]
  },
  '/product': {
    title: "BiblioKit Product - Features & Benefits | SaaS Tools",
    description: "Explore BiblioKit's comprehensive feature set including secure API management, Figma plugin support, developer-first tools, and premium support options.",
    keywords: "BiblioKit features, API management tools, Figma plugin features, developer tools, SaaS features",
    ogTitle: "BiblioKit Product Features & Benefits",
    ogDescription: "Comprehensive SaaS tools for developers and designers with secure API management and premium support.",
    ogImage: "/og-product.jpg",
    twitterTitle: "BiblioKit Product Features",
    twitterDescription: "Comprehensive SaaS tools for developers and designers with secure API management.",
    twitterImage: "/twitter-product.jpg",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "BiblioKit",
        "description": "Professional SaaS software and Figma plugins with secure API management and world-class support.",
        "brand": {
          "@type": "Brand",
          "name": "BiblioKit"
        },
        "category": "Software",
        "offers": {
          "@type": "AggregateOffer",
          "lowPrice": "0",
          "highPrice": "29",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  },
  '/admin': {
    title: "BiblioKit Admin Dashboard - Content Management",
    description: "Manage your BiblioKit content, settings, and configurations through the admin dashboard.",
    keywords: "BiblioKit admin, content management, dashboard, CMS",
    ogTitle: "BiblioKit Admin Dashboard",
    ogDescription: "Manage your BiblioKit content and settings.",
    ogType: "website"
  }
};

// Generate metadata for a given route with content data
export function generateMetadata(
  path: string, 
  contentData?: any, 
  baseUrl: string = 'https://bibliokit-launch.netlify.app'
): SEOMetadata {
  // Get route-specific metadata or use default
  const routeData = routeMetadata[path] || {};
  
  // Start with default metadata
  let metadata: SEOMetadata = { ...defaultMetadata, ...routeData };
  
  // Override with dynamic content data if available
  if (contentData) {
    switch (path) {
      case '/':
        if (contentData.hero) {
          metadata.title = contentData.hero.title || metadata.title;
          metadata.description = contentData.hero.subtitle || metadata.description;
          metadata.ogTitle = contentData.hero.title || metadata.ogTitle;
          metadata.ogDescription = contentData.hero.subtitle || metadata.ogDescription;
          metadata.twitterTitle = contentData.hero.title || metadata.twitterTitle;
          metadata.twitterDescription = contentData.hero.subtitle || metadata.twitterDescription;
        }
        break;
      case '/product':
        if (contentData.features?.title) {
          metadata.title = `${contentData.features.title} | BiblioKit`;
        }
        if (contentData.features?.subtitle) {
          metadata.description = contentData.features.subtitle;
        }
        break;
    }
  }
  
  // Ensure absolute URLs for social media
  if (metadata.ogImage && !metadata.ogImage.startsWith('http')) {
    metadata.ogImage = `${baseUrl}${metadata.ogImage}`;
  }
  if (metadata.twitterImage && !metadata.twitterImage.startsWith('http')) {
    metadata.twitterImage = `${baseUrl}${metadata.twitterImage}`;
  }
  
  // Set canonical URL
  metadata.canonical = `${baseUrl}${path}`;
  
  return metadata;
}

// Generate HTML meta tags from metadata
export function generateMetaTags(metadata: SEOMetadata): string {
  const tags: string[] = [];
  
  // Basic meta tags
  tags.push(`<title>${escapeHtml(metadata.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeHtml(metadata.description)}" />`);
  
  if (metadata.keywords) {
    tags.push(`<meta name="keywords" content="${escapeHtml(metadata.keywords)}" />`);
  }
  
  if (metadata.canonical) {
    tags.push(`<link rel="canonical" href="${escapeHtml(metadata.canonical)}" />`);
  }
  
  // Open Graph tags
  tags.push(`<meta property="og:title" content="${escapeHtml(metadata.ogTitle || metadata.title)}" />`);
  tags.push(`<meta property="og:description" content="${escapeHtml(metadata.ogDescription || metadata.description)}" />`);
  tags.push(`<meta property="og:type" content="${escapeHtml(metadata.ogType || 'website')}" />`);
  tags.push(`<meta property="og:url" content="${escapeHtml(metadata.canonical || '')}" />`);
  
  if (metadata.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(metadata.ogImage)}" />`);
  }
  
  // Twitter Card tags
  tags.push(`<meta name="twitter:card" content="${escapeHtml(metadata.twitterCard || 'summary_large_image')}" />`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(metadata.twitterTitle || metadata.title)}" />`);
  tags.push(`<meta name="twitter:description" content="${escapeHtml(metadata.twitterDescription || metadata.description)}" />`);
  
  if (metadata.twitterImage) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(metadata.twitterImage)}" />`);
  }
  
  return tags.join('\n    ');
}

// Generate structured data JSON-LD scripts
export function generateStructuredData(metadata: SEOMetadata): string {
  if (!metadata.structuredData || metadata.structuredData.length === 0) {
    return '';
  }
  
  return metadata.structuredData
    .map(data => `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`)
    .join('\n    ');
}

// Utility function to escape HTML
function escapeHtml(text: string): string {
  const div = typeof document !== 'undefined' 
    ? document.createElement('div') 
    : null;
    
  if (div) {
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Fallback for server-side
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Client-side function to update page metadata
export function updatePageMetadata(metadata: SEOMetadata): void {
  if (typeof document === 'undefined') return;
  
  // Update title
  document.title = metadata.title;
  
  // Update or create meta tags
  const metaSelectors = [
    { selector: 'meta[name="description"]', content: metadata.description },
    { selector: 'meta[name="keywords"]', content: metadata.keywords },
    { selector: 'meta[property="og:title"]', content: metadata.ogTitle || metadata.title },
    { selector: 'meta[property="og:description"]', content: metadata.ogDescription || metadata.description },
    { selector: 'meta[property="og:image"]', content: metadata.ogImage },
    { selector: 'meta[name="twitter:title"]', content: metadata.twitterTitle || metadata.title },
    { selector: 'meta[name="twitter:description"]', content: metadata.twitterDescription || metadata.description },
    { selector: 'meta[name="twitter:image"]', content: metadata.twitterImage }
  ];
  
  metaSelectors.forEach(({ selector, content }) => {
    if (!content) return;
    
    let element = document.querySelector(selector) as HTMLMetaElement;
    if (element) {
      element.content = content;
    } else {
      element = document.createElement('meta');
      const [, attr, value] = selector.match(/\[(.+?)="(.+?)"\]/) || [];
      if (attr && value) {
        element.setAttribute(attr, value);
        element.content = content;
        document.head.appendChild(element);
      }
    }
  });
  
  // Update canonical link
  if (metadata.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = metadata.canonical;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = metadata.canonical;
      document.head.appendChild(canonical);
    }
  }
}