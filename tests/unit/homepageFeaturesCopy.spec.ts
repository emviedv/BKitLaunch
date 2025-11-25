import { test } from 'node:test';
import assert from 'node:assert/strict';

const EXPECTED_COPY =
  'From idea to hand-off, faster than ever. Stay consistent, connected, and miles ahead with the BiblioKit plugin suite.';

test('homepage features section description matches approved messaging', async () => {
  const { loadPublishedContent } = await import('../../src/lib/publishedContent.ts');
  const content = loadPublishedContent();

  assert.equal(
    content?.featuresSection?.description,
    EXPECTED_COPY,
    'Homepage features section description should align with marketing copy'
  );
});
