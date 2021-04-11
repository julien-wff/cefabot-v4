<!--suppress UnnecessaryLabelJS -->
<script>
    import { getContext } from 'svelte';
    import File from './File.svelte';
    import FolderContextMenu from './context-menu/FolderContextMenu.svelte';

    export let expanded = false;
    export let name;
    export let children;
    export let path = [];

    const BASE_ROOT = getContext('BASE_ROOT');

    $: path = [...path, ...(name ? [name] : [])];

    function toggle() {
        expanded = !expanded;
    }

    let menu = false;

    function contextMenu(ev) {
        menu = {
            x: ev.pageX,
            y: ev.pageY,
            path,
        };
    }
</script>

<style>
    span {
        padding: 0 0 0 1.5em;
        background: none 0 0.1em no-repeat;
        background-size: 1em 1em;
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

<svelte:body on:click={() => menu = false}/>


<span
        class="cursor-pointer font-bold"
        style="background-image: url('{BASE_ROOT}/icons/folder{expanded ? '-open' : ''}.svg')"
        on:click={toggle}
        on:contextmenu|preventDefault={contextMenu}>
    {name}
</span>

{#if menu}
    <FolderContextMenu {...menu}/>
{/if}

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
