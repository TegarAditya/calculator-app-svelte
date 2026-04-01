import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
	plugins: [devtoolsJson(), tailwindcss(), sveltekit()],
	test: {
		environment: 'jsdom',
		setupFiles: ['/vitest-setup.ts'],
		include: ['**/*.test.{js,ts}'],
		globals: true
	},
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
	build: {
		sourcemap: true
	}
}));
