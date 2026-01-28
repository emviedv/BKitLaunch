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

const DEV_HOSTS = new Set(['localhost', '127.0.0.1']);
const SSR_SKIP_HEADER = 'x-ssr-skip';

const readEnv = (key: string): string | undefined => {
  try {
    const netlifyEnv = (globalThis as any)?.Netlify?.env;
    if (netlifyEnv && typeof netlifyEnv.get === 'function') {
      const value = netlifyEnv.get(key);
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }
    }
  } catch {}
  try {
    const denoEnv = (globalThis as any)?.Deno?.env;
    if (denoEnv && typeof denoEnv.get === 'function') {
      const value = denoEnv.get(key);
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }
    }
  } catch {}
  try {
    const processEnv = (globalThis as any)?.process?.env;
    if (processEnv && typeof processEnv === 'object') {
      const value = processEnv[key];
      if (typeof value === 'string' && value.length > 0) {
        return value;
      }
    }
  } catch {}
  return undefined;
};

const collectHosts = (raw?: string): string[] => {
  if (!raw) return [];
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((entry) => {
      if (entry.startsWith('*.')) {
        return entry.toLowerCase();
      }
      try {
        const parsed = new URL(entry);
        return parsed.hostname.toLowerCase();
      } catch {
        try {
          const parsedWithScheme = new URL(`https://${entry}`);
          return parsedWithScheme.hostname.toLowerCase();
        } catch {
          return entry.toLowerCase();
        }
      }
    });
};

const allowedHostRules = (() => {
  const hosts = new Set<string>();
  const push = (value?: string) => {
    for (const host of collectHosts(value)) {
      hosts.add(host);
    }
  };
  push(readEnv('SSR_ALLOWED_HOSTS'));
  push(readEnv('ALLOWED_ORIGINS'));
  push(readEnv('URL'));
  push(readEnv('DEPLOY_URL'));
  return Array.from(hosts);
})();

const collectPreferredOrigins = (): string[] => {
  const origins = new Set<string>();
  const push = (value?: string) => {
    if (!value) return;
    try {
      origins.add(new URL(value).origin);
      return;
    } catch {}
    try {
      origins.add(new URL(`https://${value}`).origin);
    } catch {}
  };
  push(readEnv('SSR_INTERNAL_ORIGIN'));
  push(readEnv('SSR_CONTENT_BASE_URL'));
  push(readEnv('PUBLIC_SITE_URL'));
  push(readEnv('DEPLOY_URL'));
  push(readEnv('URL'));
  return Array.from(origins);
};

const isNetlifyManagedHost = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase();
  return normalized.endsWith('.netlify.app') || normalized.endsWith('.netlify.com');
};

const pickStableInternalOrigin = (urlObj: URL, fallbackOrigin: string): string => {
  const requestOrigin = fallbackOrigin || urlObj.origin;
  const requestHost = urlObj.hostname.toLowerCase();
  const preferredOrigins = collectPreferredOrigins();

  const netlifyOrigin = preferredOrigins.find((origin) => {
    try {
      const parsed = new URL(origin);
      return isNetlifyManagedHost(parsed.hostname) && parsed.hostname.toLowerCase() !== requestHost;
    } catch {
      return false;
    }
  });
  if (netlifyOrigin) {
    return netlifyOrigin;
  }

  const alternateOrigin = preferredOrigins.find((origin) => {
    try {
      const parsed = new URL(origin);
      return parsed.hostname.toLowerCase() !== requestHost;
    } catch {
      return false;
    }
  });

  return alternateOrigin || requestOrigin;
};

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

const sanitizeRequestUrl = (incoming: URL): URL | null => {
  if (!incoming || !incoming.hostname) {
    return null;
  }
  if (incoming.protocol !== 'https:' && incoming.protocol !== 'http:') {
    return null;
  }
  if (!isHostAllowed(incoming.hostname)) {
    return null;
  }
  const sanitized = new URL(`${incoming.protocol}//${incoming.host}`);
  sanitized.pathname = incoming.pathname;
  sanitized.search = incoming.search;
  sanitized.hash = '';
  return sanitized;
};

async function getServerModule(): Promise<SSRModule> {
  if (!serverModule) {
    // Import the server entry point
    serverModule = await import("../../dist/server/entry-server.js");
  }
  return serverModule;
}

const fetchWithTimeout = async (
  resource: RequestInfo | URL,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> => {
  const { timeoutMs = 2500, ...rest } = init;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(resource, {
      ...rest,
      signal: rest.signal ?? controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

const buildModuleScriptTag = (src: string) => `<script type="module" crossorigin src="${src}"></script>`;

const loadIndexAssets = async (
  origin: string
): Promise<{ cssLinks: string; jsScriptTag: string } | null> => {
  try {
    const indexUrl = new URL('/index.html', origin).toString();
    const indexRes = await fetchWithTimeout(indexUrl, {
      redirect: 'follow',
      timeoutMs: 2000,
      headers: { [SSR_SKIP_HEADER]: '1' }
    });
    if (!indexRes.ok) {
      return null;
    }

    const html = await indexRes.text();
    const cssLinks = Array.from(html.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi))
      .map((match) => match[0])
      .join('\n     ');
    const moduleScriptMatch = html.match(
      /<script[^>]*type=["']module["'][^>]*src=["'][^"']+["'][^>]*><\/script>/i
    );
    const jsScriptTag = moduleScriptMatch?.[0] ?? '';

    if (!cssLinks && !jsScriptTag) {
      return null;
    }

    return { cssLinks, jsScriptTag };
  } catch (error) {
    console.warn('⚠️ SSR: Index asset extraction failed:', error);
    return null;
  }
};

export default async (request: Request, context: Context) => {
  if (request.headers.get(SSR_SKIP_HEADER) === '1') {
    return context.next();
  }

  const parsedUrl = new URL(request.url);
  const url = sanitizeRequestUrl(parsedUrl);
  if (!url) {
    console.warn('⚠️ SSR: Rejected request with untrusted origin:', parsedUrl.hostname);
    return context.next();
  }
  const isProdHost = !DEV_HOSTS.has(url.hostname);
  
  // In local development, skip SSR completely and let Vite SPA handle routing to avoid hydration noise
  if (!isProdHost) {
    return context.next();
  }

  const isGetLike = request.method === 'GET' || request.method === 'HEAD';

  // Only handle GET/HEAD requests for HTML pages
  if (!isGetLike) {
    return context.next();
  }

  const normalizedPath = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
  if (normalizedPath === '/ai-rename-variants' || normalizedPath === '/biblio-rename') {
    const redirectUrl = new URL('/figma-component-variant-renamer', url.origin);
    redirectUrl.search = url.search;
    return Response.redirect(redirectUrl.toString(), 301);
  }

  const isStaticAsset = Boolean(
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|webm|mp4|ico|json|xml|txt|css|js|woff|woff2|ttf|eot)$/i)
  );
  const shouldBypassSsr = (
    url.pathname.startsWith('/.netlify/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/@vite/') ||
    url.pathname.startsWith('/@react-refresh') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('/robots.txt') ||
    url.pathname.endsWith('/sitemap.xml') ||
    isStaticAsset
  );
  const hasTrailingSlash = url.pathname.length > 1 && url.pathname.endsWith('/');
  if (hasTrailingSlash && normalizedPath !== url.pathname && !shouldBypassSsr) {
    const redirectUrl = new URL(normalizedPath, url.origin);
    redirectUrl.search = url.search;
    return Response.redirect(redirectUrl.toString(), 301);
  }
  
  // Skip SSR for API routes, admin assets, dev/Vite assets, and static files
  if (shouldBypassSsr) {
    return context.next();
  }
  
  try {
    console.log('🔍 SSR: Processing request for:', url.pathname);
    
    // Get the server rendering module
    const { renderToString, fetchContentData, generateMetadata } = await getServerModule();
    console.log('✅ SSR: Server module loaded successfully');
    
    // Fetch content data for SSR
    const contentData = await fetchContentData(url.pathname);
    console.log('📄 SSR: Content data fetched:', contentData ? 'SUCCESS' : 'FALLBACK');
    
    // Generate page metadata
    const { title, description, metaTags, structuredData } = generateMetadata(url.toString(), contentData);
    console.log('🏷️ SSR: Generated meta tags length:', metaTags.length);
    console.log('🏷️ SSR: Meta tags include canonical:', metaTags.includes('canonical'));
    console.log('🏷️ SSR: Meta tags include keywords:', metaTags.includes('keywords'));
    
    // Render the React app to HTML
    const appHtml = renderToString(url.toString(), contentData);
    
    // Generate a per-response nonce for inline hydration script
    const nonceArray = new Uint8Array(16);
    crypto.getRandomValues(nonceArray);
    // Edge-safe base64 for nonce
    const nonce = Array.from(nonceArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Safely serialize JSON to prevent </script> and special char breakouts
    const safeJson = JSON.stringify({ contentData, url: url.toString() })
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

    // Decide whether to include Hotjar loader (production, non-admin pages)
    // Use inline snippet with nonce so CSP allows it, and include consent/admin checks client-side.
    const isAdminPath = url.pathname.startsWith('/admin');
    // Allow a query switch to quickly grant analytics consent for validation: ?hj=1 or ?analytics=1 or ?consent=1
    // This runs before the Hotjar loader so consent is available on first render.
    const consentBootstrapTag = isProdHost && !isAdminPath
      ? `<script nonce="${nonce}">(function(){
  try {
    var qp = new URLSearchParams(location.search);
    var wants = qp.get('analytics') === '1' || qp.get('hj') === '1' || qp.get('consent') === '1';
    if (wants) {
      try { localStorage.setItem('consent:analytics', 'true'); } catch(e) {}
      try { window.__USER_CONSENT__ = Object.assign({}, window.__USER_CONSENT__, { analytics: true }); } catch(e) {}
    }
  } catch(e) { /* no-op */ }
})();</script>`
      : '';
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

    // Apollo.io Website Tracker
    const apolloTag = isProdHost && !isAdminPath
      ? `<script nonce="${nonce}">
  function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");
  o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,
  o.onload=function(){window.trackingFunctions.onLoad({appId:"697902f91a7bc300114dc098"})},
  document.head.appendChild(o)}initApollo();
</script>`
      : '';

    // Resolve Vite-built asset paths from manifest with safe fallbacks
    let cssLinks = '';
    let jsPath = '/assets/main.js';
    let jsScriptTag = '';
    let manifestSource = 'fallback';
    if (!isProdHost) {
      // In dev, use Vite entry directly
      jsPath = '/src/entry-client.tsx';
      jsScriptTag = buildModuleScriptTag(jsPath);
      manifestSource = 'dev';
    } else {
      let manifestFound = false;
      const manifestOrigin = context.site?.url || url.origin;
      const manifestCandidates = ['/manifest.json', '/client/manifest.json'];
      for (const candidate of manifestCandidates) {
        try {
          const manifestUrl = new URL(candidate, manifestOrigin).toString();
          const manifestRes = await fetchWithTimeout(manifestUrl, {
            redirect: 'follow',
            timeoutMs: 2000,
          });
          if (!manifestRes.ok) {
            continue;
          }

          manifestFound = true;
          manifestSource = 'manifest';
          const manifest: any = await manifestRes.json();
          const entry = manifest['src/entry-client.tsx'] || manifest['index.html'] || null;
          if (entry && entry.file) {
            jsPath = `/${String(entry.file).replace(/^\//, '')}`;
          }
          const cssArray: string[] = Array.isArray(entry?.css) ? entry.css : [];
          if (cssArray.length > 0) {
            cssLinks = cssArray
              .map((href) => `<link rel="stylesheet" href="/${String(href).replace(/^\//, '')}" />`)
              .join('\n     ');
          }
          break;
        } catch (error) {
          const err = error as Error;
          if (err?.name === 'AbortError') {
            console.warn('⏱️ SSR: Manifest fetch timed out:', candidate, 'via', manifestOrigin);
          } else {
            console.warn('⚠️ SSR: Manifest fetch failed:', candidate, 'via', manifestOrigin, err);
          }
        }
      }

      if (!manifestFound) {
        const indexAssets = await loadIndexAssets(manifestOrigin);
        if (indexAssets) {
          cssLinks = indexAssets.cssLinks || cssLinks;
          jsScriptTag = indexAssets.jsScriptTag || jsScriptTag;
          manifestSource = 'index';
        } else {
          console.warn('⚠️ SSR: Manifest unavailable; using fallback asset paths.');
        }
      }

      if (!jsScriptTag) {
        jsScriptTag = buildModuleScriptTag(jsPath);
      }
    }

    // In local development with Vite, we must include the Vite client and React Refresh preamble
    // so that @vitejs/plugin-react can detect it and enable HMR without errors.
    const viteDevPreamble = !isProdHost
      ? `\n    <script type="module" src="/@vite/client"></script>\n    <script type="module">\n      import RefreshRuntime from "/@react-refresh";\n      RefreshRuntime.injectIntoGlobalHook(window);\n      window.$RefreshReg$ = () => {};\n      window.$RefreshSig$ = () => (type) => type;\n      window.__vite_plugin_react_preamble_installed__ = true;\n    </script>`
      : '';

    // Early scroll control to avoid browser restoring prior position before hydration
    const preHydrationStyleTag = `
    <style id="pre-hydration-scroll-guard">html{overflow-anchor:none!important;scroll-behavior:auto!important}</style>`;
    const scrollControlTag = `
    <script nonce="${nonce}">(function(){
      function scrollTopNow(){
        try { window.scrollTo(0, 0); } catch(e) {}
        try { document.documentElement.scrollTop = 0; } catch(e) {}
        try { document.body && (document.body.scrollTop = 0); } catch(e) {}
      }
      try {
        if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
        var isHomeNoHash = location && location.pathname === '/' && !location.hash;
        if (isHomeNoHash) {
          scrollTopNow();
          requestAnimationFrame(scrollTopNow);
          setTimeout(scrollTopNow, 50);
        }
      } catch (e) { /* no-op */ }
      try {
        // Remove guard style after first frame
        requestAnimationFrame(function(){
          var el = document.getElementById('pre-hydration-scroll-guard');
          if (el && el.parentNode) { el.parentNode.removeChild(el); }
        });
      } catch(e) { /* no-op */ }
      try {
        // Minimal instrumentation for diagnosis
        if (typeof console !== 'undefined') {
          console.debug('[scroll-guard] path:', location && location.pathname, 'hash:', location && location.hash, 'scrollY:', (typeof window!=='undefined' && window.scrollY));
          setTimeout(function(){ console.debug('[scroll-guard] after 50ms scrollY:', (typeof window!=='undefined' && window.scrollY)); }, 50);
        }
      } catch(e) { /* no-op */ }
    })();</script>`;

    // Generate the full HTML document
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ctext y='50%25' x='50%25' dominant-baseline='middle' text-anchor='middle' font-size='52'%3E%F0%9F%92%AB%3C/text%3E%3C/svg%3E" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    ${preHydrationStyleTag}
    ${scrollControlTag}
    
    ${viteDevPreamble}
    
    <!-- SEO Meta Tags -->
    ${metaTags}
    
    <!-- Structured Data -->
    ${structuredData}

    <!-- CSS injected via manifest -->
    ${cssLinks}

    ${consentBootstrapTag}
    ${hotjarTag}
    ${apolloTag}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script nonce="${nonce}">
      // Hydration data
      window.__SSR_DATA__ = ${safeJson};
    </script>
    ${jsScriptTag}
  </body>
</html>`;

    console.log('🚀 SSR: Generated HTML length:', html.length);
    console.log('✅ SSR: Returning server-side rendered response');
    
    // Generate content-based cache key for invalidation (Edge-safe, non-Latin safe)
    let contentHash = 'fallback';
    try {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(JSON.stringify(contentData || {}));
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const hashBytes = new Uint8Array(digest);
      contentHash = Array.from(hashBytes)
        .slice(0, 8)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch {}
    
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
      'Content-Security-Policy-Report-Only': `default-src 'self' https:; script-src 'self' 'nonce-${nonce}' https://static.hotjar.com https://script.hotjar.com https://assets.apollo.io; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https: https://*.hotjar.com wss://*.hotjar.com https://*.apollo.io;`,
    };

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        ...cacheHeaders,
        ...securityHeaders,
        'X-SSR-Generated': 'true', // Debug header to identify SSR responses
        'X-SSR-Assets': manifestSource,
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
    // Directory-based exclusions
    "/assets/*", "/assets/*/*", "/assets/*/*/*", "/assets/*/*/*/*",
    "/.netlify/*", "/.netlify/*/*",
    "/admin/*", "/admin/*/*",
    "/@vite/*", "/@vite/*/*",
    "/@react-refresh",
    "/node_modules/*", "/node_modules/*/*", "/node_modules/*/*/*",
    "/media/*", "/media/*/*",
    "/clients/*", "/clients/*/*",
    "/avatars/*", "/avatars/*/*",
    "/og/*",
    "/demos/*", "/demos/*/*",
    
    // Explicit Blog Assets (Safety net)
    "/blog/*.png", "/blog/*/*.png", "/blog/*/*/*.png",
    "/blog/*.jpg", "/blog/*/*.jpg", "/blog/*/*/*.jpg",
    "/blog/*.jpeg", "/blog/*/*.jpeg", "/blog/*/*/*.jpeg",
    "/blog/*.svg", "/blog/*/*.svg", "/blog/*/*/*.svg",

    // Extension-based exclusions (Explicit depths 0-5)
    "/*.js", "/*/*.js", "/*/*/*.js", "/*/*/*/*.js", "/*/*/*/*/*.js", "/*/*/*/*/*/*.js",
    "/*.css", "/*/*.css", "/*/*/*.css", "/*/*/*/*.css", "/*/*/*/*/*.css", "/*/*/*/*/*/*.css",
    "/*.png", "/*/*.png", "/*/*/*.png", "/*/*/*/*.png", "/*/*/*/*/*.png", "/*/*/*/*/*/*.png",
    "/*.jpg", "/*/*.jpg", "/*/*/*.jpg", "/*/*/*/*.jpg", "/*/*/*/*/*.jpg", "/*/*/*/*/*/*.jpg",
    "/*.jpeg", "/*/*.jpeg", "/*/*/*.jpeg", "/*/*/*/*.jpeg", "/*/*/*/*/*.jpeg", "/*/*/*/*/*/*.jpeg",
    "/*.gif", "/*/*.gif", "/*/*/*.gif", "/*/*/*/*.gif", "/*/*/*/*/*.gif", "/*/*/*/*/*/*.gif",
    "/*.svg", "/*/*.svg", "/*/*/*.svg", "/*/*/*/*.svg", "/*/*/*/*/*.svg", "/*/*/*/*/*/*.svg",
    "/*.ico", "/*/*.ico", "/*/*/*.ico", "/*/*/*/*.ico", "/*/*/*/*/*.ico", "/*/*/*/*/*/*.ico",
    "/*.webp", "/*/*.webp", "/*/*/*.webp", "/*/*/*/*.webp", "/*/*/*/*/*.webp", "/*/*/*/*/*/*.webp",
    "/*.webm", "/*/*.webm", "/*/*/*.webm", "/*/*/*/*.webm", "/*/*/*/*/*.webm", "/*/*/*/*/*/*.webm",
    "/*.mp4", "/*/*.mp4", "/*/*/*.mp4", "/*/*/*/*.mp4", "/*/*/*/*/*.mp4", "/*/*/*/*/*/*.mp4",
    "/*.woff", "/*/*.woff", "/*/*/*.woff", "/*/*/*/*.woff", "/*/*/*/*/*.woff", "/*/*/*/*/*/*.woff",
    "/*.woff2", "/*/*.woff2", "/*/*/*.woff2", "/*/*/*/*.woff2", "/*/*/*/*/*.woff2", "/*/*/*/*/*/*.woff2",
    "/*.ttf", "/*/*.ttf", "/*/*/*.ttf", "/*/*/*/*.ttf", "/*/*/*/*/*.ttf", "/*/*/*/*/*/*.ttf",
    "/*.eot", "/*/*.eot", "/*/*/*.eot", "/*/*/*/*.eot", "/*/*/*/*/*.eot", "/*/*/*/*/*/*.eot",
    "/*.txt", "/*/*.txt", "/*/*/*.txt",
    "/*.xml", "/*/*.xml", "/*/*/*.xml",
    "/*.json", "/*/*.json", "/*/*/*.json"
  ]
};
