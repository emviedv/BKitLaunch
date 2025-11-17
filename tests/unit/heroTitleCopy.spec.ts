import { test } from 'node:test';
import assert from 'node:assert/strict';

const EXPECTED_TITLE = 'Your Design Toolkit, Reinvented.';

test('hero title uses action/benefit driven copy', async () => {
  const { loadPublishedContent } = await import('../../src/lib/publishedContent.ts');
  const content = loadPublishedContent();

  assert.equal(
    content?.hero?.title,
    EXPECTED_TITLE,
    'Homepage hero title should use the approved action/benefit copy'
  );
});
