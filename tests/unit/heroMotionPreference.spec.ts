import { test } from 'node:test';
import assert from 'node:assert/strict';

const withEnvironment = async (env: {
  matchMediaMatches?: boolean;
  datasetValue?: string | undefined;
}, run: (mod: any) => Promise<void>) => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  const fakeMatchMedia = (query: string) => ({
    media: query,
    matches: !!env.matchMediaMatches,
    addEventListener: () => {},
    removeEventListener: () => {},
  });

  (globalThis as any).window = {
    matchMedia: fakeMatchMedia,
  };

  (globalThis as any).document = {
    documentElement: {
      dataset: env.datasetValue !== undefined ? { heroMotion: env.datasetValue } : {},
    },
  };

  // Dynamic import after globals are set so module sees the stubs.
  const mod = await import('../../src/components/heroMotionPreference.ts');

  try {
    await run(mod);
  } finally {
    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }

    if (originalDocument === undefined) {
      delete (globalThis as any).document;
    } else {
      (globalThis as any).document = originalDocument;
    }
  }
};

test('forced hero motion override ignores reduced-motion preference', async () => {
  await withEnvironment({ matchMediaMatches: true, datasetValue: 'on' }, async (mod) => {
    const state = mod.resolveHeroMotionPreference();
    assert.equal(state.shouldAnimate, true, 'Override should force animation on even when reduced-motion matches');
    assert.equal(state.override, 'on');
    assert.equal(state.prefersReducedMotion, true);
  });
});

test('hero motion respects reduced-motion when override is off', async () => {
  await withEnvironment({ matchMediaMatches: false, datasetValue: 'off' }, async (mod) => {
    const state = mod.resolveHeroMotionPreference();
    assert.equal(state.shouldAnimate, false, 'Override off should disable animation');
    assert.equal(state.override, 'off');
    assert.equal(state.prefersReducedMotion, false);
  });
});

test('hero motion falls back to reduced-motion preference when override unset', async () => {
  await withEnvironment({ matchMediaMatches: true, datasetValue: undefined }, async (mod) => {
    const state = mod.resolveHeroMotionPreference();
    assert.equal(state.shouldAnimate, false, 'Without override should respect reduced-motion preference');
    assert.equal(state.override, null);
    assert.equal(state.prefersReducedMotion, true);
  });
});
