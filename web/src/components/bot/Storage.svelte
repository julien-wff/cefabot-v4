<!--suppress UnnecessaryLabelJS -->
<script>
    import { getContext, setContext } from 'svelte';
    import Folder from '../storage/Folder.svelte';
    import { writable } from 'svelte/store';
    import Preview from '../storage/Preview.svelte';

    let files = getContext('files');
    let bot = getContext('bot');

    let filePreview = writable([]);
    setContext('file-preview', filePreview);

    const getFilesCount = f => f.filter(e => e.type === 'file').length + f.reduce((prev, val) => val.children ? getFilesCount(val.children) : 0, 0);

    let filesCount;
    $: filesCount = getFilesCount($files);
</script>

<h3 class="font-semibold text-xl pl-2 mt-2">Stockage ({filesCount} fichier{filesCount > 1 ? 's' : ''})</h3>

<div class="p-2 md:grid-cols-2" class:grid={$filePreview.length !== 0}>
    <!-- Tree -->
    <div class="p-2">
        <Folder name={$bot.name} children={$files} expanded/>
    </div>

    <!-- Preview -->
    {#if $filePreview.length !== 0}
        <div class="p-2">
            <Preview/>
        </div>
    {/if}
</div>
