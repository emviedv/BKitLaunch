import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('App wiring references product routes before 404 fallback', () => {
  const source = readFileSync(new URL('../../src/App.tsx', import.meta.url), 'utf8');

  const aiRouteIndex = source.indexOf('ROUTE_PATHS.AI_RENAME_VARIANTS');
  const uxbiblioRouteIndex = source.indexOf('ROUTE_PATHS.UXBIBLIO');
  const notFoundIndex = source.indexOf('404 - Page Not Found');

  assert.ok(aiRouteIndex !== -1, 'App should route AI Rename Variants before 404 fallback');
  assert.ok(uxbiblioRouteIndex !== -1, 'App should route UXBiblio before 404 fallback');
  assert.ok(
    aiRouteIndex < notFoundIndex && uxbiblioRouteIndex < notFoundIndex,
    'Product routes should appear before the 404 route'
  );
});
