import { test } from 'node:test';
import assert from 'node:assert/strict';

test('product routes are exposed in ROUTE_PATHS', async () => {
  const { ROUTE_PATHS } = await import('../../src/config/routes.ts');

  assert.equal(
    ROUTE_PATHS.AI_RENAME_VARIANTS,
    '/ai-rename-variants',
    'ROUTE_PATHS should expose AI Rename Variants page path'
  );
  assert.equal(
    ROUTE_PATHS.UXBIBLIO,
    '/uxbiblio',
    'ROUTE_PATHS should expose UXBiblio page path'
  );
});
