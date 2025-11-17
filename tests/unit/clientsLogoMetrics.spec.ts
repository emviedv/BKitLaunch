import { test } from 'node:test';
import assert from 'node:assert/strict';

test('client logo scaled size is 20 percent larger than base', async () => {
  const { CLIENT_LOGO_BASE_PX, CLIENT_LOGO_SCALE, CLIENT_LOGO_HEIGHT_PX } = await import('../../src/components/clientsLogoMetrics.ts');
  assert.equal(CLIENT_LOGO_SCALE, 1.2, 'logo scale should remain at 20%');
  assert.equal(CLIENT_LOGO_HEIGHT_PX, Math.round(CLIENT_LOGO_BASE_PX * CLIENT_LOGO_SCALE * 10) / 10, 'scaled height should reflect 20% increase');
});
