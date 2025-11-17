import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const heroSource = readFileSync(new URL('../../src/components/Hero.tsx', import.meta.url), 'utf8');

test('hero headline keeps gradient class on the first sentence', () => {
  assert.ok(
    heroSource.includes('segment.gradient ? HERO_HEADLINE_GRADIENT_CLASS : \'\''),
    'Hero heading should conditionally apply HERO_HEADLINE_GRADIENT_CLASS to gradient segments'
  );
});
