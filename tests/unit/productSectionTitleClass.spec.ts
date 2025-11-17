import { test } from 'node:test';
import assert from 'node:assert/strict';

test('section title matches hero title scale clamp', async () => {
  const { SECTION_TITLE_CLASS } = await import('../../src/components/productContentSectionConstants.ts');
  assert.equal(
    SECTION_TITLE_CLASS,
    'text-[72px] font-bold tracking-tight leading-[1.05] text-foreground',
    'section heading should match hero 72px typography'
  );
});
