import type { Handler } from '@netlify/functions';
import { withCors } from './utils.ts';
import productData from '../../src/data/products.json' with { type: 'json' };
import { BLOG_POSTS } from '../../src/data/blogPosts.ts';

const makeUrl = (loc: string, lastmod?: string) => `  <url>\n    <loc>${loc}</loc>\n    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;

const normalizeBase = (raw?: string | null): string => {
  if (!raw) return 'https://www.bibliokit.com';
  try {
    const url = new URL(raw);
    return url.origin;
  } catch {
    try {
      return new URL(`https://${raw}`).origin;
    } catch {
      return 'https://www.bibliokit.com';
    }
  }
};

export const buildSitemapXml = (baseUrl: string): string => {
  const base = normalizeBase(baseUrl);
  const staticPaths = ['/', '/ai-rename-variants', '/uxbiblio', '/blog', '/resources/remove-prototype-link'];
  const productEntries = (productData as any)?.products;
  const dynamicProductPaths: string[] = productEntries
    ? Object.keys(productEntries).map((slug) => `/${slug}`)
    : [];
  const blogPaths = Array.isArray(BLOG_POSTS)
    ? BLOG_POSTS.map((post) => `/blog/${post.slug}`)
    : [];

  const lastmod: string | undefined = undefined;

  const allPaths = Array.from(new Set([...staticPaths, ...dynamicProductPaths, ...blogPaths]));
  const urls = allPaths.map((p) => makeUrl(`${base}${p}`, lastmod)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
};

const handlerImpl: Handler = async () => {
  const base =
    process.env.PUBLIC_SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_URL ||
    'https://www.bibliokit.com';

  const xml = buildSitemapXml(base);

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
