import { test } from 'node:test';
import assert from 'node:assert/strict';

test('splitHeroHeadline isolates the opening sentence', async () => {
  const { splitHeroHeadline } = await import('../../src/components/heroConstants.ts');

  const sample = 'Work x10,000 faster. Your toolkit, reinvented.';
  const result = splitHeroHeadline(sample);

  assert.equal(result.firstSentence, 'Work x10,000 faster.');
  assert.equal(result.remainder, 'Your toolkit, reinvented.');
});

test('splitHeroHeadline returns trimmed fallback when punctuation missing', async () => {
  const { splitHeroHeadline } = await import('../../src/components/heroConstants.ts');

  const sample = 'Single sentence without punctuation';
  const result = splitHeroHeadline(sample);

  assert.equal(result.firstSentence, 'Single sentence without punctuation');
  assert.equal(result.remainder, '');
});
