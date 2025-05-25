<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import IconMoon from '@lucide/svelte/icons/moon';
	import IconSun from '@lucide/svelte/icons/sun';

	let checked = $state(false);

	$effect(() => {
		const mode = localStorage.getItem('mode') || 'light';
		checked = mode === 'light';
	});

	const onCheckedChange = (event: { checked: boolean }) => {
		const mode = event.checked ? 'light' : 'dark';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
		checked = event.checked;
	};
</script>

<svelte:head>
	<script>
		const mode = localStorage.getItem('mode') || 'light';
		document.documentElement.setAttribute('data-mode', mode);
	</script>
</svelte:head>

<Switch {checked} {onCheckedChange} controlActive="bg-surface-200">
	{#snippet activeChild()}
		<IconSun size="14" aria-label="Light Mode" id="switch:s1:label" />
	{/snippet}
	{#snippet inactiveChild()}
		<IconMoon size="14" aria-label="Dark Mode" id="switch:s1:label" />
	{/snippet}
</Switch>
