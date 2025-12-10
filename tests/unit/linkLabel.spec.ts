import { test } from 'node:test';
import assert from 'node:assert/strict';

import { prettifyUrlLabel, sanitizeUrl } from '../../src/lib/linkLabel.ts';

test('prettifyUrlLabel strips protocol and trims long URLs', () => {
  const raw =
    'https://www.figma.com/community/plugin/1523817290746945616/batch-rename-variants-properties-ai-assisted';
  const label = prettifyUrlLabel(raw);

  assert.equal(label.startsWith('figma.com'), true);
  assert.equal(label.includes('https://'), false);
  assert.equal(label.length <= 48, true);
});

test('prettifyUrlLabel keeps host when path is empty', () => {
  const raw = 'https://www.example.com/';
  const label = prettifyUrlLabel(raw);
  assert.equal(label, 'example.com');
});

test('sanitizeUrl removes whitespace inside URLs', () => {
  const raw = 'https: //www.example.com/path?a=1#hash';
  const sanitized = sanitizeUrl(raw);
  assert.equal(sanitized, 'https://www.example.com/path?a=1#hash');
});
