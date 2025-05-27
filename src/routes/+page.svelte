<script lang="ts">
	import type HistoryStorage from '$lib/stores/history';
	import type { MathJsInstance } from 'mathjs';
	import Modal from '$lib/components/Modal.svelte';
	import { Delete, History, SquareSigma } from '@lucide/svelte';
	import { onMount } from 'svelte';

	/**
	 * Represents the keys used in the calculator's formula input.
	 */
	// prettier-ignore
	const FORMULA_KEY: string[] = [
		'7','8','9','*',
		'4','5','6','/',
		'1','2','3','+',
		'.','0','%','-'
	];

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

	/**
	 * Represents the instances of Math.js and HistoryStorage.
	 *
	 * @prop {MathJsInstance | null} mathInstance - The instance of Math.js for calculations.
	 * @prop {InstanceType<typeof HistoryStorage> | null} historyStore - The instance of HistoryStorage for managing history.
	 */
	let mathInstance: MathJsInstance | null = $state(null);
	let historyStore: InstanceType<typeof HistoryStorage> | null = $state(null);

	$effect(() => {
		if (mathInstance && formula !== '') {
			result = calculate(formula);
		} else if (!formula) {
			result = '0';
		}
	});

	/**
	 * Calculates the result of a mathematical expression.
	 *
	 * @param {string} expression - The mathematical expression to evaluate.
	 * @returns {string} - The result of the evaluation.
	 */
	function calculate(expression: string): string {
		if (!mathInstance || expression.trim() === '') return '0';

		try {
			invalid = false;
			return mathInstance.evaluate(expression).toString();
		} catch {
			invalid = true;
			return result;
		}
	}

	/**
	 * - Saves the current calculation to history if valid.
	 * - Updates the formula with the latest result.
	 */
	async function saveResult() {
		if (!historyStore || invalid || formula.trim() === '') return;

		await historyStore.insert(formula);

		formula = result.toString();
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

	onMount(async () => {
		document.onkeydown = function (e) {
			return false;
		};

		const mathjs = await import('mathjs');
		mathInstance = mathjs.create(mathjs.all);

		const HistoryStorageModule = await import('$lib/stores/history');
		historyStore = new HistoryStorageModule.default('history');

		document.addEventListener('click', function (event) {
			if (event.target && !(event.target as Element).closest('.card')) {
				isModalOpen = false;
			}
		});
	});
</script>

<svelte:head>
	<title>Calculator</title>
	<meta name="description" content="A simple calculator app built with Svelte and Skeleton UI." />
</svelte:head>

<div class="container mx-auto flex max-w-lg flex-col items-center justify-center p-4">
	<div
		class="card preset-filled-surface-100-900 relative my-5 flex min-h-40 w-full items-center overflow-hidden px-1"
	>
		<button
			type="button"
			class="btn-icon preset-filled-primary-500 absolute top-2 right-2 rounded-full p-2 text-white shadow-md"
			onclick={() => (isModalOpen = !isModalOpen)}
			name="history-button"
			aria-label="Open history"
		>
			<div>
				<History size={20} />
			</div>
		</button>
		<p
			class="mx-auto text-right font-bold wrap-anywhere"
			class:text-2xl={result.toString().length > 10}
			class:text-4xl={result.toString().length <= 10}
			class:text-red-600={invalid}
		>
			{result}
		</p>
	</div>
	<div class="input-group h-12 w-full grid-cols-[auto_1fr_auto]">
		<div class="ig-cell preset-tonal"><SquareSigma class="ml-1" /></div>
		<div class="ig-input flex flex-1 items-center overflow-x-scroll overflow-y-hidden">
			<p class="font-semibold whitespace-nowrap">{formula}</p>
		</div>
		<button
			class="preset-filled-surface-200-800 ig-cell shrink-0"
			onclick={saveResult}
			name="save-button"
			aria-label="Save result"
		>
			<span class="mr-1 px-1 text-xl font-bold">=</span>
		</button>
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
				name="delete-button"
				aria-label="Delete last character"
			>
				<div>
					<Delete size={30} />
				</div>
			</button>
			{#each FORMULA_KEY as key}
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
		<Modal {historyStore} {mathInstance} select={useHistory} />
	{/if}
</div>

<style>
	.btn-icon-lg {
		padding: 1.3rem;
	}
</style>
