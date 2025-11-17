import { test } from 'node:test';
import assert from 'node:assert/strict';

const EXPECTED_DESCRIPTION =
  'Instantly standardize your Figma variant names with one-click renaming that aligns with Material, Carbon, and Polaris design systems.';

test('AI Rename Variants content uses new description without benefits list', async () => {
  const { loadPublishedContent } = await import('../../src/lib/publishedContent.ts');
  const content = loadPublishedContent();
  const product = content?.products?.['ai-rename-variants'];

  assert.ok(product, 'AI Rename Variants product should exist in published content');
  assert.equal(
    product.description,
    EXPECTED_DESCRIPTION,
    'AI Rename Variants description should match the approved marketing copy'
  );

  const benefits = (product as any)?.benefits;
  const noBenefitsConfigured =
    benefits === undefined || (Array.isArray(benefits) && benefits.length === 0);

  assert.equal(
    noBenefitsConfigured,
    true,
    'AI Rename Variants should not expose a benefits list'
  );

  const featuresEntry = Array.isArray(content?.features)
    ? content.features.find((item: any) => item?.title === 'AI Rename Variants')
    : null;

  assert.ok(featuresEntry, 'Homepage features list should include AI Rename Variants card');
  assert.equal(
    featuresEntry.description,
    EXPECTED_DESCRIPTION,
    'Homepage card description should align with AI Rename Variants messaging'
  );
  assert.equal(
    Array.isArray(featuresEntry.topItems) && featuresEntry.topItems.length === 0,
    true,
    'Homepage card should not display a bullet list for AI Rename Variants'
  );
});
