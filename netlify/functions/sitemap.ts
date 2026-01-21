import type { Handler } from '@netlify/functions';
import { withCors } from './utils.ts';
import productData from '../../src/data/products.json' with { type: 'json' };
import { BLOG_POSTS, type BlogPost } from '../../src/data/blogPosts.ts';

type ImageEntry = {
  loc: string;
  title?: string;
  caption?: string;
};

type SitemapEntry = {
  path: string;
  lastmod?: string;
  images?: ImageEntry[];
  changefreq?: string;
  priority?: string;
};

const DEFAULT_CHANGEFREQ = 'weekly';
const DEFAULT_PRIORITY = '0.8';
const EXCLUDED_PRODUCT_SLUGS = new Set(['uxbiblio']);

const canonicalizeSlug = (slug: string): string => {
  const slugMap: Record<string, string> = {
    'ai-rename-variants': 'figma-component-variant-renamer',
    'biblio-rename': 'figma-component-variant-renamer',
    'biblio-audit': 'figma-design-system-audit-plugin',
    'biblio-clean': 'figma-plugin-remove-prototype-links',
    'biblio-organize': 'figma-organize-design-files-plugin',
    'biblio-states': 'figma-component-states',
    'biblio-table': 'figma-table-builder',
  };
  return slugMap[slug] || slug;
};

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

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toAbsoluteUrl = (base: string, input?: string | null): string | null => {
  if (!input || typeof input !== 'string') return null;
  try {
    const parsed = new URL(input);
    return parsed.toString();
  } catch {
    // Normalize path to match SEO canonical URL format
    let normalized = input.startsWith('/') ? input : `/${input}`;
    // Remove trailing slashes (except for root path) to match SEO normalization
    const normalizedPath = normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
    return `${base}${normalizedPath}`;
  }
};

const toIsoDate = (value?: string | number | Date | null, fallback?: string): string | undefined => {
  if (value === null || value === undefined) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString().split('T')[0];
};

const renderImage = (image: ImageEntry): string => {
  const pieces = [
    `<image:loc>${escapeXml(image.loc)}</image:loc>`,
    image.title ? `<image:title>${escapeXml(image.title)}</image:title>` : null,
    image.caption ? `<image:caption>${escapeXml(image.caption)}</image:caption>` : null
  ].filter(Boolean);

  return `    <image:image>\n      ${pieces.join('\n      ')}\n    </image:image>`;
};

const renderUrl = (base: string, entry: SitemapEntry): string => {
  const loc = toAbsoluteUrl(base, entry.path);
  if (!loc) return '';

  const parts = [
    `<loc>${escapeXml(loc)}</loc>`,
    entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : null,
    `<changefreq>${escapeXml(entry.changefreq || DEFAULT_CHANGEFREQ)}</changefreq>`,
    `<priority>${escapeXml(entry.priority || DEFAULT_PRIORITY)}</priority>`
  ].filter(Boolean);

  const images = Array.isArray(entry.images) ? entry.images.filter((img) => img && img.loc) : [];
  const imageXml = images.map(renderImage).join('\n');
  const body = [parts.join('\n    '), imageXml].filter(Boolean).join('\n    ');

  return `  <url>\n    ${body}\n  </url>`;
};

const resolveProductImages = (base: string, slug: string, product: any): ImageEntry[] => {
  const canonicalSlug = canonicalizeSlug(slug);
  const imageSources = new Set<string>();

  if (typeof product?.heroImage === 'string') {
    const heroUrl = toAbsoluteUrl(base, product.heroImage);
    if (heroUrl) imageSources.add(heroUrl);
  }

  const features = Array.isArray((productData as any)?.features) ? (productData as any).features : [];
  const matchedFeature = features.find(
    (feature: any) => typeof feature?.buttonLink === 'string' && feature.buttonLink.includes(canonicalSlug)
  );
  if (matchedFeature?.media?.src) {
    const featureUrl = toAbsoluteUrl(base, matchedFeature.media.src);
    if (featureUrl) imageSources.add(featureUrl);
  }

  if (imageSources.size === 0 && slug === 'uxbiblio') {
    const fallbackUrl = toAbsoluteUrl(base, '/media/uxbiblio-cover.png');
    if (fallbackUrl) imageSources.add(fallbackUrl);
  }

  if (imageSources.size === 0) {
    imageSources.add(`${base}/og/og-default.svg`);
  }

  return Array.from(imageSources).map((loc) => ({
    loc,
    title: product?.title || slug,
    caption: product?.description || product?.title
  }));
};

const buildBlogEntries = (base: string, defaultLastmod: string): SitemapEntry[] => {
  return BLOG_POSTS.map((post: BlogPost) => {
    const hero = toAbsoluteUrl(base, post.heroImage);
    const images: ImageEntry[] = hero
      ? [
          {
            loc: hero,
            title: post.title,
            caption: post.heroImageAlt || post.title
          }
        ]
      : [];

    return {
      path: `/blog/${post.slug}`,
      lastmod: toIsoDate((post as any).lastUpdated, defaultLastmod),
      images,
      changefreq: 'monthly',
      priority: '0.7'
    };
  });
};

export const buildSitemapXml = (baseUrl: string): string => {
  const base = normalizeBase(baseUrl);
  const defaultLastmod = toIsoDate(process.env.BUILD_TIMESTAMP || Date.now()) || new Date().toISOString().split('T')[0];

  const staticEntries: SitemapEntry[] = [
    {
      path: '/',
      lastmod: defaultLastmod,
      priority: '1.0',
      changefreq: 'weekly',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'BiblioKit Homepage' }]
    },
    { path: '/figma-component-variant-renamer', lastmod: defaultLastmod },
    { path: '/figma-plugin-remove-prototype-links', lastmod: defaultLastmod },
    { path: '/figma-design-system-audit-plugin', lastmod: defaultLastmod },
    { path: '/figma-table-builder', lastmod: defaultLastmod },
    { path: '/figma-component-states', lastmod: defaultLastmod },
    { path: '/figma-organize-design-files-plugin', lastmod: defaultLastmod },
    {
      path: '/blog',
      lastmod: defaultLastmod,
      changefreq: 'weekly',
      priority: '0.6',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'BiblioKit Blog' }]
    },
    {
      path: '/products',
      lastmod: defaultLastmod,
      changefreq: 'weekly',
      priority: '0.7',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'BiblioKit Products' }]
    },
    {
      path: '/resources',
      lastmod: defaultLastmod,
      changefreq: 'monthly',
      priority: '0.6',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'BiblioKit Resources' }]
    },
    {
      path: '/learn',
      lastmod: defaultLastmod,
      changefreq: 'monthly',
      priority: '0.6',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'BiblioKit Learn' }]
    },
    {
      path: '/learn/design-ops-fundamentals',
      lastmod: defaultLastmod,
      changefreq: 'monthly',
      priority: '0.6',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'Design Ops Fundamentals' }]
    },
    {
      path: '/tutorials',
      lastmod: defaultLastmod,
      changefreq: 'weekly',
      priority: '0.6',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'Figma Tutorials' }]
    },
    {
      path: '/resources/remove-prototype-link',
      lastmod: defaultLastmod,
      changefreq: 'monthly',
      priority: '0.6',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'Remove Prototype Link resource' }]
    },
    {
      path: '/figma-marketing-resizer-plugin',
      lastmod: defaultLastmod,
      changefreq: 'weekly',
      priority: '0.8',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'Figma Marketing Resizer Plugin' }]
    },
    {
      path: '/about',
      lastmod: defaultLastmod,
      changefreq: 'monthly',
      priority: '0.5',
      images: [{ loc: `${base}/og/og-default.svg`, title: 'About BiblioKit' }]
    }
  ];

  const productEntries = (productData as any)?.products;
  const dynamicProductEntries: SitemapEntry[] = productEntries
    ? Object.keys(productEntries)
        .filter((slug) => !EXCLUDED_PRODUCT_SLUGS.has(slug))
        .map((slug) => ({
          path: `/${canonicalizeSlug(slug)}`,
          lastmod: toIsoDate((productEntries as any)?.[slug]?.lastUpdated, defaultLastmod),
          images: resolveProductImages(base, slug, (productEntries as any)[slug])
        }))
    : [];

  const blogEntries = Array.isArray(BLOG_POSTS) ? buildBlogEntries(base, defaultLastmod) : [];

  const entries = [...staticEntries, ...dynamicProductEntries, ...blogEntries];
  const deduped = Array.from(
    entries.reduce((map, entry) => {
      const key = entry.path;
      const existing = map.get(key);
      if (existing) {
        const mergedImages = [...(existing.images || []), ...(entry.images || [])];
        map.set(key, {
          ...existing,
          ...entry,
          lastmod: entry.lastmod || existing.lastmod,
          changefreq: entry.changefreq || existing.changefreq,
          priority: entry.priority || existing.priority,
          images: mergedImages
        });
      } else {
        map.set(key, entry);
      }
      return map;
    }, new Map<string, SitemapEntry>())
  ).map(([, entry]) => entry);

  const urls = deduped
    .map((entry) => renderUrl(base, entry))
    .filter(Boolean)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`;
};

const handlerImpl: Handler = async () => {
  // Use the same base URL logic as the SEO system for consistency
  const base = normalizeBase(
    process.env.PUBLIC_SITE_URL ||
    process.env.URL ||
    process.env.DEPLOY_URL ||
    'https://www.bibliokit.com'
  );

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
