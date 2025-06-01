import { test, expect } from '@playwright/test';

test.describe('LightSwitch component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForSelector('html[data-mode]');
		await page.evaluate(() => {
			document.documentElement.setAttribute('data-mode', 'light');
		});
	});

	test('should render the light switch component', async ({ page }) => {
		const lightSwitch = page.getByTestId('switch-input');
		await expect(lightSwitch).toBeVisible();

		const switchButton = page.getByTestId('switch-thumb');
		await expect(switchButton).toBeVisible();

		const switchIcon = page.getByTestId(/^switch-icon-.*/);
		await expect(switchIcon).toBeVisible();
	});

	test('should render with light mode by default', async ({ page }) => {
		const html = page.locator('html');
		await expect(html).toHaveAttribute('data-mode', 'light');

		await page.waitForTimeout(500);

		const activeIcon = page.getByTestId('switch-icon-active');
		await expect(activeIcon).toBeVisible();
	});

	test('should switch to dark mode when toggled', async ({ page }) => {
		const lightSwitch = page.getByTestId('switch-control');
		await lightSwitch.click();

		const html = page.locator('html');
		await expect(html).toHaveAttribute('data-mode', 'dark');

		const activeIcon = page.getByTestId('switch-icon-inactive');
		await expect(activeIcon).toBeVisible();
	});
});
