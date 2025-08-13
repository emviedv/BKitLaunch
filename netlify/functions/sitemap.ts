import { Handler } from '@netlify/functions';
import { withCors } from './utils';

const makeUrl = (loc: string) => `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;

const handlerImpl: Handler = async () => {
  const base = process.env.URL || 'https://bibliokit.com';
  const urls = [
    '/',
    '/product',
    '/bibliokit-blocks',
    '/ai-rename-variants',
  ].map((p) => makeUrl(`${base}${p}`)).join('\n');

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


