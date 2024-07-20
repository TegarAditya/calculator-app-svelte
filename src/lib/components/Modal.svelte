<script lang="ts">
	import { evaluate } from 'mathjs';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	/**
	 * Represents the type of history in the modal component.
	 * @typedef {Object} history
	 * @property {string} history - The history string.
	 */
	type history = {
		history: string;
	};

	let history: history[] = [];

	/**
	 * Selects a history item.
	 *
	 * @param {any} item - The history item to select.
	 */
	function selectHistoryItem(item: any) {
		dispatch('select', item);
	}

	onMount(() => {
		/**
		 * Fetches data from the specified API endpoint and updates the 'history' variable with the response data.
		 *
		 * @param {string} endpoint - The URL of the API endpoint to fetch data from.
		 * @returns {Promise} - A promise that resolves with the fetched data.
		 */
		fetch('https://calculator-api.tegar.dev/api/history')
			.then((response) => response.json())
			.then((data) => {
				history = data.data;
			});
	});
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center">
	<div
		class="card h-[60vh] w-full items-center m-5 my-auto overflow-scroll"
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
						{item.history} = <span>{evaluate(item.history)}</span>
					</p>
				</button>
			{/each}
		</div>
	</div>
</div>
