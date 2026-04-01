import { cleanup, render, screen } from '@testing-library/svelte';
import TopBar from './TopBar.svelte';

describe('TopBar (component)', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders calculator title and top-level regions', () => {
		render(TopBar);

		expect(screen.getByTestId('top-bar')).toBeVisible();
		expect(screen.getByTestId('top-bar-title')).toHaveTextContent('Calculator');
		expect(screen.getByTestId('light-switch')).toBeInTheDocument();
		expect(screen.getByTestId('source-link')).toBeInTheDocument();
	});

	it('renders GitHub link and fullscreen control', () => {
		render(TopBar);

		const githubLink = screen.getByRole('link', { name: /github repository/i });
		expect(githubLink).toHaveAttribute(
			'href',
			'https://github.com/TegarAditya/calculator-app-svelte'
		);
		expect(githubLink).toHaveAttribute('target', '_blank');

		expect(screen.getByRole('button', { name: /toggle full screen/i })).toBeInTheDocument();
	});
});