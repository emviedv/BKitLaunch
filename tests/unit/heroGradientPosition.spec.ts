import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const cssSource = readFileSync(new URL('../../src/index.css', import.meta.url), 'utf8');

test('hero gradient classes removed from CSS', () => {
  assert.ok(
    !cssSource.includes('.hero-gradient-layer'),
    'index.css should no longer define hero-gradient-layer'
  );
  assert.ok(
    !cssSource.includes('.hero-gradient-overlay'),
    'index.css should no longer define hero-gradient-overlay'
  );
});
