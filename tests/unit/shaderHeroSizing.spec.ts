import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../src/components/HeroBackground.tsx', import.meta.url), 'utf8');

test('HeroBackground no longer references shader sizing variables', () => {
  assert.ok(
    !SOURCE.includes('--hero-shader-base'),
    'HeroBackground should not define shader sizing CSS variables after removing the shader backdrop'
  );
});
