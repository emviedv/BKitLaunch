import type { Context, Config } from "@netlify/edge-functions";

interface SSRModule {
  renderToString: (url: string, contentData?: any) => string;
  fetchContentData: (url: string) => Promise<any>;
  generateMetadata: (url: string, contentData: any) => {
    title: string;
    description: string;
    metaTags: string;
    structuredData: string;
  };
}

// Cache for server module to avoid repeated imports
let serverModule: SSRModule | null = null;

async function getServerModule(): Promise<SSRModule> {
  if (!serverModule) {
    // Import the server entry point
    serverModule = await import("../../dist/server/entry-server.js");
  }
  return serverModule;
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // Only handle GET requests for HTML pages
  if (request.method !== 'GET') {
    return context.next();
  }
  
  // Skip SSR for API routes, admin assets, and static files
  if (
    url.pathname.startsWith('/.netlify/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('/robots.txt') ||
    url.pathname.endsWith('/sitemap.xml') ||
    url.pathname.includes('.') // Files with extensions
  ) {
    return context.next();
  }
  
  try {
    console.log('🔍 SSR: Processing request for:', url.pathname);
    
    // Get the server rendering module
    const { renderToString, fetchContentData, generateMetadata } = await getServerModule();
    console.log('✅ SSR: Server module loaded successfully');
    
    // Fetch content data for SSR
    const contentData = await fetchContentData(request.url);
    console.log('📄 SSR: Content data fetched:', contentData ? 'SUCCESS' : 'FALLBACK');
    
    // Generate page metadata
    const { title, description, metaTags, structuredData } = generateMetadata(request.url, contentData);
    console.log('🏷️ SSR: Generated meta tags length:', metaTags.length);
    console.log('🏷️ SSR: Meta tags include canonical:', metaTags.includes('canonical'));
    console.log('🏷️ SSR: Meta tags include keywords:', metaTags.includes('keywords'));
    
    // Render the React app to HTML
    const appHtml = renderToString(request.url, contentData);
    
    // Generate a per-response nonce for inline hydration script
    const nonceArray = new Uint8Array(16);
    crypto.getRandomValues(nonceArray);
    const nonce = btoa(String.fromCharCode(...nonceArray));

    // Safely serialize JSON to prevent </script> and special char breakouts
    const safeJson = JSON.stringify({ contentData, url: request.url })
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

    // Decide whether to include Hotjar loader (production, non-admin pages)
    // Use inline snippet with nonce so CSP allows it, and include consent/admin checks client-side.
    const isProdHost = url.hostname !== 'localhost' && url.hostname !== '127.0.0.1';
    const isAdminPath = url.pathname.startsWith('/admin');
    const hotjarTag = isProdHost && !isAdminPath
      ? `<script nonce="${nonce}">(function(){
  try {
    var isProd = location.hostname !== 'localhost' && location.hostname !== '127.0.0.1';
    var isAdmin = location.pathname.startsWith('/admin');
    var consent = (window.__USER_CONSENT__ && window.__USER_CONSENT__.analytics === true) ||
      (function(){ try { return localStorage.getItem('consent:analytics') === 'true'; } catch(e) { return false; } })();
    var alreadyLoaded = typeof window.hj === 'function' || !!document.querySelector('script[src*="hotjar-6484850.js"]');
    if (!isProd || isAdmin || !consent || alreadyLoaded) return;
    (function(h,o,t,j,a,r){
      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      h._hjSettings={hjid:6484850,hjsv:6};
      a=o.getElementsByTagName('head')[0];
      r=o.createElement('script'); r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  } catch(e) { /* no-op */ }
})();</script>`
      : '';

    // Generate the full HTML document
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ctext y='50%25' x='50%25' dominant-baseline='middle' text-anchor='middle' font-size='52'%3E%F0%9F%92%AB%3C/text%3E%3C/svg%3E" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    ${metaTags}
    
    <!-- Structured Data -->
    ${structuredData}

    <!-- Preload critical assets -->
    <link rel="preload" href="/assets/main.css" as="style" />
    
    <!-- CSS will be injected here by build process -->
    <link rel="stylesheet" href="/assets/main.css" />

    ${hotjarTag}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script nonce="${nonce}">
      // Hydration data
      window.__SSR_DATA__ = ${safeJson};
    </script>
    <script type="module" src="/assets/main.js"></script>
  </body>
</html>`;

    console.log('🚀 SSR: Generated HTML length:', html.length);
    console.log('✅ SSR: Returning server-side rendered response');
    
    // Generate content-based cache key for invalidation
    const contentHash = contentData ? 
      btoa(JSON.stringify(contentData)).slice(0, 8) : 
      'fallback';
    
    // Disable caching of SSR HTML to prevent stale previews on reload; rely on client revalidation
    const cacheHeaders = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'ETag': `"ssr-${contentHash}"`,
      'Vary': 'Accept, User-Agent',
    } as Record<string, string>;

    // Compose security headers including CSP-Report-Only with nonce to validate
    const securityHeaders: Record<string, string> = {
      'Content-Security-Policy-Report-Only': `default-src 'self' https:; script-src 'self' 'nonce-${nonce}' https://static.hotjar.com https://script.hotjar.com; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https: https://*.hotjar.com wss://*.hotjar.com;`,
    };

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        ...cacheHeaders,
        ...securityHeaders,
        'X-SSR-Generated': 'true', // Debug header to identify SSR responses
        'X-Content-Hash': contentHash, // Debug header to track content versions
      },
    });
    
  } catch (error) {
    console.error('❌ SSR Error:', error);
    console.error('🔄 SSR: Falling back to SPA mode');
    
    // Fallback to standard SPA behavior
    return context.next();
  }
};

export const config: Config = {
  path: "/*",
  excludedPath: [
    "/assets/*",
    "/.netlify/*",
    "/admin/*",
    "/*.js",
    "/*.css",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.gif",
    "/*.svg",
    "/*.ico",
    "/*.woff",
    "/*.woff2",
    "/*.ttf",
    "/*.eot"
  ]
};