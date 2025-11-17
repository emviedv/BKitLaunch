import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('landing hero gradient backdrop class has been removed', async () => {
  const heroConstants = await import('../../src/components/heroConstants.ts');
  assert.equal(
    heroConstants.HERO_GRADIENT_BACKDROP_CLASS,
    undefined,
    'HERO_GRADIENT_BACKDROP_CLASS should be undefined once the background is removed'
  );
});

test('HeroBackground is now a no-op placeholder', () => {
  const source = readFileSync(new URL('../../src/components/HeroBackground.tsx', import.meta.url), 'utf8');

  assert.ok(
    source.includes('return null;'),
    'HeroBackground component should return null after background removal'
  );
});
