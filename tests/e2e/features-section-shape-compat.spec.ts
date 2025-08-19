import { test, expect } from '@playwright/test';

test.describe('Features JSON shape compatibility', () => {
  test('accepts { features: { title, description, items } } and reflects in inputs and UI', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/`);

    // Open editor if available
    const editButton = page.locator('button[title="Edit Content"]');
    if (!(await editButton.count())) {
      test.skip(true, 'Editor UI not available in this environment');
    }
    await editButton.click();

    const sectionsTab = page.getByRole('button', { name: 'Sections' });
    if (await sectionsTab.count()) await sectionsTab.click();

    const featuresNav = page.getByRole('button', { name: 'Features Section' });
    if (await featuresNav.count()) await featuresNav.click();

    // Open JSON editor for the features section
    await page.getByRole('button', { name: 'Edit JSON' }).click();

    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();

    // Read existing JSON to reuse items
    const current = await textarea.inputValue();
    let parsed: any;
    try { parsed = JSON.parse(current); } catch { parsed = {}; }
    const items: any[] = Array.isArray(parsed?.items) ? parsed.items : [];

    const updatedTitle = `CompatTitle ${Date.now()}`;
    const updatedDesc = `CompatDesc ${Math.random().toString(36).slice(2, 7)}`;

    const compatPayload = {
      features: {
        title: updatedTitle,
        description: updatedDesc,
        items
      },
      visible: true
    } as any;

    await textarea.fill(JSON.stringify(compatPayload, null, 2));
    await page.getByRole('button', { name: 'Apply JSON' }).click();

    // Verify regular inputs reflect the new section title
    const titleInput = page.getByLabel('Features section title');
    await expect(titleInput).toHaveValue(updatedTitle);

    // Save if a Save button exists
    const saveBtn = page.getByRole('button', { name: /Save/i });
    if (await saveBtn.count()) {
      await saveBtn.click();
      await page.waitForTimeout(1000);
    }

    // Reload and verify UI heading
    await page.goto(`${baseURL}/`);
    const newHeading = page.locator('section#features h2');
    await expect(newHeading).toHaveText(updatedTitle);
  });
});


