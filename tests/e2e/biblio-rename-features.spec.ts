import { test, expect } from '@playwright/test';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const content = require('../../src/data/products.json');
const product = content?.products?.['biblio-rename'] ?? content?.products?.['ai-rename-variants'] ?? {};
const productDetails = Array.isArray(product?.details) ? product.details : [];
const firstDetailTitle = productDetails[0]?.title ?? '';
const firstDetailDescription = productDetails[0]?.description ?? '';

test.describe('BiblioRename feature content', () => {
  test('renders feature cards from published content bundle', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/biblio-rename`);
    await page.waitForURL('**/biblio-rename');

    const featuresSection = page.locator('section', { has: page.locator('h2', { hasText: 'Rename smarter, not harder.' }) });
    await expect(featuresSection).toBeVisible();

    const featureCards = featuresSection.locator('article h3');
    const featureDescriptions = featuresSection.locator('article p');

    if (productDetails.length) {
      await expect(featureCards).toHaveCount(productDetails.length);
      await expect(featureCards.first()).toContainText(firstDetailTitle);
    }

    if (firstDetailDescription) {
      await expect(featureDescriptions.first()).toContainText(firstDetailDescription);
    }
  });
});
