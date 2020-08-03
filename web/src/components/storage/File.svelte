<!--suppress ES6UnusedImports -->
<script>
    import { fileSize } from '../../functions/humanize';
    import { getContext } from 'svelte';

    export let name;
    export let size;
    export let path;

    let filePreview = getContext('file-preview');

    function setPreview() {
        $filePreview = [...path.slice(1), name]
    }
</script>


<span class="pl-2 cursor-pointer" on:click={setPreview}>{name} ({fileSize(size)})</span>
