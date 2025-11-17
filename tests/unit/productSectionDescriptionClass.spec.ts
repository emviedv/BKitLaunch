import { test } from 'node:test';
import assert from 'node:assert/strict';

test('section description uses hero-matching 20px typography', async () => {
  const { SECTION_DESCRIPTION_CLASS } = await import('../../src/components/productContentSectionConstants.ts');
  assert.equal(
    SECTION_DESCRIPTION_CLASS,
    'text-[20px] leading-7 text-muted-foreground',
    'Section description typography should match hero description size'
  );
});
