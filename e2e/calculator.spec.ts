import { expect, test, type Page } from '@playwright/test';

const resultDisplay = (page: Page) => page.locator('p.wrap-anywhere');

const formulaDisplay = (page: Page) => page.locator('.ig-input p');

async function pressKeys(page: Page, keys: string[]) {
	for (const key of keys) {
		await page.getByRole('button', { name: key, exact: true }).click();
	}
}

test.describe('Calculator App E2E', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			window.localStorage.clear();
		});
		await page.goto('/');
	});

	test('computes a basic expression and updates result live', async ({ page }) => {
		await pressKeys(page, ['7', '+', '8']);

		await expect(formulaDisplay(page)).toHaveText('7+8');
		await expect(resultDisplay(page)).toHaveText('15');
	});

	test('supports delete and clear controls for formula editing', async ({ page }) => {
		await pressKeys(page, ['1', '2', '3']);
		await expect(formulaDisplay(page)).toHaveText('123');

		await page.getByRole('button', { name: 'Delete last character' }).click();
		await expect(formulaDisplay(page)).toHaveText('12');

		await page.getByRole('button', { name: /^(AC|CE|C)$/ }).click();
		await expect(formulaDisplay(page)).toHaveText('');
		await expect(resultDisplay(page)).toHaveText('0');
	});

	test('saves expression to history and reuses it from modal', async ({ page }) => {
		await pressKeys(page, ['9', '-', '4']);
		await expect(resultDisplay(page)).toHaveText('5');

		await page.getByRole('button', { name: 'Save result' }).click();
		await expect(formulaDisplay(page)).toHaveText('5');

		await page.getByRole('button', { name: 'Open history' }).click();
		const historyItem = page.getByRole('button', { name: /9-4\s*=\s*5/ });
		await expect(historyItem).toBeVisible();

		await historyItem.click();
		await expect(formulaDisplay(page)).toHaveText('9-4');
		await expect(page.getByText('History')).toHaveCount(0);
	});

	test('clears history from modal', async ({ page }) => {
		await pressKeys(page, ['6', '÷', '2']);
		await page.getByRole('button', { name: 'Save result' }).click();

		await page.getByRole('button', { name: 'Open history' }).click();
		await expect(page.getByRole('button', { name: /6\/2\s*=\s*3/ })).toBeVisible();

		await page.getByRole('button', { name: 'Clear History' }).click();
		await expect(page.getByRole('button', { name: /6\/2\s*=\s*3/ })).toHaveCount(0);
	});
});