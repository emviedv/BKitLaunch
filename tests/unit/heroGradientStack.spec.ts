import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../src/components/HeroBackground.tsx', import.meta.url), 'utf8');

test('hero background no longer references gradient classes', () => {
  assert.ok(
    !SOURCE.includes('hero-gradient-layer'),
    'HeroBackground component should not reference gradient layer classes after removal'
  );
  assert.ok(
    !SOURCE.includes('hero-gradient-overlay'),
    'HeroBackground component should not render the overlay after background removal'
  );
});
