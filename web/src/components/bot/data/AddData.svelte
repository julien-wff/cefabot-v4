<script>
    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import { dataTypes } from '../../../functions/convert-data-type';
    import { getDataAndSend, getGuild, getKey, getSecret, getType } from './add-data';

    const API_ROOT = getContext('API_ROOT');
    let dataStorage = getContext('data-storage');
    let guilds = getContext('guilds');
    let bot = getContext('bot');
    let getBotData = getContext('get-bot-data');

    async function addKey() {
        const multiGuilds = $guilds.length > 1;

        const alertBox = Swal.mixin({
            title: 'Ajouter une donnée',
            progressSteps: multiGuilds ? [1, 2, 3, 4, 5] : [1, 2, 3, 4],
            showCancelButton: true,
        });

        const key = await getKey(alertBox, 0);
        if (!key) return;

        const type = await getType(alertBox, 1);
        if (!type) return;

        const secret = await getSecret(alertBox, 2);

        const guild = await getGuild(alertBox, 3, $guilds);

        await getDataAndSend(
            alertBox,
            multiGuilds ? 4 : 3,
            {
                guild,
                secret,
                key,
                type,
                botID: $bot.id
            },
            API_ROOT
        );

        getBotData();
    }
</script>


<div class="hover:bg-gray-600 rounded px-4 py-2 cursor-pointer font-bold" on:click={addKey}>
    Ajouter une donnée ➕
</div>
