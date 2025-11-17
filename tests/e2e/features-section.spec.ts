import { test, expect } from '@playwright/test';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const content = require('../../src/data/products.json');
const featureItems = Array.isArray(content.features)
  ? content.features
  : Array.isArray(content.features?.items)
    ? content.features.items
    : [];
const featureTitle = content.featuresSection?.title || content.features?.title || '';
const firstFeatureTitle = featureItems[0]?.title || featureItems[0]?.idea || '';

test.describe('Features section end-to-end', () => {
  test('renders bundled features content', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/`);

    const featuresSection = page.locator('section#features');
    await expect(featuresSection).toBeVisible();

    if (featureTitle) {
      await expect(featuresSection.locator('h2')).toHaveText(featureTitle);
    }

    const featureCards = featuresSection.locator('h3');

    if (firstFeatureTitle) {
      await expect(featureCards.first()).toContainText(firstFeatureTitle);
    }

    if (featureItems.length) {
      await expect(featureCards).toHaveCount(featureItems.length);
    }
  });
});
