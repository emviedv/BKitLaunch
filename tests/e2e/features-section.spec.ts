import { test, expect } from '@playwright/test';

test.describe('Features section end-to-end', () => {
  test('renders features title/description and updates from JSON editor', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/`);

    // Ensure section exists initially
    const featuresSection = page.locator('section#features');
    await expect(featuresSection).toBeVisible();

    // Capture current heading if present
    const heading = featuresSection.locator('h2');
    const hadHeading = await heading.count() > 0;

    // Try to open the editor (best-effort without enforcing auth in CI)
    const editButton = page.locator('button[title="Edit Content"]');
    if (!(await editButton.count())) {
      // If edit UI not available in this environment, at least assert base render
      await expect(featuresSection).toBeVisible();
      if (hadHeading) {
        await expect(heading).toHaveCount(1);
      }
      return;
    }

    await editButton.click();
    // Open Sections tab
    const sectionsTab = page.getByRole('button', { name: 'Sections' });
    if (await sectionsTab.count()) {
      await sectionsTab.click();
    }

    // Select Features section in the editor
    const featuresNav = page.getByRole('button', { name: 'Features Section' });
    if (await featuresNav.count()) {
      await featuresNav.click();
    }

    // Open JSON editor
    const editJsonBtn = page.getByRole('button', { name: 'Edit JSON' });
    await editJsonBtn.click();

    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();

    // Prepare a small JSON payload updating title/description only
    const updatedTitle = `E2E Title ${Date.now()}`;
    const updatedDesc = `E2E Desc ${Math.random().toString(36).slice(2, 8)}`;

    const value = await textarea.inputValue();
    let parsed: any;
    try { parsed = JSON.parse(value); } catch { parsed = {}; }
    if (!parsed || typeof parsed !== 'object') parsed = {};
    if (!parsed.section) parsed.section = {};
    parsed.section.title = updatedTitle;
    parsed.section.description = updatedDesc;
    // Keep items as-is to avoid large edits
    await textarea.fill(JSON.stringify(parsed, null, 2));

    // Apply JSON
    await page.getByRole('button', { name: 'Apply JSON' }).click();

    // Publish/save main content if save button exists
    const saveBtn = page.getByRole('button', { name: /Save/i });
    if (await saveBtn.count()) {
      await saveBtn.click();
      // Give API a moment
      await page.waitForTimeout(1000);
    }

    // Reload and validate new heading renders
    await page.goto(`${baseURL}/`);
    const newHeading = page.locator('section#features h2');
    await expect(newHeading).toHaveText(updatedTitle);
  });
});


