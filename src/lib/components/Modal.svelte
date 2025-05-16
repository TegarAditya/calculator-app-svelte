<script lang="ts">
	import HistoryStorage from '$lib/stores/history';
	import { evaluate } from 'mathjs';
	import { onMount } from 'svelte';
	import { elasticOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let history: string[] = $state([]);
	let { select } = $props();

	/**
	 * Selects a history item.
	 *
	 * @param {string} item - The history item to select.
	 */
	function selectHistoryItem(item: string) {
		select?.(item); // Call the passed-in prop/event
	}

	/**
	 * Remove the history.
	 */
	function removeHistoryItem(item: string) {
		history = history.filter((h) => h !== item);
		localStorage.setItem('history', JSON.stringify(history));
	}

	/**
	 * Clears the history.
	 */
	async function clearHistory() {
		history = [];
		await HistoryStorage.clear();
	}

	onMount(async () => {
		/**
		 * Loads history data from localForage and updates the 'history' state.
		 */
		const stored = await HistoryStorage.fetch();
		history = stored ?? [];
	});
</script>

<div class="fixed inset-0 bg-black/50 z-50 flex justify-center">
	<div
		class="card flex flex-col preset-filled-surface-50-950 justify-between h-[60vh] w-full max-w-lg items-center m-5 my-auto overflow-scroll"
		transition:fade={{ duration: 200 }}
	>
		<div class="w-full">
			<h1
				class="sticky top-0 preset-filled-primary-500 z-10 text-lg text-white font-bold w-full text-center py-2"
			>
				History
			</h1>
			<div class="px-3 py-2">
				{#each history as item, i}
					<button
						class="btn w-full preset-filled-surface-500 my-1"
						onclick={() => selectHistoryItem(item)}
						out:fade={{ duration: 300, easing: elasticOut }}
					>
						<p class="text-xl font-semibold my-auto flex-none text-right">
							{item} = <span>{evaluate(item)}</span>
						</p>
					</button>
				{/each}
			</div>
		</div>
		<div class="sticky bottom-0 z-10 text-xl font-bold w-full text-center py-2 px-2">
			<button class="btn preset-filled-error-500 text-lg text-white w-full" onclick={clearHistory}>
				Clear History
			</button>
		</div>
	</div>
</div>
