import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const previewPath = path.join(process.cwd(), 'public', 'badge-variants.html');
const fixturePath = path.join(process.cwd(), 'tests', 'contract', 'fixtures', 'badge-preview.contract.json');

const debug = (message: string, data?: unknown) => {
  if (process.env.DEBUG_FIX === '1') {
    // eslint-disable-next-line no-console
    console.info('[DEBUG_FIX][badge-preview-contract]', message, data ?? '');
  }
};

type Pair = { status: string; icon: string };
type Fixture = {
  happyPath: { requiredStatusIconPairs: Pair[] };
  edgeVariant: { disallowedStatusIconPairs: Pair[] };
};

const html = fs.readFileSync(previewPath, 'utf8');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as Fixture;

describe('badge preview contract', () => {
  it('meets canonical status icon mapping fixture', () => {
    fixture.happyPath.requiredStatusIconPairs.forEach(({ status, icon }) => {
      assert.match(
        html,
        new RegExp(`data-status="${status}"[\\s\\S]*?data-icon="${icon}"`),
        `status ${status} should map to icon ${icon}`
      );
    });

    debug('happy path mapping verified', fixture.happyPath.requiredStatusIconPairs);
  });

  it('rejects known bad status icon mapping (edge fixture)', () => {
    fixture.edgeVariant.disallowedStatusIconPairs.forEach(({ status, icon }) => {
      assert.doesNotMatch(
        html,
        new RegExp(`data-status="${status}"[\\s\\S]*?data-icon="${icon}"`),
        `status ${status} should not map to icon ${icon}`
      );
    });

    debug('edge mapping verified', fixture.edgeVariant.disallowedStatusIconPairs);
  });
});
