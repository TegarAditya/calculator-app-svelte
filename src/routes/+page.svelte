<script lang="ts">
	import { Delete, SquareSigma } from 'lucide-svelte';
	import { evaluate } from 'mathjs';
	import { onMount } from 'svelte';

	let formula: string = '';
	let result: string = '';
	let invalid: boolean = false;

	$: result = calculate(formula);

	function calculate(string: string) {
		try {
			invalid = false;
			if (string === '') return '0';
			return evaluate(string);
		} catch (error) {
			invalid = true;
			return result;
		}
	}

	function sendResult() {
		if (result === 'invalid!') return;

		formula = result.toString();

		let history = result;

		fetch('http://127.0.0.1:8000/api/history', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({ history }).toString()
		});
	}

	onMount(() => {
		document.onkeydown = function (e) {
			return false;
		};
	});
</script>

<div class="container mx-auto flex flex-col justify-center items-center p-4 max-w-lg">
	<div class="card w-full min-h-40 my-5 flex items-center overflow-scroll">
		{#if invalid}
			<p class="text-4xl font-bold mx-auto text-red-600">{result}</p>
		{:else}
			<p class="text-4xl font-bold mx-auto">{result}</p>
		{/if}
	</div>
	<div class="input-group input-group-divider h-12 grid-cols-[auto_1fr_auto]">
		<div class="input-group-shim"><SquareSigma /></div>
		<div class="overflow-scroll">
			<p>{formula}</p>
		</div>
		<button class="variant-filled-surface" on:click={sendResult}
			><span class="px-2">=</span></button
		>
	</div>
	<div class="p-4">
		<div class="grid grid-cols-4 gap-2">
			{#each ['(', ')'] as key}
				<button
					type="button"
					class="btn-icon btn-icon-xl variant-filled-surface shadow-lg hover:shadow-none"
					on:click={() => (formula += key)}
				>
					{key}
				</button>
			{/each}
			<button
				type="button"
				class="btn-icon btn-icon-xl variant-filled-error shadow-lg hover:shadow-none"
				on:click={() => (formula = '')}
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
				on:click={() => (formula = formula.slice(0, -1))}><Delete size={30} /></button
			>
			{#each ['7', '8', '9', '*', '4', '5', '6', '/', '1', '2', '3', '+', '.', '0', '%', '-'] as key}
				<button
					type="button"
					class="btn-icon btn-icon-xl variant-filled-surface shadow-lg hover:shadow-none"
					on:click={() => (formula += key)}
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
