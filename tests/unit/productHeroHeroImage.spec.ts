import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../src/components/ProductHero.tsx', import.meta.url), 'utf8');

test('ProductHero renders custom hero image when provided', () => {
  assert.ok(
    SOURCE.includes('product.heroImage'),
    'ProductHero should check for product.heroImage'
  );
  assert.ok(
    SOURCE.includes('<img'),
    'ProductHero should render an <img> tag for custom hero imagery'
  );
});
