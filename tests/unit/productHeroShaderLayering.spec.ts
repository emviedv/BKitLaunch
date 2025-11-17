import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../src/components/ProductHero.tsx', import.meta.url), 'utf8');

test('ProductHero no longer imports HeroBackground', () => {
  assert.ok(
    !SOURCE.includes("HeroBackground"),
    'ProductHero should stop importing or rendering the HeroBackground component after removal'
  );
});
