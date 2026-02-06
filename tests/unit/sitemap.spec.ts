import { test } from 'node:test';
import assert from 'node:assert/strict';

test('sitemap includes live routes and excludes dead ones', async () => {
  // Using the builder keeps the test independent from Netlify wrappers.
  const { buildSitemapXml } = await import('../../netlify/functions/sitemap.ts');
  const xml = buildSitemapXml('https://www.bibliokit.com');

  const expecteds = [
    '/figma-component-variant-renamer', // Canonical URL (not /biblio-rename or /ai-rename-variants)
    '/blog',
    '/blog/remove-prototype-links-in-figma',
    '/resources/remove-prototype-link',
    '/'
  ];

  for (const slug of expecteds) {
    assert.match(xml, new RegExp(`<loc>https://www\\.bibliokit\\.com${slug}</loc>`), `sitemap should include ${slug}`);
  }

  assert.doesNotMatch(xml, /<loc>https:\/\/www\.bibliokit\.com\/product<\/loc>/, 'sitemap should not include retired /product path');
  assert.doesNotMatch(xml, /bibliokit-blocks/, 'sitemap should not reference bibliokit-blocks');
  // uxbiblio is excluded from sitemap via EXCLUDED_PRODUCT_SLUGS
  assert.doesNotMatch(xml, /<loc>https:\/\/www\.bibliokit\.com\/uxbiblio<\/loc>/, 'sitemap should exclude uxbiblio');
});

test('sitemap normalizes non-www URLs to www.bibliokit.com', async () => {
  const { buildSitemapXml } = await import('../../netlify/functions/sitemap.ts');

  // When Netlify provides a non-www URL, sitemap should still use www
  const xml = buildSitemapXml('https://bibliokit.com');

  assert.match(xml, /https:\/\/www\.bibliokit\.com/, 'sitemap should use www domain');
  assert.doesNotMatch(xml, /<loc>https:\/\/bibliokit\.com\/[^<]*<\/loc>/, 'sitemap should not have non-www URLs');
});
