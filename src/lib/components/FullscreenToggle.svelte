<script lang="ts">
	import { Maximize2, Minimize2 } from '@lucide/svelte';

	const { iconSize = 20 } = $props<{ iconSize?: number }>();

	let isFullScreen: boolean = $state(false);

	function toggleFullScreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			isFullScreen = true;
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
				isFullScreen = false;
			}
		}
	}
</script>

<button onclick={toggleFullScreen} aria-label="Toggle Full Screen">
	{#if isFullScreen}
		<Minimize2 size={iconSize} />
	{:else}
		<Maximize2 size={iconSize} />
	{/if}
</button>
