import { test } from 'node:test';
import assert from 'node:assert/strict';

test('hero description uses 22px typography', async () => {
  const { HERO_DESCRIPTION_CLASS } = await import('../../src/components/heroConstants.ts');
  assert.equal(HERO_DESCRIPTION_CLASS, 'text-[22px] leading-[1.55] text-muted-foreground');
});
