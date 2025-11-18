import { test } from 'node:test';
import assert from 'node:assert/strict';

test('sitemap includes live routes and excludes dead ones', async () => {
  // Using the builder keeps the test independent from Netlify wrappers.
  const { buildSitemapXml } = await import('../../netlify/functions/sitemap.ts');
  const xml = buildSitemapXml('https://www.bibliokit.com');

  const expecteds = [
    '/ai-rename-variants',
    '/uxbiblio',
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
});
