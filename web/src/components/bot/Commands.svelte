<script>
    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import StatusIndicator from './StatusIndicator.svelte';

    let bot = getContext('bot');
    let commands = getContext('commands');

    function toggleCommand(name, removable, event) {
        if (!removable || event.target.tagName === 'DIV') return;
        if ($bot.commands.includes(name)) {
            $bot = { ...$bot, commands: $bot.commands.filter(v => v !== name) };
        } else {
            $bot = { ...$bot, commands: [...$bot.commands, name] };
        }
    }

    function showHelp(name, description) {
        Swal.fire({
            title: `Commande ${$bot.commandStart}${name}`,
            text: description,
        });
    }

</script>

<h3 class="font-semibold text-xl pl-2 mt-2">
    Commande{$bot.commands.length > 1 ? 's' : ''} ({$bot.commands.length} / {$commands.length} activées)
</h3>

<ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
    {#each $commands as {name, removable, description}}
        <li class="cursor-pointer hover:bg-gray-600 rounded px-4 py-2 mx-2 whitespace-no-wrap"
            on:click={event => toggleCommand(name, removable, event)}>
            {#if !removable}
                🔒
            {:else}
                <StatusIndicator enabled={$bot.commands.includes(name)}/>
            {/if} {name}
            <div class="float-right text-sm h-6 w-6 rounded-full hover:bg-gray-700 duration-200 text-center"
                 on:click={() => showHelp(name, description)}>
                ❔
            </div>
        </li>
    {/each}
</ul>
