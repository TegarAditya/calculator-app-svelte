<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import HistoryStorage from '$lib/stores/history';
	import { Delete, History, SquareSigma } from '@lucide/svelte';
	import { evaluate } from 'mathjs';
	import { onMount } from 'svelte';

	/**
	 * Represents the state variables used in the page component.
	 *
	 * @prop {string} formula - The current formula entered by the user.
	 * @prop {string} result - The result of the calculation.
	 * @prop {boolean} invalid - Indicates if the formula is invalid.
	 * @prop {boolean} isModalOpen - Indicates if the modal is open.
	 */
	let formula: string = $state('');
	let result: string = $state('0');
	let invalid: boolean = $state(false);
	let isModalOpen: boolean = $state(false);

	$effect(() => {
		if (formula !== '') {
			result = calculate(formula);
		} else {
			result = '0';
		}
	});

	/**
	 * Calculates the result of a mathematical expression.
	 *
	 * @param {string} string - The mathematical expression to evaluate.
	 * @returns {string} - The result of the evaluation.
	 */
	function calculate(string: string): string {
		try {
			invalid = false;
			if (string === '') return '0';
			return evaluate(string);
		} catch (error) {
			invalid = true;
			return result;
		}
	}

	/**
	 * - Saves the current calculation to history if valid.
	 * - Updates the formula with the latest result.
	 */
	async function saveResult() {
		if (invalid || formula.trim() === '') return;

		await HistoryStorage.insert(formula);

		formula = result?.toString() ?? '';
	}

	/**
	 * Handles the history of the calculator app.
	 *
	 * @param item - The item containing the history string.
	 */
	function useHistory(item: string) {
		formula = item;

		isModalOpen = false;
	}

	onMount(() => {
		document.onkeydown = function (e) {
			return false;
		};

		document.addEventListener('click', function (event) {
			if (event.target && !(event.target as Element).closest('.card')) {
				isModalOpen = false;
			}
		});
	});
</script>

<div class="container mx-auto flex flex-col justify-center items-center p-4 max-w-lg">
	<div
		class="card w-full min-h-40 my-5 preset-filled-surface-100-900 flex items-center overflow-auto relative"
	>
		<button
			type="button"
			class="btn-icon rounded-full shadow-md preset-filled-primary-500 text-white absolute p-2 top-2 right-2"
			onclick={() => (isModalOpen = !isModalOpen)}
		>
			<div>
				<History size={20} />
			</div>
		</button>
		<p class="text-4xl font-bold mx-auto {invalid ? 'text-red-600' : ''}">{result}</p>
	</div>
	<div class="input-group h-12 grid-cols-[auto_1fr_auto] w-full">
		<div class="ig-cell preset-tonal"><SquareSigma class="ml-1" /></div>
		<div class="overflow-x-scroll overflow-y-hidden flex items-center flex-1 ig-input">
			<p class="whitespace-nowrap font-semibold">{formula}</p>
		</div>
		<button class="preset-filled-surface-200-800 shrink-0 ig-cell" onclick={saveResult}
			><span class="px-1 mr-1 font-bold text-xl">=</span></button
		>
	</div>
	<div class="p-4 font-bold">
		<div class="grid grid-cols-4 gap-2">
			{#each ['(', ')'] as key}
				<button
					type="button"
					class="btn-icon btn-icon-lg preset-filled-surface-500 shadow-lg hover:shadow-none"
					onclick={() => (formula += key)}
				>
					{key}
				</button>
			{/each}
			<button
				type="button"
				class="btn-icon btn-icon-lg preset-filled-error-500 text-white shadow-lg hover:shadow-none"
				onclick={() => (formula = '')}
			>
				{#if formula === ''}
					AC
				{:else if formula === result}
					C
				{:else}
					CE
				{/if}
			</button>
			<button
				type="button"
				class="btn-icon btn-icon-lg preset-filled-error-500 text-white shadow-lg hover:shadow-none"
				onclick={() => (formula = formula.slice(0, -1))}
			>
				<div>
					<Delete size={30} />
				</div>
			</button>
			{#each ['7', '8', '9', '*', '4', '5', '6', '/', '1', '2', '3', '+', '.', '0', '%', '-'] as key}
				<button
					type="button"
					class="btn-icon btn-icon-lg preset-filled-surface-500 shadow-lg hover:shadow-none"
					onclick={() => (formula += key)}
				>
					{#if key === '/'}
						÷
					{:else if key === '*'}
						×
					{:else}
						{key}
					{/if}
				</button>
			{/each}
		</div>
	</div>
</div>
<div>
	{#if isModalOpen}
		<Modal select={useHistory} />
	{/if}
</div>

<style>
	.btn-icon-lg {
		padding: 1.3rem;
	}
</style>
