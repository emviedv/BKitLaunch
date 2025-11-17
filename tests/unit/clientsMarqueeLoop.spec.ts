import { test } from 'node:test';
import assert from 'node:assert/strict';

test('buildLoopedClients duplicates entries to sustain marquee loop', async () => {
  const { buildLoopedClients, CLIENT_LOOP_MIN_LENGTH } = await import('../../src/components/clientsMarqueeLoop.ts');
  const sample = [{ name: 'A' }, { name: 'B' }, { name: 'C' }] as any[];

  const looped = buildLoopedClients(sample);

  assert.equal(looped.length >= CLIENT_LOOP_MIN_LENGTH, true, 'looped list should meet minimum length');
  assert.equal(looped.length % sample.length, 0, 'looped length should be multiple of original');
  assert.equal(looped[0].name, 'A');
  assert.equal(looped[3].name, 'A', 'sequence should repeat in order');
});

test('buildLoopedClients returns empty array when no clients provided', async () => {
  const { buildLoopedClients } = await import('../../src/components/clientsMarqueeLoop.ts');
  const looped = buildLoopedClients([]);
  assert.equal(looped.length, 0);
});
