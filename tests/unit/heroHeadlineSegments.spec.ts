import { test } from 'node:test';
import assert from 'node:assert/strict';

test('buildHeroHeadlineSegments uses subtitle as leading gradient segment', async () => {
  const { buildHeroHeadlineSegments } = await import('../../src/components/heroConstants.ts');
  const segments = buildHeroHeadlineSegments({
    subtitle: 'Work x10,000 faster.',
    title: 'Your Design Toolkit, Reinvented.',
  });

  assert.equal(segments.length, 2, 'Subtitle + single sentence title should produce two segments');
  assert.deepEqual(
    segments[0],
    {
      text: 'Work x10,000 faster.',
      gradient: true,
      key: 'subtitle',
    },
    'Subtitle should render first with gradient styling',
  );
  assert.deepEqual(
    segments[1],
    {
      text: 'Your Design Toolkit, Reinvented.',
      gradient: false,
      key: 'title-first',
    },
    'Title sentence should follow without gradient',
  );
});

test('buildHeroHeadlineSegments falls back to title when subtitle missing', async () => {
  const { buildHeroHeadlineSegments } = await import('../../src/components/heroConstants.ts');
  const segments = buildHeroHeadlineSegments({
    subtitle: undefined,
    title: 'Work x10,000 faster. Your Design Toolkit, Reinvented.',
  });

  assert.equal(segments.length, 2, 'Multi-sentence title should produce two segments');
  assert.deepEqual(
    segments[0],
    {
      text: 'Work x10,000 faster.',
      gradient: true,
      key: 'title-first',
    },
    'First title sentence should gain gradient when subtitle absent',
  );
  assert.deepEqual(
    segments[1],
    {
      text: 'Your Design Toolkit, Reinvented.',
      gradient: false,
      key: 'title-remainder-0',
    },
    'Remaining title should render without gradient',
  );
});
