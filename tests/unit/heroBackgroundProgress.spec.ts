import { test } from 'node:test';
import assert from 'node:assert/strict';

test('hero background exposes scroll progress calculator utility', async () => {
  const mod = await import('../../src/components/heroScrollProgress.ts');
  assert.equal(
    typeof (mod as any).calculateHeroScrollProgress,
    'function',
    'calculateHeroScrollProgress should be exported for scroll animation'
  );
});

test('hero scroll progress clamps to expected range', async () => {
  const mod = await import('../../src/components/heroScrollProgress.ts');
  const calculateHeroScrollProgress = (mod as any).calculateHeroScrollProgress;

  assert.equal(typeof calculateHeroScrollProgress, 'function', 'calculator missing');

  const inside = calculateHeroScrollProgress({
    scrollY: 500,
    heroTop: 400,
    heroHeight: 600
  });
  assert.ok(inside >= 0 && inside <= 1, `progress should be within [0,1], got ${inside}`);

  const before = calculateHeroScrollProgress({
    scrollY: 100,
    heroTop: 400,
    heroHeight: 600
  });
  assert.equal(
    before >= -0.3 && before <= 0,
    true,
    `progress should allow slight negative pre-scroll, got ${before}`
  );

  const past = calculateHeroScrollProgress({
    scrollY: 2000,
    heroTop: 400,
    heroHeight: 600
  });
  assert.equal(past <= 1.2, true, `progress should clamp upper bound, got ${past}`);
});
