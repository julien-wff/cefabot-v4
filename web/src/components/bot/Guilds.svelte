<!--suppress HtmlUnknownTarget -->
<script>
    import { getContext } from 'svelte';
    import Channel from './guilds/Channel.svelte';

    const BASE_ROOT = getContext('BASE_ROOT');
    const bot = getContext('bot');
    const guilds = getContext('guilds');
    const channels = getContext('channels');

    const channelTypes = [
        { type: 'general', display: 'Général' },
        { type: 'commands', display: 'Commandes' },
        { type: 'admin', display: 'Admin' },
        { type: 'announces', display: 'Annonces' },
    ];

    let managedGuild = null;
</script>


<style>
    img[src$="cross.svg"] {
        transform: translateY(-2px);
    }
</style>


<h3 class="font-semibold text-xl pl-2 mt-2">Guilde{$guilds.length > 1 ? 's' : ''} ({$guilds.length})</h3>

<div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {#each $guilds as guildData}
            <div class="flex flex-row cursor-pointer hover:bg-gray-600 rounded p-4"
                 on:click={() => managedGuild = guildData}>
                {#if guildData.guild.iconURL}
                    <img src={guildData.guild.iconURL} alt="{guildData.guild.name} icon" class="h-16 w-16 mr-2"/>
                {/if}
                <div class="flex flex-col justify-evenly">
                    <h3 class="font-bold">{guildData.guild.name}</h3>
                    <span>{guildData.guild.memberCount} membre{guildData.guild.memberCount > 1 ? 's' : ''}</span>
                </div>
            </div>
        {/each}

        <a href="https://discordapp.com/oauth2/authorize?client_id={$bot.clientID}&scope=bot&permissions=2146958847"
           class="font-bold flex flex-col justify-center cursor-pointer hover:bg-gray-600 rounded p-4"
           rel="noopener,norefferer"
           target="_blank">
            ➕ Ajouter une guilde
        </a>
    </div>

    {#if managedGuild && managedGuild.guild}
        <div class="ml-4 mb-2">
            <img
                    src="{BASE_ROOT}/icons/cross.svg"
                    alt="x"
                    class="inline-block h-4 cursor-pointer"
                    on:click={() => managedGuild = null}/>
            <h4 class="font-semibold text-lg inline-block">{managedGuild.guild.name} - salons</h4>
            {#each channelTypes as { display, type }}
                <Channel channelName={display} channelType={type} guild={managedGuild}/>
            {/each}
        </div>
    {/if}

</div>
