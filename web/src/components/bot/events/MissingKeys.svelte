<script>
    import { humanizeDataType } from '../../../functions/convert-data-type';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import { getDataAndSend, getGuild, getSecret } from '../data/add-data';


    export let missingKeys = [];
    export let guilds = [];
    export let bot;
    export let getBotData = () => void 0;

    /** @param key {{key: String, type: String}} */
    async function addMissingKey(key) {
        const alertBox = Swal.mixin({
            title: `Ajouter la donnée ${key.key}`,
            progressSteps: [1, 2, 3],
            showCancelButton: true,
        });

        const secret = await getSecret(alertBox, 0);

        const guild = await getGuild(alertBox, 1, guilds);
        if (!guild) return;

        await getDataAndSend(alertBox, 2, { type: key.type, key: key.key, botID: $bot.id, guild, secret });

        getBotData();
    }
</script>

<div class="mb-2">
    Pour activer cet évènement, vous devez ajouter
    {#if missingKeys.length > 1}
        les clés suivantes :
    {:else}
        la clé suivante :
    {/if}
</div>

{#each missingKeys as k}
    <div class="p-1 rounded hover:bg-gray-700 duration-100 cursor-pointer"
         on:click={() => addMissingKey(k)}>
        <pre class="inline"><code>{k.key}</code></pre>
        : {humanizeDataType(k.type)}</div>
{/each}
