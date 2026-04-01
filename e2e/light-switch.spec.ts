import { test, expect } from '@playwright/test';

test.describe('LightSwitch E2E', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.evaluate(() => {
			window.localStorage.removeItem('mode');
		});
		await page.reload();
	});

	test('renders theme switch and defaults to light mode', async ({ page }) => {
		const switchInput = page.getByTestId('switch-input');
		await expect(switchInput).toBeVisible();
		await expect(switchInput).toBeChecked();

		await expect(page.locator('html')).toHaveAttribute('data-mode', 'light');
	});

	test('toggles theme and persists dark mode after reload', async ({ page }) => {
		const switchInput = page.getByTestId('switch-input');
		await switchInput.setChecked(false, { force: true });

		await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
		await expect(switchInput).not.toBeChecked();
		await expect(page.getByTestId('switch-icon-inactive')).toBeVisible();
		const storedMode = await page.evaluate(() => window.localStorage.getItem('mode'));
		expect(storedMode).toBe('dark');

		await page.reload();
		await expect(page.locator('html')).toHaveAttribute('data-mode', 'dark');
	});
});
