import { test } from 'node:test';
import assert from 'node:assert/strict';

test('logLandingHeroBackgroundState logs via provided logger without debug gating', async () => {
  const { logLandingHeroBackgroundState } = await import('../../src/components/heroInstrumentation.ts');

  const entries: Array<{ message: string; data: any }> = [];
  const fakeLogger = (message: string, data: any) => {
    entries.push({ message, data });
  };

  logLandingHeroBackgroundState(
    { hasHeroContent: true, comingSoonEnabled: false, backgroundEnabled: false },
    fakeLogger
  );

  assert.equal(entries.length, 1, 'Expected a log entry even without DEBUG_FIX');
  assert.equal(entries[0]?.message, 'hero:landing-background-active');
  assert.deepEqual(entries[0]?.data, {
    hasHeroContent: true,
    comingSoonEnabled: false,
    backgroundEnabled: false,
  });
});
