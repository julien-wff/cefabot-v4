<script>
    import { onMount } from 'svelte';

    export let stackTrace = [];

    let blocks = new Array(stackTrace.length).fill(null);

    onMount(() => {
        blocks.forEach(block => {
            if (!block)
                return;
            Prism.highlightElement(block);

            // A dirty method because idk where this text node comes from :(
            const nextNode = block.nextSibling;
            if (nextNode.nodeName === '#text' && !nextNode.textContent.trim())
                nextNode.remove();
        });
    });
</script>


<style>
  pre {
    margin-top: 2px !important;
  }
</style>


<span class="block">Stack trace :</span>

<div class="px-2 text-white">
    {#each stackTrace as { source, line, column, file, callee }, index}
        <span class="block">
            {#if callee}{callee}{/if}
            {#if callee && file} - {/if}
            {#if file}
                {file + (line ? ':' + line : '') + (line && column ? ':' + column : '')}
            {/if}
        </span>
        {#if source}
            <pre class="block rounded line-numbers" data-start={line - 2} data-line={line}>
                <code bind:this={blocks[index]} class="language-ts">{source}</code>
            </pre>
        {/if}
    {/each}
</div>
