import { expect, test } from '@playwright/test';

test.describe('TopBar E2E', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('renders title and utility controls', async ({ page }) => {
		await expect(page.getByTestId('top-bar')).toBeVisible();
		const title = page.getByTestId('top-bar-title');
		await expect(title).toBeVisible();
		await expect(title).toHaveText('Calculator');

		await expect(page.getByTestId('light-switch')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Toggle Full Screen' })).toBeVisible();
	});

	test('shows GitHub repository link with correct URL', async ({ page }) => {
		const githubLink = page.getByRole('link', { name: 'GitHub Repository' });
		await expect(githubLink).toBeVisible();
		await expect(githubLink).toHaveAttribute(
			'href',
			'https://github.com/TegarAditya/calculator-app-svelte'
		);
		await expect(githubLink).toHaveAttribute('target', '_blank');
	});
});
