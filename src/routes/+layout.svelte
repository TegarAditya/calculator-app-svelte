<script lang="ts">
	import '@fontsource/quicksand/600.css';
	import '@fontsource/quicksand/700.css';
	import '../app.css';

	import TopBar from '$lib/components/TopBar.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="h-dvh w-full">
	<TopBar />
	{@render children?.()}
</div>
