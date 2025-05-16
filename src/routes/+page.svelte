<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import HistoryStorage from '$lib/stores/history';
	import { Delete, History, SquareSigma } from 'lucide-svelte';
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
	<div class="card w-full min-h-40 my-5 flex items-center overflow-auto relative">
		<button
			class="btn-icon btn-icon-sm shadow-md variant-filled-primary absolute top-2 right-2"
			onclick={() => (isModalOpen = !isModalOpen)}><History size={20} /></button
		>
		{#if invalid}
			<p class="text-4xl font-bold mx-auto text-red-600">{result}</p>
		{:else}
			<p class="text-4xl font-bold mx-auto">{result}</p>
		{/if}
	</div>
	<div class="input-group input-group-divider h-12 grid-cols-[auto_1fr_auto]">
		<div class="input-group-shim"><SquareSigma /></div>
		<div class="overflow-x-scroll flex-1">
			<p class="whitespace-nowrap">{formula}</p>
		</div>
		<button class="variant-filled-surface flex-shrink-0" onclick={saveResult}
			><span class="px-2">=</span></button
		>
	</div>
	<div class="p-4">
		<div class="grid grid-cols-4 gap-2">
			{#each ['(', ')'] as key}
				<button
					type="button"
					class="btn-icon btn-icon-xl variant-filled-surface shadow-lg hover:shadow-none"
					onclick={() => (formula += key)}
				>
					{key}
				</button>
			{/each}
			<button
				type="button"
				class="btn-icon btn-icon-xl variant-filled-error shadow-lg hover:shadow-none"
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
				class="btn-icon btn-icon-xl variant-filled-error shadow-lg hover:shadow-none"
				onclick={() => (formula = formula.slice(0, -1))}><Delete size={30} /></button
			>
			{#each ['7', '8', '9', '*', '4', '5', '6', '/', '1', '2', '3', '+', '.', '0', '%', '-'] as key}
				<button
					type="button"
					class="btn-icon btn-icon-xl variant-filled-surface shadow-lg hover:shadow-none"
					onclick={() => (formula += key)}
				>
					{#if key === '/'}
						÷
					{:else if key === '*'}
						&times;
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
