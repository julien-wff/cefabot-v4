<!--suppress HtmlUnknownTarget -->
<script>
    import { getContext } from 'svelte';

    const bot = getContext('bot');
    const guilds = getContext('guilds');
</script>


<h3 class="font-semibold text-xl pl-2 mt-2">Guilde{$guilds.length > 1 ? 's' : ''} ({$guilds.length})</h3>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
    {#each $guilds as {guild}}
        <div class="flex flex-row cursor-pointer hover:bg-gray-600 rounded p-4">
            {#if guild.iconURL}
                <img src={guild.iconURL} alt="{guild.name} icon" class="h-16 w-16 mr-2"/>
            {/if}
            <div class="flex flex-col justify-evenly">
                <h3 class="font-bold">{guild.name}</h3>
                <span>{guild.memberCount} membre{guild.memberCount > 1 ? 's' : ''}</span>
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
