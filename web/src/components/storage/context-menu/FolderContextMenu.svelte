<script>
    import { getContext } from 'svelte';
    import MenuOption from './MenuOption.svelte';
    import { uploadFile } from '../storage-management';

    export let x = 0;
    export let y = 0;
    export let path = [];

    let bot = getContext('bot');
    let getBotData = getContext('get-bot-data');

    async function startFileUpload() {
        await uploadFile(path.slice(1).join('/'), $bot.id);
        getBotData();
    }

    let menu;
</script>

<div class="absolute bg-gray-300 rounded shadow text-black" style="top: {y}px; left: {x}px" data-path={path}>
    <MenuOption text="Ajouter un fichier" on:click={startFileUpload} first last/>
<!--    <MenuOption text="Créer un dossier" on:click={} last/>-->
</div>
