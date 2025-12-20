import { BLOG_POSTS as BLOG_POST_DATA } from '../../src/data/blogPosts.ts';

const RETIRED_PATHS = new Set([
  '/product',
  '/roadmap',
  '/sign-up',
  '/test',
  '/component-auditor-figma-plugin',
  '/month',
  '/learn-more'
]);

const AI_CRAWLERS = [
  'GPTBot',
  'PerplexityBot',
  'ClaudeBot',
  'ChatGPT-User',
  'CCBot',
  'anthropic-ai',
  'Claude-Web',
  'Bingbot',
  'Googlebot',
  'Slurp',
  'DuckDuckBot',
  'facebookexternalhit',
  'SemrushBot',
  'AhrefsBot',
  'MJ12bot',
  'DotBot',
  'YandexBot',
  'Applebot',
  'Screaming Frog',
  'SiteAuditBot',
  'Sitebulb'
];

const SITE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'BiblioRename', href: '/biblio-rename' },
  { label: 'BiblioClean', href: '/biblio-clean' },
  { label: 'BiblioAudit', href: '/biblio-audit' },
  { label: 'BiblioTable', href: '/biblio-table' },
  { label: 'UXBiblio', href: '/uxbiblio' },
  { label: 'Blog', href: '/blog' }
];

const PRODUCT_META: Record<string, { title: string; description: string; ogType?: string }> = {
  '/biblio-rename': {
    title: 'BiblioRename for Figma | BiblioKit',
    description:
      'BiblioRename batch-renames Figma variants and layers with AI, enforces naming conventions, and keeps properties consistent for cleaner developer handoff.',
    ogType: 'product'
  },
  '/biblio-clean': {
    title: 'BiblioClean | Remove Prototype Links Safely',
    description:
      'Instantly remove prototype connections (blue lines) and revoke public share links before they leak. The safest way to clean Figma files.',
    ogType: 'product'
  },
  '/biblio-audit': {
    title: 'BiblioAudit | Find Detached Instances & Design System Check',
    description:
      'Automated QA for Figma. Find detached instances, validate tokens, and flag design system drift instantly.',
    ogType: 'product'
  },
  '/biblio-table': {
    title: 'BiblioTable | Normalize Figma Tables in One Click',
    description:
      'Instantly normalize column widths, fix sub-pixel rotation bugs, and generate zebra striping for any auto-layout table in Figma.',
    ogType: 'product'
  },
  '/uxbiblio': {
    title: 'UXBiblio by BiblioKit | AI Library for UX Patterns',
    description:
      'Save and search UX inspiration with AI-powered tagging, smart collections, and shareable libraries so product teams find the right pattern fast.',
    ogType: 'website'
  }
};

const PRODUCT_PAGE_COPY: Record<string, { headline: string; description: string }> = {
  '/biblio-clean': {
    headline: 'BiblioClean',
    description:
      'Instantly remove prototype connections (blue lines) and revoke public share links before they leak. The safest way to clean Figma files.'
  },
  '/biblio-audit': {
    headline: 'BiblioAudit',
    description:
      'Automated QA for Figma. Find detached instances, validate tokens, and flag design system drift instantly.'
  },
  '/biblio-table': {
    headline: 'BiblioTable',
    description:
      'Instantly normalize column widths, fix sub-pixel rotation bugs, and generate zebra striping for any auto-layout table in Figma.'
  },
  '/uxbiblio': {
    headline: 'UXBiblio',
    description:
      'Save and search UX inspiration with AI-powered tagging, smart collections, and shareable libraries so teams find the right pattern fast.'
  }
};

const BLOG_INDEX_META = {
  title: 'BiblioKit Blog | Build Stuff People Love',
  description:
    'From kickoff to ship: tools and workflows that keep designers, developers, and marketers on one page.'
};

const BLOG_INDEX_COPY = {
  headline: 'BiblioKit Blog',
  description: BLOG_INDEX_META.description
};

const BLOG_POST_SUMMARIES = BLOG_POST_DATA.map((post) => ({
  slug: post.slug,
  title: post.title,
  metaTitle: post.metaTitle || post.title,
  metaDescription: post.metaDescription || post.excerpt || '',
  excerpt: post.excerpt || post.metaDescription || '',
  lastUpdated: (post as any).lastUpdated,
  heroImage: post.heroImage,
  heroImageAlt: post.heroImageAlt || post.title
}));

const BLOG_POST_LOOKUP = new Map(BLOG_POST_SUMMARIES.map((post) => [post.slug, post]));

const buildCanonicalUrl = (origin: string, pathname: string): string => {
  if (!pathname || pathname === '/') return origin;
  return `${origin}${pathname}`;
};

const toAbsoluteUrl = (origin: string, input?: string | null): string | null => {
  if (!input || typeof input !== 'string') return null;
  try {
    const parsed = new URL(input);
    return parsed.toString();
  } catch {
    return `${origin}${input.startsWith('/') ? input : `/${input}`}`;
  }
};

const renderSiteLinks = (links: Array<{ href: string; label: string }>, color = '#e5e7eb') =>
  links
    .map((link) => `<a href="${link.href}" style="color: ${color}; text-decoration: none;">${link.label}</a>`)
    .join('');

const renderSiteHeader = () => `
  <header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem;">
    <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div style="font-size: 1.5rem; font-weight: bold;">BiblioKit</div>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${renderSiteLinks(SITE_LINKS)}
      </div>
    </nav>
  </header>
`;

const renderSimplePage = (headline: string, description: string) => `
  ${renderSiteHeader()}
  <main>
    <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 5rem 2rem; text-align: center;">
      <div style="max-width: 860px; margin: 0 auto;">
        <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem;">${headline}</h1>
        <p style="font-size: 1.25rem; margin: 0; opacity: 0.9;">${description}</p>
      </div>
    </section>
  </main>
`;

const renderBlogIndex = () => `
  ${renderSiteHeader()}
  <main>
    <section style="background: #0f172a; color: white; padding: 5rem 2rem; text-align: center;">
      <div style="max-width: 860px; margin: 0 auto;">
        <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem;">${BLOG_INDEX_COPY.headline}</h1>
        <p style="font-size: 1.25rem; margin: 0; opacity: 0.9;">${BLOG_INDEX_COPY.description}</p>
      </div>
    </section>
    <section style="padding: 3.5rem 2rem; background: #f9fafb;">
      <div style="max-width: 1100px; margin: 0 auto; display: grid; gap: 1.5rem;">
        ${BLOG_POST_SUMMARIES.map((post) => `
          <article style="background: white; padding: 1.5rem; border-radius: 0.75rem; box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);">
            <h2 style="font-size: 1.4rem; font-weight: bold; margin: 0 0 0.75rem 0;">
              <a href="/blog/${post.slug}" style="color: #111827; text-decoration: none;">${post.title}</a>
            </h2>
            <p style="margin: 0; color: #6b7280;">${post.excerpt}</p>
          </article>
        `).join('')}
      </div>
    </section>
  </main>
`;

const renderBlogPost = (post: typeof BLOG_POST_SUMMARIES[number]) => `
  ${renderSiteHeader()}
  <main>
    <section style="background: #0f172a; color: white; padding: 5rem 2rem;">
      <div style="max-width: 900px; margin: 0 auto;">
        <p style="text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.75rem; color: #cbd5f5; margin-bottom: 1rem;">Blog</p>
        <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem;">${post.title}</h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; color: #dbeafe;">${post.excerpt}</p>
        <a href="/blog" style="color: #e5e7eb; text-decoration: underline;">Return to the blog</a>
      </div>
    </section>
  </main>
`;

const extractBlogSlug = (pathname: string): string | null => {
  const match = pathname.replace(/\/+$/, '').match(/^\/blog\/([^/]+)/);
  return match?.[1] || null;
};

export default async (request: Request, context: any) => {
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  const isBot = AI_CRAWLERS.some((bot) => userAgent.includes(bot));
  
  // If not a bot, serve the normal SPA
  if (!isBot) {
    return context.next();
  }

  if (RETIRED_PATHS.has(pathname)) {
    return new Response('This page has been retired.', {
      status: 410,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'public, max-age=3600',
        'x-served-by': 'bot-detection-edge-function'
      }
    });
  }
  
  // Generate static HTML for bots based on the path
  const staticHtml = generateStaticHtml(pathname, url.origin);
  
  return new Response(staticHtml, {
    headers: {
      'content-type': 'text/html',
      'cache-control': 'public, max-age=3600',
      'x-served-by': 'bot-detection-edge-function'
    }
  });
};

function generateStaticHtml(pathname: string, origin: string): string {
  const canonicalPath = pathname === '/ai-rename-variants' ? '/biblio-rename' : pathname;
  const baseHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ctext y='50%25' x='50%25' dominant-baseline='middle' text-anchor='middle' font-size='52'%3E%F0%9F%92%AB%3C/text%3E%3C/svg%3E">
  ${getPageMetadata(canonicalPath, origin)}
  ${getPageSchema(canonicalPath, origin)}
</head>
<body>
  ${getPageContent(canonicalPath)}
  
  <!-- Footer for all pages -->
  <footer style="background: #1f2937; color: white; padding: 2rem; text-align: center; margin-top: 4rem;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h3 style="margin-bottom: 1rem;">BiblioKit</h3>
      <p style="color: #9ca3af; margin-bottom: 1rem;">Automate the things you hate, focus on design you love.</p>
      <nav aria-label="BiblioKit site links" style="margin: 1.5rem 0;">
        <div style="display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
          ${renderSiteLinks(SITE_LINKS, '#9ca3af')}
        </div>
      </nav>
      <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;">
        <a href="mailto:hello@bibliokit.com" style="color: #9ca3af;">hello@bibliokit.com</a>
        <a href="https://twitter.com/bibliokit" style="color: #9ca3af;">@bibliokit</a>
        <a href="https://github.com/bibliokit" style="color: #9ca3af;">GitHub</a>
      </div>
      <div style="margin-top: 1rem; color: #9ca3af; font-size: 0.875rem;">&copy; ${new Date().getFullYear()} BiblioKit. All rights reserved.</div>
    </div>
  </footer>
</body>
</html>`;
  
  return baseHtml;
}

const buildMetaTags = (params: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: string;
  ogImage?: string | null;
}) => {
  const ogImageTag = params.ogImage
    ? `<meta property="og:image" content="${params.ogImage}">`
    : '';
  return `
        <title>${params.title}</title>
        <meta name="description" content="${params.description}">
        <link rel="canonical" href="${params.canonicalUrl}">
        <meta property="og:title" content="${params.title}">
        <meta property="og:description" content="${params.description}">
        <meta property="og:type" content="${params.ogType || 'website'}">
        ${ogImageTag}
      `;
};

function getPageMetadata(pathname: string, origin: string): string {
  const canonicalUrl = buildCanonicalUrl(origin, pathname);
  const blogSlug = extractBlogSlug(pathname);
  if (blogSlug) {
    const post = BLOG_POST_LOOKUP.get(blogSlug);
    const title = post?.metaTitle || post?.title || BLOG_INDEX_META.title;
    const description = post?.metaDescription || post?.excerpt || BLOG_INDEX_META.description;
    const ogImage = post?.heroImage ? toAbsoluteUrl(origin, post.heroImage) : null;
    return buildMetaTags({
      title,
      description,
      canonicalUrl,
      ogType: 'article',
      ogImage
    });
  }

  if (pathname === '/blog') {
    return buildMetaTags({
      title: BLOG_INDEX_META.title,
      description: BLOG_INDEX_META.description,
      canonicalUrl,
      ogType: 'website'
    });
  }

  const productMeta = PRODUCT_META[pathname];
  if (productMeta) {
    return buildMetaTags({
      title: productMeta.title,
      description: productMeta.description,
      canonicalUrl,
      ogType: productMeta.ogType || 'product'
    });
  }

  if (pathname === '/') {
    return buildMetaTags({
      title: 'BiblioKit | AI Figma Plugins for Design Systems &amp; Handoff',
      description:
        'BiblioKit: Enhance your design efficiency with Figma plugins and UX resources. Streamline your workflow and work faster with our innovative tools.',
      canonicalUrl,
      ogType: 'website'
    });
  }

  return buildMetaTags({
    title: 'BiblioKit',
    description:
      'BiblioKit: Enhance your design efficiency with Figma plugins and UX resources. Streamline your workflow and work faster with our innovative tools.',
    canonicalUrl,
    ogType: 'website'
  });
}

function getPageSchema(pathname: string, origin: string): string {
  const organizationSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "BiblioKit",
      "description": "BiblioKit: Enhance your design efficiency with Figma plugins and UX resources. Streamline your workflow and work faster with our innovative tools.",
      "url": "${origin}",
      "logo": "${origin}/logo.svg",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@bibliokit.com",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://twitter.com/bibliokit",
        "https://github.com/bibliokit"
      ],
      "dateModified": "${new Date().toISOString().split('T')[0]}",
      "keywords": "SaaS software, Figma plugins, API management, secure proxy, developer tools, design tools"
    }
    </script>
  `;

  if (pathname === '/biblio-rename' || pathname === '/ai-rename-variants') {
    return organizationSchema + `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "BiblioRename",
        "description": "BiblioRename batch-renames Figma variants and layers with AI, enforces naming conventions, and keeps properties consistent for cleaner developer handoff.",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser, Figma",
        "softwareVersion": "1.0",
        "dateModified": "${new Date().toISOString().split('T')[0]}",
        "author": {
          "@type": "Organization",
          "name": "BiblioKit"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "description": "Free community plugin - completely free to use forever"
        },
        "featureList": [
          "One-Click Renaming",
          "Smart Context Analysis", 
          "Batch Processing",
          "Component Intelligence",
          "Cross-Frame Sync"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "48000",
          "bestRating": "5"
        }
      }
      </script>
    `;
  }
  
  return organizationSchema;
}

function getPageContent(pathname: string): string {
  const blogSlug = extractBlogSlug(pathname);
  if (blogSlug) {
    const post = BLOG_POST_LOOKUP.get(blogSlug);
    if (post) {
      return renderBlogPost(post);
    }
  }

  if (pathname === '/blog') {
    return renderBlogIndex();
  }

  const simplePage = PRODUCT_PAGE_COPY[pathname];
  if (simplePage) {
    return renderSimplePage(simplePage.headline, simplePage.description);
  }

  switch (pathname) {
    case '/':
      return `
        ${renderSiteHeader()}

        <main>
          <!-- Hero Section -->
          <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6rem 2rem; text-align: center;">
            <div style="max-width: 800px; margin: 0 auto;">
              <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 25px; margin-bottom: 2rem;">
                SaaS Software & Figma Plugins
              </div>
              <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem;">BiblioKit</h1>
              <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
                Automate the things you hate, focus on design you love.
              </p>
              <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="/biblio-rename" style="background: white; color: #667eea; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;">Batch Rename with BiblioRename</a>
                <a href="#landing-features" style="border: 2px solid rgba(255,255,255,0.3); color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none;">View Features</a>
              </div>
            </div>
          </section>

          <!-- Features Section -->
          <section id="landing-features" style="padding: 4rem 2rem; background: #f9fafb;">
            <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
              <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem;">Key Features</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                
                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">🔒</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Secure API Management</h3>
                  <p style="color: #6b7280;">Generate, manage, and secure your API keys with enterprise-grade security, rate limiting, and comprehensive usage tracking.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">⚡</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Figma Plugin Proxy</h3>
                  <p style="color: #6b7280;">Secure OpenAI API proxy for Figma plugins with CORS protection, request validation, and automatic rate limiting.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">👥</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Help Desk System</h3>
                  <p style="color: #6b7280;">Professional support ticket system with real-time messaging, priority management, and comprehensive admin dashboard.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">💻</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Developer-First</h3>
                  <p style="color: #6b7280;">Comprehensive API documentation, code examples, and SDKs to get you up and running in minutes.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">⭐</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Premium Support</h3>
                  <p style="color: #6b7280;">24/7 expert support with guaranteed response times and dedicated account management for enterprise customers.</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">✅</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Production Ready</h3>
                  <p style="color: #6b7280;">Built for scale with monitoring, logging, error tracking, and automatic failover for 99.9% uptime.</p>
                </div>

              </div>
            </div>
          </section>

          <!-- Updated timestamp -->
          <div style="text-align: center; padding: 1rem; background: #f3f4f6; color: #6b7280; font-size: 0.875rem;">
            Updated ${new Date().toISOString().split('T')[0]}
          </div>
        </main>
      `;
    
    case '/biblio-rename':
    case '/ai-rename-variants':
      return `
        ${renderSiteHeader()}

        <main>
          <!-- Product Hero -->
          <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6rem 2rem; text-align: center;">
            <div style="max-width: 800px; margin: 0 auto;">
              <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 0.5rem 1rem; border-radius: 25px; margin-bottom: 2rem;">
                Figma Plugin
              </div>
              <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem;">BiblioRename</h1>
              <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
                BiblioRename batch-renames Figma variants and layers with AI so naming conventions stay consistent for cleaner developer handoff.
              </p>
              <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="https://www.figma.com/community/plugin/1523817290746945616/batch-rename-variants-properties-ai-assisted" style="background: white; color: #667eea; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;" target="_blank">Install BiblioRename</a>
              </div>
            </div>
          </section>

          <!-- Updated timestamp -->
          <div style="text-align: center; padding: 1rem; background: #f3f4f6; color: #6b7280; font-size: 0.875rem;">
            Updated ${new Date().toISOString().split('T')[0]}
          </div>

          <!-- Features -->
          <section style="padding: 4rem 2rem; background: #f9fafb;">
            <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
              <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem;">⚡ Key Features</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                
                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">⚡</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">One-Click Renaming</h3>
                  <p style="color: #6b7280;">Rename all your layers automatically in a single click - no manual work required</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">🧠</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Smart Context Analysis</h3>
                  <p style="color: #6b7280;">AI analyzes layer contents, location, and relationships to choose perfect contextual names</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>
                  <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Batch Processing</h3>
                  <p style="color: #6b7280;">Process multiple layers, frames, and components simultaneously for maximum efficiency</p>
                </div>

              </div>
            </div>
          </section>

          <!-- Benefits -->
          <section style="padding: 4rem 2rem;">
            <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
              <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem;">💡 Benefits</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                
                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 1rem;">Save hours of manual layer organization work</h3>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 1rem;">Clean up inherited design files with better structure</h3>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <h3 style="font-size: 1.1rem; font-weight: bold; margin-bottom: 1rem;">Improve team collaboration with consistent naming</h3>
                </div>

              </div>
            </div>
          </section>

          <!-- Pricing -->
          <section style="padding: 4rem 2rem; background: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; text-align: center;">
              <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem;">Pricing</h2>
              <div style="background: white; padding: 3rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Free</h3>
                <p style="color: #6b7280; margin-bottom: 2rem;">Community plugin - completely free to use forever</p>
                <a href="https://www.figma.com/community/plugin/1523817290746945616/batch-rename-variants-properties-ai-assisted" style="background: #667eea; color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;" target="_blank">Install Plugin</a>
              </div>
            </div>
          </section>
        </main>
      `;
    
    default:
      return `
        ${renderSiteHeader()}
        <main style="padding: 4rem 2rem; text-align: center;">
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Page Not Found</h1>
          <p style="color: #6b7280; margin-bottom: 2rem;">The page you're looking for doesn't exist.</p>
          <a href="/" style="background: #667eea; color: white; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none;">Go Home</a>
        </main>
      `;
  }
} 
