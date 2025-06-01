<script>
	import { Github } from '@lucide/svelte';
	import LightSwitch from './LightSwitch.svelte';
	import FullscreenToggle from './FullscreenToggle.svelte';
</script>

<header
	class="bg-surface-100-900 grid h-16 w-screen grid-cols-3 items-center px-4"
	aria-label="Top Bar"
	role="group"
	data-testid="top-bar"
>
	<div class="flex justify-start" data-testid="light-switch">
		<LightSwitch />
	</div>
	<h1 class="text-center text-xl font-bold" data-testid="top-bar-title">Calculator</h1>
	<div class="flex justify-end gap-2" data-testid="source-link">
		<a
			href="https://github.com/TegarAditya/calculator-app-svelte"
			target="_blank"
			rel="noopener noreferrer"
			aria-label="GitHub Repository"
		>
			<Github class="h-6 w-6" />
		</a>
		<FullscreenToggle />
	</div>
</header>
