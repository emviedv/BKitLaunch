import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const SOURCE = readFileSync(new URL('../../src/components/HeroBackground.tsx', import.meta.url), 'utf8');

test('HeroBackground no longer bundles legacy kit piece animation', () => {
  assert.ok(
    !SOURCE.includes('const KitPiece'),
    'HeroBackground should not define the legacy KitPiece animation once the shader takes over'
  );
  assert.ok(
    !SOURCE.includes('const FloatingElement'),
    'HeroBackground should not define FloatingElement animation once the shader takes over'
  );
  assert.ok(
    !SOURCE.includes('ShaderHeroBackground'),
    'HeroBackground should not import or render the shader backdrop'
  );
});
