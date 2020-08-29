<script>
    import { humanizeDataType } from '../../../functions/convert-data-type';
    import { sanitizeJSON } from '../../../functions/sanitize';
    import { getContext } from 'svelte';
    import DataValue from './DataValue.svelte';

    export let data;

    let guilds = getContext('guilds');

    let guild;
    $: guild = $guilds.find(g => g.guild.id === data.guildID);

    let showDetails = false;
</script>

Type : {humanizeDataType(data.type)}
<br/>
Valeur : <DataValue {data}/>
<br/>
Guilde : {guild && guild.guild ? guild.guild.name : '<inconnue>'}
<br/>
<div on:click={() => showDetails = !showDetails} class="cursor-pointer">
    Données brutes : {!showDetails ? '<afficher>' : '<masquer>'}
</div>
{#if showDetails}
    <div class="text-left">
        {@html sanitizeJSON(data)}
    </div>
{/if}
