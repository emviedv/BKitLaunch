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
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /max-image-preview:large/);
    await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute('content', /max-snippet:-1/);
    await expect(page.locator('meta[name="bingbot"]')).toHaveAttribute('content', /index/);
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /BiblioKit/i);

    const structuredDataLocator = page.locator('script[type="application/ld+json"]');
    await expect(structuredDataLocator).toHaveCount(1);
    const structuredData = await structuredDataLocator.first().textContent();
    expect(structuredData).not.toBeNull();
    expect(structuredData!).toContain('"@graph"');
    expect(structuredData!).toContain('"Organization"');

    expect(errors, 'No console errors on load').toEqual([]);
  });

  test('waitlist form renders without admin controls', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/`);

    await expect(page.locator('#waitlist form')).toBeVisible();
    await expect(page.locator('button[title="Admin Access"]')).toHaveCount(0);
  });

  test('docs page renders', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/docs`);
    await expect(page.locator('h1')).toHaveText(/Documentation/i);
  });
});
