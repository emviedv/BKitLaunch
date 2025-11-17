import { test } from 'node:test';
import assert from 'node:assert/strict';

test('hero title uses 72px typography', async () => {
  const { HERO_TITLE_CLASS } = await import('../../src/components/heroConstants.ts');
  assert.equal(
    HERO_TITLE_CLASS,
    'text-[72px] font-bold tracking-tight leading-[1.05] text-foreground',
    'Hero title should be set to 72px'
  );
});
