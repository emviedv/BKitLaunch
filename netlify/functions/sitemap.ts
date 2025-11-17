import { Handler } from '@netlify/functions';
import { withCors } from './utils';
import productData from '../../src/data/products.json' with { type: 'json' };

const makeUrl = (loc: string, lastmod?: string) => `  <url>\n    <loc>${loc}</loc>\n    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;

const handlerImpl: Handler = async () => {
  const base = process.env.URL || 'https://bibliokit.com';
  const staticPaths = ['/', '/product', '/ai-rename-variants'];
  const productEntries = (productData as any)?.products;
  const dynamicProductPaths: string[] = productEntries
    ? Object.keys(productEntries).map((slug) => `/${slug}`)
    : [];
  const lastmod: string | undefined = undefined;

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
