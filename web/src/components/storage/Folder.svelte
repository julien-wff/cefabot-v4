<!--suppress UnnecessaryLabelJS -->
<script>
    import File from './File.svelte';

    export let expanded = false;
    export let name;
    export let children;
    export let path = [];

    $: path = [...path, ...(name ? [name] : [])];

    function toggle() {
        expanded = !expanded;
    }
</script>

<style>
    span {
        padding: 0 0 0 1.5em;
        background: url("/icons/folder.svg") 0 0.1em no-repeat;
        background-size: 1em 1em;
    }

    .expanded {
        background-image: url("/icons/folder-open.svg");
    }

    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.5em;
        list-style: none;
        border-left: 1px solid #eee;
    }

    li {
        padding: 0.2em 0;
    }
</style>

<span class="cursor-pointer font-bold" class:expanded on:click={toggle}>{name}</span>

{#if expanded}
    <ul>
        {#each children as child}
            <li>
                {#if child.type === 'folder'}
                    <svelte:self {...child} {path}/>
                {:else}
                    <File {...child} {path}/>
                {/if}
            </li>
        {/each}
    </ul>
{/if}
