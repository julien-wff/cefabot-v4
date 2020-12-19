<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
</script>


<div class="flex sm:flex-row flex-col-reverse justify-between mb-2">
    <h1 class="font-bold text-2xl">Accès web</h1>
    <div>
        <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                on:click={() => dispatch('refresh')}>
            Rafraichir
        </button>
    </div>
</div>