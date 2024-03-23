<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

    type history = {
        history: string;
    }

    let history: history[] = [];

    function selectHistoryItem(item: any) {
        dispatch('select', item);
    }

    onMount(() => {
        fetch('http://127.0.0.1:8000/api/history').then(response => response.json()).then(data => {
            history = data.data;
        });
    })
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center">
	<div class="card h-[60vh] w-full items-center m-5 my-auto overflow-scroll" transition:fade={{duration: 300}}>
		<h1 class="sticky top-0 variant-filled-primary z-10 text-xl font-bold w-full text-center py-2">
			History
		</h1>
		<div class="px-3 py-2">
			{#each history as item}
				<button class="btn w-full variant-filled-surface my-1" on:click={() => selectHistoryItem(item)}>
					<p class="text-xl font-bold">{item.history}</p>
				</button>
			{/each}
		</div>
	</div>
</div>
