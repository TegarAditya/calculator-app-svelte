<script lang="ts">
	import { evaluate } from 'mathjs';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	let history: string[] = [];

	/**
	 * Selects a history item.
	 *
	 * @param {string} item - The history item to select.
	 */
	function selectHistoryItem(item: string) {
		dispatch('select', item);
	}

	/**
	 * Remove the history.
	 */
	function removeHistoryItem(item: string) {
		history = history.filter(h => h !== item);
		localStorage.setItem('history', JSON.stringify(history));
	}

	/**
	 * Clears the history.
	 */
	function clearHistory() {
		history = [];
		localStorage.setItem('history', JSON.stringify(history));
	}

	onMount(() => {
		/**
		 * Loads history data from localStorage and updates the 'history' variable.
		 */
		const stored = localStorage.getItem('history');
		console.log(stored);
		if (stored) {
			try {
				history = JSON.parse(stored);
			} catch (e) {
				history = [];
			}
		} else {
			history = [];
		}
	});
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center">
	<div
		class="card relative h-[60vh] w-full items-center m-5 my-auto overflow-scroll"
		transition:fade={{ duration: 300 }}
	>
		<h1 class="sticky top-0 variant-filled-primary z-10 text-xl font-bold w-full text-center py-2">
			History
		</h1>
		<div class="px-3 py-2">
			{#each history as item}
				<button
					class="btn w-full variant-filled-surface my-1"
					on:click={() => selectHistoryItem(item)}
				>
					<p class="text-xl font-semibold my-auto flex-none text-right">
						{item} = <span>{evaluate(item)}</span>
					</p>
				</button>
			{/each}
		</div>
		<div class="absolute bottom-0 z-10 text-xl font-bold w-full text-center py-2 px-2">
			<button
				class="btn variant-filled-surface w-full"
				on:click={() => {
					history = [];
					localStorage.setItem('history', JSON.stringify(history));
				}}
			>
				Clear History
			</button>
		</div>
	</div>
</div>
