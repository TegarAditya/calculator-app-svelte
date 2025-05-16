<script lang="ts">
	import '../app.css';

	import 'highlight.js/styles/github-dark.css';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import { Github } from 'lucide-svelte';
	import LightSwitch from '$lib/components/LightSwitch.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="h-dvh w-full">
	<AppBar>
		{#snippet lead()}
			<LightSwitch />
		{/snippet}
		<h1 class="text-xl font-bold">Calculator</h1>
		{#snippet trail()}
			<Github />
		{/snippet}
	</AppBar>
	{@render children?.()}
</div>
