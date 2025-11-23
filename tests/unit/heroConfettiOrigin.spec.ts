import { test } from 'node:test';
import assert from 'node:assert/strict';

test('calculateConfettiOrigin reports the CTA center relative to the viewport', async () => {
  const { calculateConfettiOrigin } = await import('../../src/lib/confettiOrigin.ts');

  const result = calculateConfettiOrigin(
    { left: 100, top: 200, width: 160, height: 40 },
    { width: 800, height: 1000 }
  );

  assert.ok(Math.abs(result.x - 0.225) < 0.0001, 'Expected origin.x to match CTA center ratio');
  assert.ok(Math.abs(result.y - 0.22) < 0.0001, 'Expected origin.y to match CTA center ratio');
});

test('calculateConfettiOrigin clamps coordinates into the viewport bounds', async () => {
  const { calculateConfettiOrigin } = await import('../../src/lib/confettiOrigin.ts');

  const result = calculateConfettiOrigin(
    { left: -600, top: 1200, width: 200, height: 50 },
    { width: 800, height: 1000 }
  );

  assert.equal(result.x, 0, 'Values left of the viewport clamp to 0');
  assert.equal(result.y, 1, 'Values below the viewport clamp to 1');
});
