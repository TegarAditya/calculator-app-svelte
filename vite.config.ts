import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [devtoolsJson(), tailwindcss(), sveltekit()],
	build: {
		sourcemap: true
	}
});
