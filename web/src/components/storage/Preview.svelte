<!--suppress UnnecessaryLabelJS, CheckEmptyScriptTag, HtmlUnknownTarget -->
<script>
    import Swal from 'sweetalert2/dist/sweetalert2';
    import { getContext } from 'svelte';
    import { mediaType } from '../../functions/file-type';

    let filePath = getContext('file-preview');
    let bot = getContext('bot');
    let refresh = getContext('get-bot-data');

    let fileType, fileURL;

    $: fileType = mediaType($filePath);
    $: fileURL = `/api/storage/${$bot.id}/file?path=${$filePath.join('/')}`;

    const deleteFile = () => Swal.fire({
        title: 'Supprimer un fichier',
        text: `Êtes-vous sur de vouloir supprimer ${$filePath.join('/')} ?`,
        confirmButtonText: 'Supprimer',
        showCancelButton: true,
        cancelButtonText: 'Retour',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: () => fetch(fileURL, { method: 'DELETE', })
                .then(async res => {
                    if (res.headers.has('Content-Type') && res.headers.get('Content-Type').startsWith('application/json')) {
                        let res = await res.json();
                        if (res.error) throw new Error(res.error);
                    }
                })
                .then(() => {
                    refresh();
                    $filePath = [];
                })
                .catch(err => Swal.fire({
                    title: 'Une erreur est survenue',
                    text: err.message,
                    icon: 'error',
                }))
    });

</script>

<div class="flex">
    <span class="flex-1 font-bold overflow-hidden">{$filePath.join('/')}</span>
    <img
            src="/icons/cross.svg"
            alt="Close preview"
            class="h-6 pl-2 cursor-pointer"
            on:click={() => $filePath = []}/>
</div>

<div class="max-w-full mt-2">
    {#if fileType === 'image'}
        <img src={fileURL} alt="Erreur lors de la preview"/>
    {:else if  fileType === 'video'}
        <video src={fileURL} controls>
            <track src={fileURL} kind="captions" default label="Preview de la video {$filePath.join('/')}">
        </video>
    {:else if  fileType === 'audio'}
        <audio src={fileURL} controls>
            <track src={fileURL} kind="captions" default label="Preview du fichier audio {$filePath.join('/')}">
        </audio>
    {/if}
</div>

<div class="mt-2">
    <a href={fileURL} download class="px-4 py-2 bg-blue-500 text-white rounded mr-4">Télécharger</a>
    <button on:click={deleteFile} class="px-4 py-2 bg-red-500 text-white rounded">Supprimer</button>
</div>
