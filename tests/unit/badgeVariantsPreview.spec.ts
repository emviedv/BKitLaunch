import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const previewPath = path.join(process.cwd(), 'public', 'badge-variants.html');

const debug = (message: string, data?: unknown) => {
  if (process.env.DEBUG_FIX === '1') {
    // eslint-disable-next-line no-console
    console.info('[DEBUG_FIX][badge-preview]', message, data ?? '');
  }
};

test('badge preview exists and reflects consolidated badge component context', () => {
  assert.ok(fs.existsSync(previewPath), 'badge preview page should exist at public/badge-variants.html');

  const html = fs.readFileSync(previewPath, 'utf8');
  debug('loaded preview html', { length: html.length });

  assert.match(
    html,
    /Consolidated Badge Component Preview/,
    'preview should clearly indicate consolidated badge component context'
  );

  assert.match(
    html,
    /src\/components\/ui\/badge\.tsx/,
    'preview should reference the source of truth badge component file'
  );
});

test('status chip previews are icon-led and cover launched/coming-soon/beta', () => {
  const html = fs.readFileSync(previewPath, 'utf8');

  const expectedStatuses = ['launched', 'coming-soon', 'beta'] as const;
  const expectedIcons = ['sparkles', 'clock', 'zap'] as const;

  expectedStatuses.forEach((status) => {
    assert.match(
      html,
      new RegExp(`data-status="${status}"`),
      `status preview should include ${status}`
    );
  });

  expectedIcons.forEach((icon) => {
    assert.match(
      html,
      new RegExp(`data-icon="${icon}"`),
      `status preview should include ${icon} icon treatment`
    );
  });

  debug('status/icon assertions passed', { expectedStatuses, expectedIcons });
});
