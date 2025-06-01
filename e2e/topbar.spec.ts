import { expect, test } from '@playwright/test';

test.describe('Topbar', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should display the topbar', async ({ page }) => {
		const topbar = page.getByTestId('top-bar');
		await expect(topbar).toBeVisible();
	});

	test('should display the topbar title with correct text', async ({ page }) => {
		const title = page.getByTestId('top-bar-title');
		await expect(title).toBeVisible();
		await expect(title).toHaveText('Calculator');
	});

	test('should display the light switch', async ({ page }) => {
		const lightSwitch = page.getByTestId('light-switch');
		await expect(lightSwitch).toBeVisible();
		const switchInput = lightSwitch.getByTestId('switch-input');
		await expect(switchInput).toBeVisible();
	});

	test('should display the source link', async ({ page }) => {
		const sourceLink = page.getByTestId('source-link');
		await expect(sourceLink).toBeVisible();
	});
});
