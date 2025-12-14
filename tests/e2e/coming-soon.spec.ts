import { test, expect } from '@playwright/test';

test.describe('Coming Soon gate', () => {
  test('shows hero and waitlist when enabled', async ({ page }) => {
    // Assumes flag is enabled in test env or will default to false gracefully
    await page.goto('/');
    // Check that the page contains expected hero elements (title text may vary)
    await expect(page.locator('section.section-hero')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#waitlist')).toBeVisible({ timeout: 10000 });
  });
});


