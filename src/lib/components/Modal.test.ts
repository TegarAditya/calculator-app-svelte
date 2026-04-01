import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import Modal from './Modal.svelte';
import HistoryStorage from '$lib/stores/history';
import type { MathJsInstance } from 'mathjs';

describe('Modal (component)', () => {
	const originalAnimate = Element.prototype.animate;

	const createMathInstance = (evaluateImpl: (expr: string) => string | number): MathJsInstance =>
		({
			evaluate: vi.fn((expr: unknown) => evaluateImpl(String(expr)))
		}) as unknown as MathJsInstance;

	const createHistoryStore = (items: string[]) => {
		const historyStore = new HistoryStorage('test-history');
		vi.spyOn(historyStore, 'fetch').mockResolvedValue(items);
		vi.spyOn(historyStore, 'clear').mockResolvedValue();
		return historyStore;
	};

	beforeAll(() => {
		if (!Element.prototype.animate) {
			Element.prototype.animate = vi.fn(() => ({
				cancel: vi.fn(),
				finished: Promise.resolve(),
				onfinish: null,
				oncancel: null,
				play: vi.fn(),
				pause: vi.fn(),
				reverse: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn()
			})) as unknown as typeof Element.prototype.animate;
		}
	});

	afterAll(() => {
		Element.prototype.animate = originalAnimate;
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it('loads and renders history items with evaluated results', async () => {
		const mathInstance = createMathInstance((expr: string) => {
			if (expr === '2+2') return 4;
			if (expr === '10/2') return 5;
			return '0';
		});

		const historyStore = createHistoryStore(['2+2', '10/2']);

		render(Modal, {
			props: {
				mathInstance,
				historyStore,
				select: vi.fn()
			}
		});

		await waitFor(() => {
			expect(historyStore.fetch).toHaveBeenCalledTimes(1);
		});

		expect(screen.getByRole('button', { name: /2\+2\s*=\s*4/ })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /10\/2\s*=\s*5/ })).toBeInTheDocument();
	});

	it('uses Invalid fallback when expression evaluation throws', async () => {
		const mathInstance = createMathInstance((expr: string) => {
			if (expr === 'bad') {
				throw new Error('Invalid expression');
			}
			return 42;
		});

		const historyStore = createHistoryStore(['bad']);

		render(Modal, {
			props: {
				mathInstance,
				historyStore,
				select: vi.fn()
			}
		});

		expect(await screen.findByRole('button', { name: /bad\s*=\s*invalid/i })).toBeInTheDocument();
	});

	it('calls select callback when a history item is clicked', async () => {
		const select = vi.fn();
		const historyStore = createHistoryStore(['3*3']);

		render(Modal, {
			props: {
				mathInstance: createMathInstance(() => 9),
				historyStore,
				select
			}
		});

		const itemButton = await screen.findByRole('button', { name: /3\*3/ });
		await fireEvent.click(itemButton);

		expect(select).toHaveBeenCalledWith('3*3');
	});

	it('clears rendered history and calls store clear', async () => {
		const historyStore = createHistoryStore(['1+1']);

		render(Modal, {
			props: {
				mathInstance: createMathInstance(() => 2),
				historyStore,
				select: vi.fn()
			}
		});

		await screen.findByRole('button', { name: /1\+1\s*=\s*2/ });
		await fireEvent.click(screen.getByRole('button', { name: /clear history/i }));

		await waitFor(() => {
			expect(historyStore.clear).toHaveBeenCalledTimes(1);
		});
	});
});