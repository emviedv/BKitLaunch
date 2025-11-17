import { test } from 'node:test';
import assert from 'node:assert/strict';

const EXPECTED_COPY =
  'From idea to hand-off, faster than ever. High-performers teams rely on our Figma plugins to stay consistent, connected, and miles ahead.';

test('AI Rename Variants features description matches approved messaging', async () => {
  const { AI_RENAME_FEATURES_DESCRIPTION } = await import('../../src/components/aiRenameVariantsCopy.ts');

  assert.equal(
    AI_RENAME_FEATURES_DESCRIPTION,
    EXPECTED_COPY,
    'AI Rename Variants features description should match the approved messaging'
  );
});
