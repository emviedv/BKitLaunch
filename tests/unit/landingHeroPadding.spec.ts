import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../src/components/LandingHero.tsx', import.meta.url), 'utf8');

test('Landing hero uses the shared padding token class', () => {
  assert.ok(
    SOURCE.includes('landing-hero-padding'),
    'LandingHero should apply the shared padding class so spacing can be updated globally'
  );
});

test('Landing hero does not hard-code the old padding utilities', () => {
  assert.ok(
    !SOURCE.includes('pt-[138px]') && !SOURCE.includes('pb-[128px]'),
    'LandingHero should avoid locking padding into inline Tailwind utilities'
  );
});
