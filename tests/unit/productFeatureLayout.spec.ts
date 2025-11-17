import { test } from 'node:test';
import assert from 'node:assert/strict';

test('feature layout keeps media left and text right by default', async () => {
  const { computeFeatureLayout } = await import('../../src/components/productContentSectionLayout.ts');

  const even = computeFeatureLayout({ index: 0 });
  assert.equal(
    even.media.includes('lg:col-start-1'),
    true,
    'even index media block should start at column 1'
  );
  assert.equal(
    even.text.includes('lg:col-start-5'),
    true,
    'even index text block should start at column 5'
  );
  assert.equal(
    even.media.includes('lg:order-1'),
    true,
    'even index media block should render before text'
  );
  assert.equal(
    even.text.includes('lg:order-2'),
    true,
    'even index text block should render after media'
  );

  const odd = computeFeatureLayout({ index: 1 });
  assert.equal(
    odd.media.includes('lg:col-start-1'),
    true,
    'odd index media block should remain left-aligned'
  );
  assert.equal(
    odd.text.includes('lg:col-start-5'),
    true,
    'odd index text block should remain right-aligned'
  );
  assert.equal(
    odd.media.includes('lg:order-1'),
    true,
    'odd index media block should render before text at large breakpoints'
  );
  assert.equal(
    odd.text.includes('lg:order-2'),
    true,
    'odd index text block should render after media at large breakpoints'
  );
});

test('feature layout alternates when requested', async () => {
  const { computeFeatureLayout } = await import('../../src/components/productContentSectionLayout.ts');

  const alternatingOdd = computeFeatureLayout({ index: 1, alternate: true });
  assert.equal(
    alternatingOdd.text.includes('lg:col-start-1'),
    true,
    'when alternate is enabled, odd index text block should shift to column 1'
  );
  assert.equal(
    alternatingOdd.media.includes('lg:col-start-7'),
    true,
    'when alternate is enabled, odd index media block should move to the right'
  );
  assert.equal(
    alternatingOdd.media.includes('lg:order-2'),
    true,
    'when alternate is enabled, odd index media block should render after text at large breakpoints'
  );
  assert.equal(
    alternatingOdd.text.includes('lg:order-1'),
    true,
    'when alternate is enabled, odd index text block should render before media at large breakpoints'
  );
});
