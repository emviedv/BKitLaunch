import { test } from 'node:test';
import assert from 'node:assert/strict';

test('header navigation links are enabled in published settings', async () => {
  const { loadPublishedContent } = await import('../../src/lib/publishedContent.ts');
  const content = loadPublishedContent();

  assert.equal(
    content?.settings?.visibility?.headerNavLinks !== false,
    true,
    'headerNavLinks visibility should be enabled so top nav renders all links'
  );

  const nav = content?.header?.navigation;
  assert.ok(Array.isArray(nav) && nav.length > 0, 'header navigation should include at least one link');
});
