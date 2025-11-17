import { test } from 'node:test';
import assert from 'node:assert/strict';

test('hero primary button class matches shared usage', async () => {
  const { HERO_PRIMARY_BUTTON_CLASS } = await import('../../src/components/heroConstants.ts');
  assert.equal(
    HERO_PRIMARY_BUTTON_CLASS,
    'w-full sm:w-auto min-w-[12rem]',
    'Primary button class should remain consistent across hero and cards'
  );
});
