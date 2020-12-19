<script>
    import { createEventDispatcher } from 'svelte';

    export let ip;

    const dispatch = createEventDispatcher();
</script>


{#if ip}
    <div on:click={() => dispatch('copy')}>
        IP :
        <pre class="inline">{ip}</pre>
    </div>
{/if}