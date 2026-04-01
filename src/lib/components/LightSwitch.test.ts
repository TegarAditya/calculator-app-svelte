import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/svelte';
import LightSwitch from './LightSwitch.svelte';

describe('LightSwitch (component)', () => {
	afterEach(() => {
		cleanup();
		localStorage.clear();
		document.documentElement.removeAttribute('data-mode');
	});

	it('renders and defaults to light mode when no preference exists', async () => {
		render(LightSwitch);

		await waitFor(() => {
			expect(document.documentElement.getAttribute('data-mode')).toBe('light');
		});

		const input = screen.getByRole('checkbox');
		expect(input).toBeChecked();
	});

	it('hydrates from stored dark mode preference', async () => {
		localStorage.setItem('mode', 'dark');
		render(LightSwitch);

		await waitFor(() => {
			expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
		});

		const input = screen.getByRole('checkbox');
		expect(input).not.toBeChecked();
	});

	it('switches to dark mode and persists preference when toggled', async () => {
		render(LightSwitch);
		const input = screen.getByRole('checkbox');

		await fireEvent.click(input);

		expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
		expect(localStorage.getItem('mode')).toBe('dark');
	});
});
