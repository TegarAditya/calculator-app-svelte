<script>
	import { Github } from '@lucide/svelte';
	import LightSwitch from './LightSwitch.svelte';
	import FullscreenToggle from './FullscreenToggle.svelte';
</script>

<header
	class="bg-surface-100-900 grid h-16 w-screen grid-cols-3 items-center px-4"
	aria-label="Top Bar"
	role="group"
>
	<div class="flex justify-start">
		<LightSwitch />
	</div>
	<span class="text-center text-xl font-bold">Calculator</span>
	<div class="flex justify-end gap-2">
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
