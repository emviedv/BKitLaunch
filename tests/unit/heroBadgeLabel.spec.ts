import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('ProductHero strips leading emoji from badge label', () => {
  const source = readFileSync(new URL('../../src/components/ProductHero.tsx', import.meta.url), 'utf8');

  assert.ok(
    source.includes('const rawBadgeLabel'),
    'ProductHero should compute rawBadgeLabel before rendering'
  );
  assert.ok(
    source.includes("rawBadgeLabel.replace(/^[\\p{Emoji_Presentation}\\p{Emoji}\\p{Extended_Pictographic}\\s]+/gu, '').trim()"),
    'ProductHero should strip leading emoji and whitespace from badge content'
  );
  assert.ok(
    source.includes('{badgeLabel && ('),
    'ProductHero should render badge only when sanitized label is non-empty'
  );
});
