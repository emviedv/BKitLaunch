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
    
    // Generate the full HTML document
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    ${metaTags}
    
    <!-- Structured Data -->
    ${structuredData}

    <!-- Preload critical assets -->
    <link rel="preload" href="/assets/main.css" as="style" />
    
    <!-- CSS will be injected here by build process -->
    <link rel="stylesheet" href="/assets/main.css" />

    <!-- Hotjar Tracking Code for BiblioKit  -->
    <script>
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:6484850,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    </script>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script>
      // Hydration data
      window.__SSR_DATA__ = ${JSON.stringify({ contentData, url: request.url })};
    </script>
    <script type="module" src="/assets/main.js"></script>
  </body>
</html>`;

    console.log('🚀 SSR: Generated HTML length:', html.length);
    console.log('✅ SSR: Returning server-side rendered response');
    
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min browser, 10 min CDN
        'X-SSR-Generated': 'true', // Debug header to identify SSR responses
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