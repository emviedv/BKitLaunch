import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('loadPublishedContent returns bundled static content', async () => {
  const { loadPublishedContent } = await import('../../src/lib/publishedContent.ts');
  const bundled = JSON.parse(
    readFileSync(new URL('../../src/data/products.json', import.meta.url), 'utf8')
  );

  const result = loadPublishedContent();

  assert.deepStrictEqual(result, bundled, 'static loader should match bundled JSON');
});

test('published content loader avoids static Node-only imports', () => {
  const source = readFileSync(new URL('../../src/lib/publishedContent.ts', import.meta.url), 'utf8');
  assert.equal(
    source.includes("import { createRequire }"),
    false,
    'loader should not statically import createRequire'
  );
});
