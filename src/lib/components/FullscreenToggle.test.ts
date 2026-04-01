import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import FullscreenToggle from './FullscreenToggle.svelte';

describe('FullscreenToggle (component)', () => {
	let fullscreenElement: Element | null;
	let originalFullscreenElementDescriptor: PropertyDescriptor | undefined;
	let originalRequestFullscreenDescriptor: PropertyDescriptor | undefined;
	let originalExitFullscreenDescriptor: PropertyDescriptor | undefined;

	beforeEach(() => {
		fullscreenElement = null;

		originalFullscreenElementDescriptor = Object.getOwnPropertyDescriptor(
			document,
			'fullscreenElement'
		);
		originalRequestFullscreenDescriptor = Object.getOwnPropertyDescriptor(
			document.documentElement,
			'requestFullscreen'
		);
		originalExitFullscreenDescriptor = Object.getOwnPropertyDescriptor(document, 'exitFullscreen');

		Object.defineProperty(document, 'fullscreenElement', {
			configurable: true,
			get() {
				return fullscreenElement;
			}
		});

		Object.defineProperty(document.documentElement, 'requestFullscreen', {
			configurable: true,
			value: vi.fn(async () => {
				fullscreenElement = document.documentElement;
			})
		});

		Object.defineProperty(document, 'exitFullscreen', {
			configurable: true,
			value: vi.fn(async () => {
				fullscreenElement = null;
			})
		});
	});

	afterEach(() => {
		cleanup();

		if (originalFullscreenElementDescriptor) {
			Object.defineProperty(document, 'fullscreenElement', originalFullscreenElementDescriptor);
		}
		if (originalRequestFullscreenDescriptor) {
			Object.defineProperty(
				document.documentElement,
				'requestFullscreen',
				originalRequestFullscreenDescriptor
			);
		}
		if (originalExitFullscreenDescriptor) {
			Object.defineProperty(document, 'exitFullscreen', originalExitFullscreenDescriptor);
		}

		vi.restoreAllMocks();
	});

	it('enters and exits full screen when toggled', async () => {
		render(FullscreenToggle);

		const button = screen.getByRole('button', { name: /toggle full screen/i });
		await fireEvent.click(button);

		expect(document.documentElement.requestFullscreen).toHaveBeenCalledTimes(1);

		await fireEvent.click(button);

		expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
	});

	it('handles full screen API errors gracefully', async () => {
		Object.defineProperty(document.documentElement, 'requestFullscreen', {
			configurable: true,
			value: vi.fn(() => {
				throw new Error('fullscreen failed');
			})
		});

		const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		render(FullscreenToggle);

		const button = screen.getByRole('button', { name: /toggle full screen/i });
		await fireEvent.click(button);

		expect(errorSpy).toHaveBeenCalled();
	});
});