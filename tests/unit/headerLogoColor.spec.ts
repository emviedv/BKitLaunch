import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const CSS = readFileSync(new URL('../../src/index.css', import.meta.url), 'utf8');

test('header logo renders in white', () => {
  const logoRule = CSS.includes('.text-logo');
  assert.ok(logoRule, 'index.css should define the .text-logo utility');
  assert.ok(
    CSS.includes('color: #ffffff;'),
    '.text-logo should set the logo color to pure white'
  );
});
