import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('ProductHero callout text uses 20px sizing', () => {
  const source = readFileSync(new URL('../../src/components/ProductHero.tsx', import.meta.url), 'utf8');
  assert.ok(
    source.includes('text-[20px] leading-7 font-medium'),
    'Callout label should use 20px size with 28px line height'
  );
});
