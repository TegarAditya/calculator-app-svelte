<script lang="ts">
	import type HistoryStorage from '$lib/stores/history';
	import { type MathJsInstance } from 'mathjs';
	import { onMount } from 'svelte';
	import { cubicInOut, elasticOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let history: string[] = $state([]);
	const { mathInstance, historyStore, select } = $props<{
		mathInstance: MathJsInstance | null;
		historyStore: InstanceType<typeof HistoryStorage> | null;
		select: (item: string) => void;
	}>();

	/**
	 * Evaluates a math expression string safely.
	 */
	function evaluateExpression(expr: string): string {
		if (!mathInstance) return '';
		try {
			return mathInstance.evaluate(expr).toString();
		} catch {
			return 'Invalid';
		}
	}

	/**
	 * Selects a history item.
	 *
	 * @param {string} item - The history item to select.
	 */
	function selectHistoryItem(item: string) {
		select?.(item); // Call the passed-in prop/event
	}

	/**
	 * Clears the history.
	 */
	async function clearHistory() {
		history = [];
		await historyStore?.clear();
	}

	onMount(async () => {
		history = await historyStore.fetch(); // Fetch initial history
	});
</script>

<div class="fixed inset-0 z-50 flex justify-center bg-black/50">
	<div
		class="card preset-filled-surface-50-950 m-5 my-auto flex h-[60vh] w-full max-w-lg flex-col items-center justify-between overflow-x-hidden overflow-y-scroll"
		transition:fade={{ duration: 200, easing: cubicInOut }}
	>
		<div class="w-full">
			<h1
				class="preset-filled-primary-500 sticky top-0 z-10 w-full py-2 text-center text-lg font-bold text-white"
			>
				History
			</h1>
			<div class="px-3 py-2">
				{#each history as item, i}
					<div class="group my-1 flex items-center">
						<button
							class="btn preset-filled-surface-500 w-full flex-1"
							onclick={() => selectHistoryItem(item)}
							out:fade={{ duration: 300, easing: elasticOut }}
						>
							<p class="my-auto flex-none text-right text-xl font-semibold">
								{item} = <span>{evaluateExpression(item)}</span>
							</p>
						</button>
					</div>
				{/each}
			</div>
		</div>
		<div
			class="preset-filled-surface-50-950 sticky bottom-0 z-10 w-full px-2 py-2 text-center text-xl font-bold"
		>
			<button class="btn preset-filled-error-500 w-full py-1.5 text-white" onclick={clearHistory}>
				Clear History
			</button>
		</div>
	</div>
</div>
