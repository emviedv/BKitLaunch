// SEO Metadata Management System
import { findBlogPostBySlug, type BlogPost } from '@/data/blogPosts';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  googlebot?: string;
  bingbot?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: string;
  siteName?: string;
  locale?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterImageAlt?: string;
  webPageType?: string;
  structuredData?: any[];
}

export interface RouteMetadata {
  [path: string]: SEOMetadata;
}

type StructuredDataEntry = Record<string, any>;

interface StructuredDataMergeParams {
  baseUrl: string;
  path: string;
  metadata: SEOMetadata;
  contentData?: any;
}

const CANONICAL_HTTPS_HOSTS = new Set(['bibliokit.com', 'www.bibliokit.com']);

const normalizeCanonicalBaseUrl = (baseUrl: string): string => {
  if (!baseUrl) return baseUrl;
  try {
    const parsed = new URL(baseUrl);
    const hostname = parsed.hostname.toLowerCase();
    if (CANONICAL_HTTPS_HOSTS.has(hostname)) {
      return `https://${parsed.host}`;
    }
    return parsed.origin;
  } catch {
    return baseUrl;
  }
};

const extractBlogSlug = (path: string): string | null => {
  const match = path.replace(/\/+$/, '').match(/^\/blog\/([^/]+)/);
  return match?.[1] || null;
};

const isBlogPostData = (value: any): value is BlogPost =>
  Boolean(
    value &&
    typeof value === 'object' &&
    typeof value.slug === 'string' &&
    typeof value.title === 'string'
  );

const resolveBlogContent = (path: string, contentData?: any): BlogPost | undefined => {
  if (!path.startsWith('/blog/')) return undefined;

  const inlinePost = isBlogPostData(contentData) ? contentData : undefined;
  const slugFromPath = extractBlogSlug(path);
  if (inlinePost && (!slugFromPath || inlinePost.slug === slugFromPath)) {
    return inlinePost;
  }

  if (slugFromPath) {
    return findBlogPostBySlug(slugFromPath);
  }

  return undefined;
};

const normalizeDateValue = (value?: string | number | Date | null): string | undefined => {
  if (value === null || value === undefined) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().split('T')[0];
};

const resolveArticleDates = (post?: BlogPost | null) => {
  if (!post) {
    return { published: undefined, modified: undefined };
  }
  const modified = normalizeDateValue((post as any)?.lastUpdated ?? (post as any)?.updatedAt);
  const published = normalizeDateValue((post as any)?.publishedAt) || modified;
  return { published, modified };
};

const resolveNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const resolvePluginRating = (contentData?: any) => {
  const fallbackRatingValue = 4.8;
  const fallbackReviewCount = 120;

  const ratingSource =
    (contentData as any)?.metrics?.pluginRating?.ratingValue ??
    (contentData as any)?.pluginRating?.ratingValue ??
    (typeof process !== 'undefined' ? process.env?.PLUGIN_RATING : undefined) ??
    (typeof import.meta !== 'undefined' ? (import.meta as any)?.env?.VITE_PLUGIN_RATING : undefined);

  const reviewSource =
    (contentData as any)?.metrics?.pluginRating?.reviewCount ??
    (contentData as any)?.pluginRating?.reviewCount ??
    (typeof process !== 'undefined' ? process.env?.PLUGIN_REVIEW_COUNT : undefined) ??
    (typeof import.meta !== 'undefined' ? (import.meta as any)?.env?.VITE_PLUGIN_REVIEW_COUNT : undefined);

  const ratingValue = resolveNumber(ratingSource);
  const reviewCount = resolveNumber(reviewSource);

  return {
    ratingValue: ratingValue && ratingValue > 0 ? Math.min(ratingValue, 5) : fallbackRatingValue,
    reviewCount: reviewCount && reviewCount > 0 ? Math.round(reviewCount) : fallbackReviewCount,
  };
};

const mergeKeywords = (base?: string, additions: Array<string | undefined> = []): string | undefined => {
  const set = new Set(resolveKeywords(base));
  additions.forEach((value) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      set.add(value.trim());
    }
  });
  return set.size ? Array.from(set).join(', ') : undefined;
};

// Default metadata for all pages
const defaultMetadata: SEOMetadata = {
  title: "BiblioKit - Suite of Figma Plugins & DesignOps Tools",
  description: "BiblioKit speeds Figma work for designers, developers, and marketers. Automate audits, renaming, cleanup, and setup to ship faster.",
  keywords: "clean Figma files, resize frames, design system audit, Figma layer renaming, AI rename variants, prototype cleanup, design handoff, predictive eye tracking figma, attention heatmaps, bulk resize ads, figma governance tool, design ops automation, BiblioKit",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  googlebot: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  bingbot: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  ogType: "website",
  siteName: "BiblioKit",
  locale: "en_US",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: "summary_large_image",
  structuredData: []
};

const biblioRenameMetadata: SEOMetadata = {
  title: 'Optimize Figma Designs with AI (BiblioRename) | BiblioKit',
  description: 'BiblioRename standardizes variant and layer names for designers, developers, and marketers. Batch-rename with AI rules so handoff stays clean.',
  keywords: 'BiblioRename, AI rename variants, Figma naming plugin, design system architecture, component health, structural validation, figma limits',
  ogTitle: 'Optimize Figma Designs with AI (BiblioRename) | BiblioKit',
  ogDescription: 'BiblioRename standardizes variant and layer names for designers, developers, and marketers. Batch-rename with AI rules so handoff stays clean.',
  ogImage: '/og/og-default.svg',
  twitterTitle: 'Optimize Figma Designs with AI (BiblioRename) | BiblioKit',
  twitterDescription: 'BiblioRename standardizes variant and layer names for designers, developers, and marketers. Batch-rename with AI rules so handoff stays clean.',
  twitterImage: '/og/og-default.svg'
};

const biblioTableMetadata: SEOMetadata = {
  title: 'BiblioTable: One-Click Figma Table Normalization in 2025',
  description: 'BiblioTable fixes Figma tables for designers, developers, and marketers. Normalize widths and strip layout bugs so data stays readable.',
  keywords: 'BiblioTable, figma table plugin, auto-layout tables, figma columns, zebra striping, design ops, figma automation',
  ogTitle: 'BiblioTable: One-Click Figma Table Normalization in 2025',
  ogDescription: 'BiblioTable fixes Figma tables for designers, developers, and marketers. Normalize widths and strip layout bugs so data stays readable.',
  ogImage: '/og/og-default.svg',
  twitterTitle: 'BiblioTable: One-Click Figma Table Normalization in 2025',
  twitterDescription: 'BiblioTable fixes Figma tables for designers, developers, and marketers. Normalize widths and strip layout bugs so data stays readable.',
  twitterImage: '/og/og-default.svg'
};

const biblioAuditMetadata: SEOMetadata = {
  title: 'BiblioAudit: Figma Design System Check & Issue Finder',
  description: 'BiblioAudit scans Figma files for drift so designers, developers, and marketers stay aligned. Catch detached instances and token issues before handoff.',
  keywords: 'BiblioAudit, design system audit, figma qa, detached instances, token validation, figma plugin, design ops',
  ogTitle: 'BiblioAudit: Figma Design System Check & Issue Finder',
  ogDescription: 'BiblioAudit scans Figma files for drift so designers, developers, and marketers stay aligned. Catch detached instances and token issues before handoff.',
  ogImage: '/og/og-default.svg',
  twitterTitle: 'BiblioAudit: Figma Design System Check & Issue Finder',
  twitterDescription: 'BiblioAudit scans Figma files for drift so designers, developers, and marketers stay aligned. Catch detached instances and token issues before handoff.',
  twitterImage: '/og/og-default.svg'
};

const biblioCleanMetadata: SEOMetadata = {
  title: 'BiblioClean: Remove Figma Prototype Links Safely (Free)',
  description: 'BiblioClean removes Figma prototype links safely for designers, developers, and marketers. Revoke stale URLs and share the right build fast.',
  keywords: 'BiblioClean, remove prototype link, figma prototype cleanup, revoke share links, design system safety, figma plugin, design ops',
  ogTitle: 'BiblioClean: Remove Figma Prototype Links Safely (Free)',
  ogDescription: 'BiblioClean removes Figma prototype links safely for designers, developers, and marketers. Revoke stale URLs and share the right build fast.',
  ogImage: '/og/og-default.svg',
  twitterTitle: 'BiblioClean: Remove Figma Prototype Links Safely (Free)',
  twitterDescription: 'BiblioClean removes Figma prototype links safely for designers, developers, and marketers. Revoke stale URLs and share the right build fast.',
  twitterImage: '/og/og-default.svg'
};

const aiRenameVariantsMetadata: SEOMetadata = {
  title: 'BiblioRename Legacy URL | BiblioKit',
  description: 'BiblioRename lives at /biblio-rename for designers, developers, and marketers. Use the canonical URL to batch-rename variants with AI.',
  robots: 'noindex, follow',
  googlebot: 'noindex, follow',
  bingbot: 'noindex, follow',
  ogTitle: 'BiblioRename Legacy URL | BiblioKit',
  ogDescription: 'BiblioRename lives at /biblio-rename for designers, developers, and marketers. Use the canonical URL to batch-rename variants with AI.',
  ogImage: '/og/og-default.svg',
  twitterTitle: 'BiblioRename Legacy URL | BiblioKit',
  twitterDescription: 'BiblioRename lives at /biblio-rename for designers, developers, and marketers. Use the canonical URL to batch-rename variants with AI.',
  twitterImage: '/og/og-default.svg'
};

// Route-specific metadata configurations
export const routeMetadata: RouteMetadata = {
  '/': {
    title: 'BiblioKit: Figma Plugins for Streamlined Design Workflows',
    description: "BiblioKit speeds Figma shipping for designers, developers, and marketers. Join the beta to automate audits, renaming, cleanup, and launch faster.",
    keywords: "clean Figma files, resize frames, design system audit, Figma layer renaming, AI rename variants, prototype cleanup, design handoff, predictive eye tracking figma, attention heatmaps, bulk resize ads, figma governance tool, design ops automation, BiblioKit",
    ogTitle: 'BiblioKit: Figma Plugins for Streamlined Design Workflows',
    ogDescription: "BiblioKit speeds Figma shipping for designers, developers, and marketers. Join the beta to automate audits, renaming, cleanup, and launch faster.",
    ogImage: "/og/og-default.svg",
    twitterTitle: 'BiblioKit: Figma Plugins for Streamlined Design Workflows',
    twitterDescription: "BiblioKit speeds Figma shipping for designers, developers, and marketers. Join the beta to automate audits, renaming, cleanup, and launch faster.",
    twitterImage: "/og/og-default.svg",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": "https://www.bibliokit.com/#webapplication",
        "name": "BiblioKit",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "url": "https://www.bibliokit.com",
        "inLanguage": "en-US",
        "publisher": {
          "@type": "Organization",
          "@id": "https://www.bibliokit.com/#organization",
          "name": "BiblioKit"
        },
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Plan",
            "price": 0,
            "priceCurrency": "USD",
            "description": "1,000 API requests/month, Basic Figma plugin support, Community support"
          },
          {
            "@type": "Offer",
            "name": "Pro Plan",
            "price": 29,
            "priceCurrency": "USD",
            "description": "50,000 API requests/month, Advanced Figma plugin features, Priority email support"
          }
        ]
      }
    ]
  },
  '/docs': {
    title: 'BiblioKit Docs | Setup Guides & API Reference',
    description: 'BiblioKit docs get designers, developers, and marketers live fast. Follow setup steps and API guidance to launch plugins with confidence.',
    keywords: 'BiblioKit docs, setup guide, API reference, plugin tutorials, design ops',
    ogTitle: 'BiblioKit Docs | Setup Guides & API Reference',
    ogDescription: 'BiblioKit docs get designers, developers, and marketers live fast. Follow setup steps and API guidance to launch plugins with confidence.',
    ogImage: '/og/og-default.svg',
    twitterTitle: 'BiblioKit Docs | Setup Guides & API Reference',
    twitterDescription: 'BiblioKit docs get designers, developers, and marketers live fast. Follow setup steps and API guidance to launch plugins with confidence.',
    twitterImage: '/og/og-default.svg'
  },
  '/about': {
    title: 'About BiblioKit | The Future of Figma DesignOps & AI Workflows',
    description: 'Discover BiblioKit, the ultimate suite of Figma plugins for DesignOps. Learn how our AI-powered tools eliminate manual maintenance and bridge the gap from design to dev.',
    keywords: 'BiblioKit, Figma plugins, DesignOps tools, AI refactoring for design, UX intelligence, design-to-dev workflow, UI automation, Figma productivity',
    ogTitle: 'About BiblioKit | The Future of Figma DesignOps & AI Workflows',
    ogDescription: 'Discover BiblioKit, the ultimate suite of Figma plugins for DesignOps. Learn how our AI-powered tools eliminate manual maintenance and bridge the gap from design to dev.',
    ogImage: '/og/og-default.svg',
    twitterTitle: 'About BiblioKit | The Future of Figma DesignOps & AI Workflows',
    twitterDescription: 'Discover BiblioKit, the ultimate suite of Figma plugins for DesignOps. Learn how our AI-powered tools eliminate manual maintenance and bridge the gap from design to dev.',
    twitterImage: '/og/og-default.svg',
    webPageType: 'AboutPage',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About BiblioKit",
        "description": "Discover BiblioKit, the ultimate suite of Figma plugins for DesignOps. Learn how our AI-powered tools eliminate manual maintenance and bridge the gap from design to dev.",
        "url": "https://www.bibliokit.com/about",
        "mainEntity": {
          "@type": ["Organization", "Corporation"],
          "additionalType": "https://schema.org/SoftwareCompany",
          "name": "BiblioKit",
          "description": "BiblioKit is a unified suite of Figma plugins designed for the modern DesignOps era. We build tools that bridge the gap between creative vision and technical execution.",
          "url": "https://www.bibliokit.com",
          "industry": "Software Development",
          "slogan": "Empowering designers to spend more time creating and less time maintaining"
        }
      }
    ]
  },
  '/resources': {
    title: 'BiblioKit Resources: Figma Plugins & Design Tools (404)',
    description: "BiblioKit resources help designers, developers, and marketers ship faster in Figma. Grab playbooks to clean links, audit systems, and move quicker.",
    keywords: 'BiblioKit resources, BiblioClean, Figma cleanup, design ops resources, Figma plugins',
    ogTitle: 'BiblioKit Resources: Figma Plugins & Design Tools (404)',
    ogDescription: "BiblioKit resources help designers, developers, and marketers ship faster in Figma. Grab playbooks to clean links, audit systems, and move quicker.",
    ogImage: '/og/og-default.svg',
    twitterTitle: 'BiblioKit Resources: Figma Plugins & Design Tools (404)',
    twitterDescription: "BiblioKit resources help designers, developers, and marketers ship faster in Figma. Grab playbooks to clean links, audit systems, and move quicker.",
    twitterImage: '/og/og-default.svg'
  },
  '/admin': {
    title: "BiblioKit Admin Dashboard - Content Management",
    description: "Manage your BiblioKit content, settings, and configurations through the admin dashboard.",
    keywords: "BiblioKit admin, content management, dashboard, CMS",
    ogTitle: "BiblioKit Admin Dashboard",
    ogDescription: "Manage your BiblioKit content and settings.",
    ogType: "website"
  },
  '/resources/remove-prototype-link': {
    title: 'BiblioKit: Remove Figma Prototype Links for Better Design',
    description: 'BiblioKit helps designers, developers, and marketers revoke stale prototype links. Follow the cleanup steps to replace URLs and keep reviews on track.',
    keywords: 'remove prototype link, figma prototype cleanup, revoke share links, design ops hygiene, prototype handoff',
    ogTitle: 'BiblioKit: Remove Figma Prototype Links for Better Design',
    ogDescription: 'BiblioKit helps designers, developers, and marketers revoke stale prototype links. Follow the cleanup steps to replace URLs and keep reviews on track.',
    ogImage: '/og/og-default.svg',
    twitterTitle: 'BiblioKit: Remove Figma Prototype Links for Better Design',
    twitterDescription: 'BiblioKit helps designers, developers, and marketers revoke stale prototype links. Follow the cleanup steps to replace URLs and keep reviews on track.',
    twitterImage: '/og/og-default.svg',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Remove Prototype Link",
        "description": "Step-by-step workflow for designers to revoke outdated prototype URLs and replace them with the correct build.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Collect prototype links",
            "text": "Paste an individual Figma prototype URL or upload a list exported from analytics."
          },
          {
            "@type": "HowToStep",
            "name": "Review context",
            "text": "Confirm the source file, owner, and recent viewers before removing the link."
          },
          {
            "@type": "HowToStep",
            "name": "Revoke & share again",
            "text": "Deactivate the stale token, generate a new handoff, and notify collaborators."
          }
        ]
      }
    ]
  },
  '/biblio-rename': biblioRenameMetadata,
  '/biblio-clean': biblioCleanMetadata,
  '/biblio-audit': biblioAuditMetadata,
  '/biblio-table': biblioTableMetadata,
  '/ai-rename-variants': aiRenameVariantsMetadata,
  '/uxbiblio': {
    title: 'UXBiblio: AI UX Patterns by BiblioKit - Discover & Organize',
    description: 'UXBiblio organizes UX patterns for designers, developers, and marketers. Capture flows, tag insights, and reuse proven UI faster.',
    keywords: 'UXBiblio, UX pattern library, design inspiration, AI tagging, UX research repository',
    ogTitle: 'UXBiblio: AI UX Patterns by BiblioKit - Discover & Organize',
    ogDescription: 'UXBiblio organizes UX patterns for designers, developers, and marketers. Capture flows, tag insights, and reuse proven UI faster.',
    ogImage: '/og/og-default.svg',
    twitterTitle: 'UXBiblio: AI UX Patterns by BiblioKit - Discover & Organize',
    twitterDescription: 'UXBiblio organizes UX patterns for designers, developers, and marketers. Capture flows, tag insights, and reuse proven UI faster.',
    twitterImage: '/og/og-default.svg'
  },
  '/blog': {
    title: 'BiblioKit Blog: Design Tips and Figma Workflows for 2025',
    description: 'BiblioKit Blog shares Figma playbooks for designers, developers, and marketers. Read step-by-step workflows to ship cleaner systems faster.',
    keywords: 'design ops blog, figma workflow tips, prototype cleanup, design system rituals, bibliokit blog, real-world figma fixes',
    ogTitle: 'BiblioKit Blog: Design Tips and Figma Workflows for 2025',
    ogDescription: 'BiblioKit Blog shares Figma playbooks for designers, developers, and marketers. Read step-by-step workflows to ship cleaner systems faster.',
    ogImage: '/og/og-default.svg',
    twitterTitle: 'BiblioKit Blog: Design Tips and Figma Workflows for 2025',
    twitterDescription: 'BiblioKit Blog shares Figma playbooks for designers, developers, and marketers. Read step-by-step workflows to ship cleaner systems faster.',
    twitterImage: '/og/og-default.svg'
  }
};

// Generate metadata for a given route with content data
export function generateMetadata(
  path: string, 
  contentData?: any, 
  baseUrl: string = 'https://www.bibliokit.com'
): SEOMetadata {
  baseUrl = normalizeCanonicalBaseUrl(baseUrl);
  const normalizedPath = path ? path.split('?')[0] : '/';
  const normalizedPathNoTrailingSlash = (normalizedPath || '/').replace(/\/+$/, '') || '/';
  const isBlogArticle = normalizedPathNoTrailingSlash.startsWith('/blog/') && normalizedPathNoTrailingSlash !== '/blog';
  const matchedRouteKey = routeMetadata[normalizedPathNoTrailingSlash]
    ? normalizedPathNoTrailingSlash
    : isBlogArticle
      ? '/blog'
      : normalizedPathNoTrailingSlash;
  const blogContent = isBlogArticle ? resolveBlogContent(normalizedPathNoTrailingSlash, contentData) : undefined;
  const isMissingBlog = isBlogArticle && !blogContent;

  // Get route-specific metadata or use default
  const routeData = routeMetadata[matchedRouteKey] || {};
  
  // Start with default metadata
  let metadata: SEOMetadata = {
    ...defaultMetadata,
    ...routeData,
    structuredData: Array.isArray(routeData.structuredData)
      ? [...routeData.structuredData]
      : Array.isArray(defaultMetadata.structuredData)
        ? [...defaultMetadata.structuredData!]
        : []
  };

  if (isMissingBlog) {
    metadata.title = 'Article not found | BiblioKit';
    metadata.description =
      'BiblioKit helps designers, developers, and marketers ship faster with Figma plugins. Browse the blog for the latest workflows and fixes.';
    metadata.robots = 'noindex, follow';
    metadata.googlebot = 'noindex, follow';
    metadata.bingbot = 'noindex, follow';
    metadata.ogTitle = metadata.title;
    metadata.ogDescription = metadata.description;
    metadata.twitterTitle = metadata.title;
    metadata.twitterDescription = metadata.description;
  }
  
  // Override with dynamic content data if available
  if (contentData || blogContent) {
    if (isBlogArticle) {
      const articleData = blogContent ?? (isBlogPostData(contentData) ? contentData : undefined);
      const articleTitle = articleData?.metaTitle || articleData?.title;
      const articleDescription =
        articleData?.metaDescription ||
        articleData?.excerpt ||
        (articleData as any)?.description;
      metadata.title = articleTitle || metadata.title;
      metadata.description = articleDescription || metadata.description;
      metadata.ogTitle = articleTitle || metadata.ogTitle;
      metadata.ogDescription = articleDescription || metadata.ogDescription;
      metadata.twitterTitle = articleData?.twitterTitle || articleTitle || metadata.twitterTitle;
      metadata.twitterDescription = articleDescription || metadata.twitterDescription;
      if (articleData?.heroImage) {
        metadata.ogImage = articleData.heroImage;
        metadata.twitterImage = articleData.heroImage;
      }
      metadata.ogImageAlt = articleData?.heroImageAlt || metadata.ogImageAlt;
      metadata.twitterImageAlt = articleData?.heroImageAlt || metadata.twitterImageAlt;
      metadata.keywords = mergeKeywords(metadata.keywords, [
        articleData?.category,
        articleData?.title,
        'BiblioKit blog'
      ]);
      metadata.ogType = 'article';
    } else {
      switch (matchedRouteKey) {
        case '/': {
          const hero = contentData.hero;
          const heroSeoTitle = hero?.seoTitle || hero?.metaTitle;
          const heroSeoDescription = hero?.seoDescription || hero?.subtitle;

          if (heroSeoTitle) {
            metadata.title = heroSeoTitle;
            metadata.ogTitle = heroSeoTitle;
            metadata.twitterTitle = heroSeoTitle;
          }

          if (heroSeoDescription) {
            metadata.description = heroSeoDescription;
            metadata.ogDescription = heroSeoDescription;
            metadata.twitterDescription = heroSeoDescription;
          }
          break;
        }
      }
    }

    // Dynamic product route handling: e.g., "/bibliokit-blocks" or other slugged pages
    if (!routeMetadata[normalizedPathNoTrailingSlash] && normalizedPathNoTrailingSlash !== '/' && !normalizedPathNoTrailingSlash.startsWith('/admin') && !isBlogArticle) {
      const slug = String(normalizedPathNoTrailingSlash).replace(/^\/+/, '').split('/')[0];
      const product = contentData.products?.[slug];
      if (product) {
        const productTitle: string = product.title || metadata.title;
        const productDescription: string = product.description || metadata.description;
        metadata.title = `${productTitle} | BiblioKit`;
        metadata.description = productDescription;
        metadata.ogTitle = productTitle;
        metadata.ogDescription = productDescription;
        metadata.twitterTitle = productTitle;
        metadata.twitterDescription = productDescription;
        if (product.ogImage && typeof product.ogImage === 'string') {
          metadata.ogImage = product.ogImage;
        }
        if (product.twitterImage && typeof product.twitterImage === 'string') {
          metadata.twitterImage = product.twitterImage;
        }
        // Add SSR JSON-LD
        const origin = baseUrl;
        const productUrl = `${origin}/${slug}`;
        const productPriceRaw = product.pricing?.price;
        const parsedPrice = typeof productPriceRaw === 'string'
          ? parseFloat(productPriceRaw.replace(/[^0-9.]/g, ''))
          : undefined;
        const offer = (typeof parsedPrice === 'number' && !Number.isNaN(parsedPrice))
          ? {
              '@type': 'Offer',
              price: parsedPrice.toFixed(2),
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: productUrl,
              priceValidUntil: buildPriceValidUntil()
            }
          : undefined;
        const productSchema = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          '@id': `${productUrl}#product`,
          name: productTitle,
          description: productDescription,
          brand: { '@type': 'Brand', name: 'BiblioKit' },
          category: 'SoftwareApplication',
          url: productUrl,
          image: metadata.ogImage,
          audience: {
            '@type': 'Audience',
            audienceType: 'Designers, developers, and product teams'
          },
          offers: offer ? [offer] : undefined
        };
        const breadcrumbSchema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          '@id': `${productUrl}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
            { '@type': 'ListItem', position: 2, name: productTitle, item: productUrl }
          ]
        };
        metadata.structuredData = [
          ...(metadata.structuredData || []),
          productSchema,
          breadcrumbSchema
        ];
        metadata.webPageType = 'ProductPage';
      }
    }

    // Social accounts from content
    const twitterHandle = contentData?.contact?.twitter;
    if (twitterHandle && typeof twitterHandle === 'string') {
      const normalized = twitterHandle.startsWith('@') ? twitterHandle : `@${twitterHandle}`;
      metadata.twitterSite = normalized;
      metadata.twitterCreator = normalized;
    }
  }
  
  // Ensure absolute URLs for social media
  if (metadata.ogImage && !metadata.ogImage.startsWith('http')) {
    metadata.ogImage = `${baseUrl}${metadata.ogImage}`;
  }
  if (metadata.twitterImage && !metadata.twitterImage.startsWith('http')) {
    metadata.twitterImage = `${baseUrl}${metadata.twitterImage}`;
  }
  // Fallback to default on-site OG/Twitter image if missing
  if (!metadata.ogImage) {
    metadata.ogImage = `${baseUrl}/og/og-default.svg`;
  }
  if (!metadata.twitterImage) {
    metadata.twitterImage = `${baseUrl}/og/og-default.svg`;
  }

  // Set descriptive fallbacks for alt text/meta
  if (!metadata.ogImageAlt) {
    metadata.ogImageAlt = metadata.ogTitle || metadata.title;
  }
  if (!metadata.twitterImageAlt) {
    metadata.twitterImageAlt = metadata.ogImageAlt || metadata.title;
  }
  
  // Set canonical URL and clamp lengths
  let canonicalPath = normalizedPathNoTrailingSlash === '' ? '/' : normalizedPathNoTrailingSlash;
  if (canonicalPath === '/ai-rename-variants') {
    canonicalPath = '/biblio-rename';
  }
  metadata.canonical = `${baseUrl}${canonicalPath}`;
  metadata.title = clampText(metadata.title, 60);
  metadata.description = clampText(metadata.description, 155);

  // Add Article structured data for blog posts after canonical is set
  if (isBlogArticle && metadata.canonical && !isMissingBlog) {
    const language = toLanguageTag(metadata.locale) || 'en-US';
    const articleDates = resolveArticleDates(blogContent);
    const articleEntry = cleanStructuredDataEntry({
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${metadata.canonical}#article`,
      mainEntityOfPage: { '@id': `${metadata.canonical}#webpage` },
      headline: metadata.title,
      description: metadata.description,
      inLanguage: language,
      datePublished: articleDates.published,
      dateModified: articleDates.modified,
      articleSection: blogContent?.category,
      author: { '@id': `${baseUrl}#organization` },
      publisher: { '@id': `${baseUrl}#organization` },
      image: metadata.ogImage,
      keywords: resolveKeywords(metadata.keywords)
    });

    metadata.structuredData = [
      ...(metadata.structuredData || []),
      ...(articleEntry ? [articleEntry] : [])
    ];
  }

  // Ensure page type defaults based on context
  if (!metadata.webPageType) {
    metadata.webPageType = normalizedPathNoTrailingSlash === '/' ? 'CollectionPage' : 'WebPage';
  }

  metadata.structuredData = mergeStructuredDataEntries({
    baseUrl,
    path: normalizedPathNoTrailingSlash,
    metadata,
    contentData
  });
  
  return metadata;
}

// Generate HTML meta tags from metadata
export function generateMetaTags(metadata: SEOMetadata): string {
  const tags: string[] = [];
  const secureOgImage = metadata.ogImage && metadata.ogImage.startsWith('https://')
    ? metadata.ogImage
    : undefined;
  
  // Basic meta tags
  tags.push(`<title>${escapeHtml(metadata.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeHtml(metadata.description)}" />`);
  
  if (metadata.robots) {
    tags.push(`<meta name="robots" content="${escapeHtml(metadata.robots)}" />`);
  }
  if (metadata.googlebot) {
    tags.push(`<meta name="googlebot" content="${escapeHtml(metadata.googlebot)}" />`);
  }
  if (metadata.bingbot) {
    tags.push(`<meta name="bingbot" content="${escapeHtml(metadata.bingbot)}" />`);
  }
  
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
  if (metadata.siteName) {
    tags.push(`<meta property="og:site_name" content="${escapeHtml(metadata.siteName)}" />`);
  }
  if (metadata.locale) {
    tags.push(`<meta property="og:locale" content="${escapeHtml(metadata.locale)}" />`);
  }
  
  if (metadata.ogImage) {
    tags.push(`<meta property="og:image" content="${escapeHtml(metadata.ogImage)}" />`);
    if (secureOgImage) {
      tags.push(`<meta property="og:image:secure_url" content="${escapeHtml(secureOgImage)}" />`);
    }
    if (metadata.ogImageWidth) {
      tags.push(`<meta property="og:image:width" content="${escapeHtml(String(metadata.ogImageWidth))}" />`);
    }
    if (metadata.ogImageHeight) {
      tags.push(`<meta property="og:image:height" content="${escapeHtml(String(metadata.ogImageHeight))}" />`);
    }
    if (metadata.ogImageAlt) {
      tags.push(`<meta property="og:image:alt" content="${escapeHtml(metadata.ogImageAlt)}" />`);
    }
  }
  
  // Twitter Card tags
  tags.push(`<meta name="twitter:card" content="${escapeHtml(metadata.twitterCard || 'summary_large_image')}" />`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(metadata.twitterTitle || metadata.title)}" />`);
  tags.push(`<meta name="twitter:description" content="${escapeHtml(metadata.twitterDescription || metadata.description)}" />`);
  if (metadata.twitterSite) {
    tags.push(`<meta name="twitter:site" content="${escapeHtml(metadata.twitterSite)}" />`);
  }
  if (metadata.twitterCreator) {
    tags.push(`<meta name="twitter:creator" content="${escapeHtml(metadata.twitterCreator)}" />`);
  }
  
  if (metadata.twitterImage) {
    tags.push(`<meta name="twitter:image" content="${escapeHtml(metadata.twitterImage)}" />`);
    if (metadata.twitterImageAlt) {
      tags.push(`<meta name="twitter:image:alt" content="${escapeHtml(metadata.twitterImageAlt)}" />`);
    }
  }
  
  return tags.join('\n    ');
}

// Generate structured data JSON-LD scripts
export function generateStructuredData(metadata: SEOMetadata): string {
  const entries = Array.isArray(metadata.structuredData)
    ? dedupeStructuredData(metadata.structuredData)
    : [];
  if (entries.length === 0) {
    return '';
  }

  const prepared = entries.map((entry) => {
    const context = entry['@context'] || 'https://schema.org';
    const clone = { ...entry };
    delete clone['@context'];
    return { context, data: clone };
  });

  const uniqueContexts = new Set(prepared.map((item) => item.context));
  if (uniqueContexts.size === 1) {
    const [context] = Array.from(uniqueContexts);
    const payload = {
      '@context': context,
      '@graph': prepared.map((item) => item.data)
    };
    return `<script type="application/ld+json">\n${JSON.stringify(payload, null, 2)}\n</script>`;
  }

  // Fallback: emit one script per differing context to remain standards-compliant
  return prepared
    .map(({ context, data }) => {
      const payload = { '@context': context, ...data };
      return `<script type="application/ld+json">\n${JSON.stringify(payload, null, 2)}\n</script>`;
    })
    .join('\n    ');
}

function mergeStructuredDataEntries(params: StructuredDataMergeParams): StructuredDataEntry[] {
  const { baseUrl, path, metadata, contentData } = params;
  const existing = Array.isArray(metadata.structuredData) ? metadata.structuredData : [];
  const globalEntries = createGlobalStructuredData({ baseUrl, path, metadata, contentData });
  return dedupeStructuredData([...globalEntries, ...existing]);
}

function createGlobalStructuredData(params: StructuredDataMergeParams): StructuredDataEntry[] {
  const { baseUrl, path, metadata, contentData } = params;
  if (!metadata.canonical) {
    return [];
  }

  const language = toLanguageTag(metadata.locale) || 'en-US';
  const siteName = metadata.siteName || metadata.title;
  const keywords = resolveKeywords(metadata.keywords);
  const socialProfiles = collectSocialProfiles(contentData);
  const contactEmail = typeof contentData?.contact?.email === 'string'
    ? contentData.contact.email.trim()
    : '';

  const contactPoint = contactEmail
    ? [{
        '@type': 'ContactPoint',
        email: contactEmail,
        contactType: 'customer service',
        availableLanguage: language
      }]
    : undefined;

  const organization = cleanStructuredDataEntry({
    '@context': 'https://schema.org',
    '@type': ['Organization', 'Corporation'],
    '@id': `${baseUrl}#organization`,
    additionalType: 'https://schema.org/SoftwareCompany',
    name: siteName,
    url: baseUrl,
    description: 'BiblioKit is a software company building Figma plugins and DesignOps tools. We help designers, developers, and marketers automate audits, renaming, cleanup, and ship faster.',
    slogan: 'Figma Plugins & DesignOps Tools',
    industry: 'Software Development',
    logo: `${baseUrl}/logo.svg`,
    sameAs: socialProfiles.length ? socialProfiles : undefined,
    contactPoint,
    knowsAbout: keywords.length ? ['Figma plugins', 'design software', ...keywords] : ['Figma plugins', 'design software'],
    areaServed: 'Global'
  });

  const website = cleanStructuredDataEntry({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    url: baseUrl,
    name: siteName,
    description: metadata.description,
    inLanguage: language,
    publisher: { '@id': `${baseUrl}#organization` },
    potentialAction: [{
      '@type': 'ContactAction',
      name: 'Contact Sales',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}#contact`,
        inLanguage: language
      }
    }]
  });

  const primaryImage = createPrimaryImageObject(metadata);

  const webPage = cleanStructuredDataEntry({
    '@context': 'https://schema.org',
    '@type': metadata.webPageType || 'WebPage',
    '@id': `${metadata.canonical}#webpage`,
    url: metadata.canonical,
    name: metadata.title,
    description: metadata.description,
    inLanguage: language,
    isPartOf: { '@id': `${baseUrl}#website` },
    about: keywords.length ? keywords : undefined,
    publisher: { '@id': `${baseUrl}#organization` },
    primaryImageOfPage: primaryImage ? { '@id': primaryImage['@id'] } : undefined,
    image: primaryImage ? primaryImage.url : undefined,
    breadcrumb: path !== '/' ? { '@id': `${metadata.canonical}#breadcrumb` } : undefined
  });

  const entries: StructuredDataEntry[] = [
    organization,
    website,
    primaryImage,
    webPage
  ].filter(Boolean) as StructuredDataEntry[];

  const hasBreadcrumb = Array.isArray(metadata.structuredData)
    ? metadata.structuredData.some((entry: StructuredDataEntry) => entry?.['@type'] === 'BreadcrumbList')
    : false;
  if (!hasBreadcrumb) {
    const fallbackBreadcrumb = createFallbackBreadcrumb(baseUrl, path, metadata);
    if (fallbackBreadcrumb) {
      entries.push(fallbackBreadcrumb);
    }
  }

  return entries;
}

function createPrimaryImageObject(metadata: SEOMetadata): StructuredDataEntry | undefined {
  if (!metadata.canonical || !metadata.ogImage) {
    return undefined;
  }

  return cleanStructuredDataEntry({
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${metadata.canonical}#primaryimage`,
    url: metadata.ogImage,
    caption: metadata.ogImageAlt || metadata.title,
    width: metadata.ogImageWidth,
    height: metadata.ogImageHeight
  });
}

function resolveKeywords(keywords?: string): string[] {
  if (!keywords) return [];
  const parts = keywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);
  return Array.from(new Set(parts));
}

function collectSocialProfiles(contentData?: any): string[] {
  const urls = new Set<string>([
    'https://twitter.com/bibliokit',
    'https://github.com/bibliokit'
  ]);

  const contact = contentData?.contact || {};
  const add = (value: string | null) => {
    if (value) urls.add(value);
  };

  add(normalizeSocialUrl(contact.twitter, 'twitter'));
  add(normalizeSocialUrl(contact.github, 'github'));
  add(normalizeSocialUrl(contact.linkedin, 'linkedin'));
  add(normalizeSocialUrl(contact.youtube, 'youtube'));

  return Array.from(urls);
}

function normalizeSocialUrl(value: unknown, platform: 'twitter' | 'github' | 'linkedin' | 'youtube'): string | null {
  if (typeof value !== 'string') return null;
  let handle = value.trim();
  if (!handle) return null;

  if (/^https?:\/\//i.test(handle)) {
    return handle;
  }

  handle = handle.replace(/^@/, '');

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/${handle}`;
    case 'github':
      return `https://github.com/${handle}`;
    case 'linkedin':
      return handle.startsWith('company/') || handle.startsWith('in/')
        ? `https://www.linkedin.com/${handle.replace(/^\//, '')}`
        : `https://www.linkedin.com/company/${handle}`;
    case 'youtube':
      return `https://www.youtube.com/${handle}`;
    default:
      return null;
  }
}

function createFallbackBreadcrumb(baseUrl: string, path: string, metadata: SEOMetadata): StructuredDataEntry | undefined {
  if (!metadata.canonical) return undefined;
  const normalizedPath = path.replace(/\/+$/g, '');
  if (!normalizedPath || normalizedPath === '/') return undefined;

  const segments = normalizedPath.replace(/^\//, '').split('/').filter(Boolean);
  if (segments.length === 0) return undefined;

  const items: StructuredDataEntry[] = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl }
  ];

  let accumulator = '';
  segments.forEach((segment, index) => {
    accumulator += `/${segment}`;
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: titleCaseFromSlug(segment),
      item: `${baseUrl}${accumulator}`
    });
  });

  return cleanStructuredDataEntry({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${metadata.canonical}#breadcrumb`,
    itemListElement: items
  });
}

function titleCaseFromSlug(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function cleanStructuredDataEntry<T = StructuredDataEntry>(value: T): T | undefined {
  if (value === null || value === undefined) return undefined;

  if (Array.isArray(value)) {
    const cleanedArray = value
      .map((item) => cleanStructuredDataEntry(item))
      .filter((item) => item !== undefined);
    return (cleanedArray.length > 0 ? cleanedArray : undefined) as T | undefined;
  }

  if (typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const [key, rawVal] of Object.entries(value as Record<string, any>)) {
      if (rawVal === undefined || rawVal === null) continue;
      if (typeof rawVal === 'string' && rawVal.trim() === '') continue;

      const cleaned = cleanStructuredDataEntry(rawVal);
      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    }
    return Object.keys(result).length > 0 ? (result as T) : undefined;
  }

  return value;
}

function dedupeStructuredData(entries: StructuredDataEntry[]): StructuredDataEntry[] {
  const seen = new Set<string>();
  const result: StructuredDataEntry[] = [];

  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const cleaned = cleanStructuredDataEntry(entry);
    if (!cleaned) continue;

    const key = typeof cleaned['@id'] === 'string'
      ? cleaned['@id']
      : `${cleaned['@type'] || 'unknown'}::${cleaned['name'] || cleaned['url'] || ''}`;

    if (seen.has(key)) continue;
    seen.add(key);
    result.push(cleaned);
  }

  return result;
}

function toLanguageTag(locale?: string): string | undefined {
  if (!locale) return undefined;
  return locale.replace('_', '-');
}

function buildPriceValidUntil(): string {
  const now = new Date();
  const future = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
  return future.toISOString().split('T')[0];
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

function clampText(text: string, maxLength: number): string {
  if (!text) return text;
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, Math.max(0, maxLength - 1)).trimEnd();
  return `${truncated}…`;
}

// Client-side function to update page metadata
export function updatePageMetadata(metadata: SEOMetadata): void {
  if (typeof document === 'undefined') return;
  
  // Update title
  document.title = metadata.title;

  const secureOgImage = metadata.ogImage && metadata.ogImage.startsWith('https://')
    ? metadata.ogImage
    : undefined;
  
  // Update or create meta tags
  const metaSelectors = [
    { selector: 'meta[name="description"]', content: metadata.description },
    { selector: 'meta[name="robots"]', content: metadata.robots },
    { selector: 'meta[name="googlebot"]', content: metadata.googlebot },
    { selector: 'meta[name="bingbot"]', content: metadata.bingbot },
    { selector: 'meta[name="keywords"]', content: metadata.keywords },
    { selector: 'meta[property="og:title"]', content: metadata.ogTitle || metadata.title },
    { selector: 'meta[property="og:description"]', content: metadata.ogDescription || metadata.description },
    { selector: 'meta[property="og:url"]', content: metadata.canonical },
    { selector: 'meta[property="og:image"]', content: metadata.ogImage },
    { selector: 'meta[property="og:image:secure_url"]', content: secureOgImage },
    { selector: 'meta[property="og:image:alt"]', content: metadata.ogImageAlt },
    { selector: 'meta[property="og:site_name"]', content: metadata.siteName },
    { selector: 'meta[property="og:locale"]', content: metadata.locale },
    { selector: 'meta[property="og:image:width"]', content: metadata.ogImageWidth ? String(metadata.ogImageWidth) : undefined },
    { selector: 'meta[property="og:image:height"]', content: metadata.ogImageHeight ? String(metadata.ogImageHeight) : undefined },
    { selector: 'meta[name="twitter:title"]', content: metadata.twitterTitle || metadata.title },
    { selector: 'meta[name="twitter:description"]', content: metadata.twitterDescription || metadata.description },
    { selector: 'meta[name="twitter:site"]', content: metadata.twitterSite },
    { selector: 'meta[name="twitter:creator"]', content: metadata.twitterCreator },
    { selector: 'meta[name="twitter:image"]', content: metadata.twitterImage },
    { selector: 'meta[name="twitter:image:alt"]', content: metadata.twitterImageAlt }
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

  // Inject structured data for client-side navigations to keep JSON-LD aligned
  try {
    const structuredMarkup = generateStructuredData(metadata);
    const existingScripts =
      typeof document.querySelectorAll === 'function'
        ? Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        : [];
    existingScripts.forEach((node) => {
      if (typeof (node as any).remove === 'function') {
        (node as any).remove();
      } else if ((node as any)?.parentNode?.removeChild) {
        (node as any).parentNode.removeChild(node);
      }
    });

    if (structuredMarkup) {
      const regex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
      let match: RegExpExecArray | null;
      let added = false;
      while ((match = regex.exec(structuredMarkup)) !== null) {
        const scriptEl = document.createElement('script');
        scriptEl.type = 'application/ld+json';
        if (typeof scriptEl.setAttribute === 'function') {
          scriptEl.setAttribute('type', 'application/ld+json');
        }
        scriptEl.setAttribute('data-structured-data', 'true');
        scriptEl.textContent = match[1];
        document.head.appendChild(scriptEl);
        added = true;
      }

      if (!added) {
        const scriptEl = document.createElement('script');
        scriptEl.type = 'application/ld+json';
        if (typeof scriptEl.setAttribute === 'function') {
          scriptEl.setAttribute('type', 'application/ld+json');
        }
        scriptEl.setAttribute('data-structured-data', 'true');
        scriptEl.textContent = structuredMarkup;
        document.head.appendChild(scriptEl);
      }
    }
  } catch {
    // Best-effort; avoid breaking navigation if JSON-LD serialization fails
  }
}
