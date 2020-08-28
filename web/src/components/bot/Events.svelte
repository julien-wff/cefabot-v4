<script>
    import { getContext } from 'svelte';
    import StatusIndicator from './StatusIndicator.svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import { humanizeDataType } from '../../functions/convert-data-type';
    import MissingKeys from './events/MissingKeys.svelte';

    let bot = getContext('bot');
    let events = getContext('events');
    let dataStorage = getContext('data-storage');

    function toggleEvent(name) {
        if ($bot.events.includes(name)) {  // Remove the data
            $bot = { ...$bot, events: $bot.events.filter(v => v !== name) };
        } else {    // Add the data

            // Check if the required keys are present
            const evt = $events.find(e => e.name === name);
            if (evt.requiredDataKeys) {
                const missingKeys = evt.requiredDataKeys.filter(k => {
                    const matchingKey = $dataStorage.find(d => {
                        return d.key === k.key && d.type === k.type && d.botID === $bot.id;
                    });
                    if (!matchingKey)
                        return true;
                });
                if (missingKeys.length > 0) {
                    const s = missingKeys.length > 1 ? 's' : '';
                    Swal.fire({
                        title: `Clé${s} manquante${s}`,
                        html: '<div id="swal-svelte-missing-event"></div>',
                        icon: 'error'
                    });
                    new MissingKeys({
                        target: document.getElementById('swal-svelte-missing-event'),
                        props: { missingKeys },
                    });
                    return;
                }
            }

            $bot = { ...$bot, events: [...$bot.events, name] };
        }
    }

</script>


<h3 class="font-semibold text-xl pl-2 mt-2">
    Évènement{$bot.events.length > 1 ? 's' : ''} ({$bot.events.length} / {$events.length} activés)
</h3>
<ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
    {#each $events as { name }}
        <li class="cursor-pointer hover:bg-gray-600 rounded px-4 py-2 mx-2 whitespace-no-wrap"
            on:click={() => toggleEvent(name)}>
            <StatusIndicator enabled={$bot.events.includes(name)}/> {name}
        </li>
    {/each}
</ul>
