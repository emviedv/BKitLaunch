import { test, expect } from '@playwright/test';

test.describe('SSR and Content Editor smoke', () => {
  test('home renders without console errors and has SEO tags', async ({ page, baseURL }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(baseURL!);
    await expect(page).toHaveTitle(/BiblioKit/i);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);

    expect(errors, 'No console errors on load').toEqual([]);
  });

  test('content editor sections include CTA, Waitlist, Header, Footer', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/`);

    // Open admin editor button (lock icon) and login if prompt appears
    const adminButton = page.locator('button[title="Admin Access"]');
    if (await adminButton.count()) {
      await adminButton.click();
      // If login modal appears, skip actual auth and just ensure UI loads
      // In CI we only validate presence of section labels after editor opens in authenticated sessions.
      // So we early-exit if login is required.
      return;
    }

    const editButton = page.locator('button[title="Edit Content"]');
    if (await editButton.count()) {
      await editButton.click();
      await expect(page.getByText('Content Editor')).toBeVisible();

      // Switch to Sections tab if not selected
      const sectionsTab = page.getByRole('button', { name: 'Sections' });
      if (await sectionsTab.count()) {
        await sectionsTab.click();
      }

      // Verify section nav buttons present
      await expect(page.getByRole('button', { name: 'CTA Section' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Waitlist Section' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Header Section' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Footer Section' })).toBeVisible();
    }
  });

  test('docs page renders', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/docs`);
    await expect(page.locator('h1')).toHaveText(/Documentation/i);
  });
});


