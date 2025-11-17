import { test, expect } from '@playwright/test';

test.describe('Editor regression coverage', () => {
  test('no content editor controls are exposed', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/`);
    await expect(page.locator('button[title="Edit Content"]')).toHaveCount(0);
  });
});

