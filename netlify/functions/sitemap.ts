import { Handler } from '@netlify/functions';
import { withCors } from './utils';

const makeUrl = (loc: string, lastmod?: string) => `  <url>\n    <loc>${loc}</loc>\n    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;

const handlerImpl: Handler = async () => {
  const base = process.env.URL || 'https://bibliokit.com';
  const staticPaths = ['/', '/product', '/bibliokit-blocks', '/ai-rename-variants'];

  // Try to fetch current published content to gather dynamic product slugs and lastmod
  let content: any = null;
  let lastmod: string | undefined = undefined;
  try {
    const res = await fetch(`${base}/.netlify/functions/content-management?action=current`, { headers: { 'Cache-Control': 'no-cache' } });
    if (res.ok) {
      const json = await res.json();
      content = json?.data?.content_data || null;
      lastmod = (json?.data?.updated_at ? new Date(json.data.updated_at).toISOString() : undefined);
    }
  } catch {
    // best-effort only
  }

  const dynamicProductPaths: string[] = content && content.products
    ? Object.keys(content.products).map((slug) => `/${slug}`)
    : [];

  const allPaths = Array.from(new Set([...staticPaths, ...dynamicProductPaths]));
  const urls = allPaths.map((p) => makeUrl(`${base}${p}`, lastmod)).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
    body: xml,
  };
};

export const handler = withCors(handlerImpl);


