<script>
    import { getContext, onDestroy } from 'svelte';
    import { dateFormat } from '../../functions/date-format';

    let logs = getContext('logs');
    let bot = getContext('bot');

    const socket = new WebSocket(`ws://${window.location.host}/ws/`);

    onDestroy(() => {
        socket.close();
    });

    socket.addEventListener('message', msg => {
        if (msg.data === 'new-log')
            refreshLogs();
    });

    async function refreshLogs() {
        const res = await fetch(`/api/logs?bots=${$bot.id}&app=false&limit=10&sort=desc`);
        const l = await res.json();
        $logs = l.reverse();
    }

</script>

{#if $logs.length > 0}

    <h3 class="font-semibold text-xl pl-2 mt-2">
        Logs du bot{$logs.length > 1 ? ` (${$logs.length} dernières lignes)` : ''}
    </h3>

    <div class="p-2 ml-2">
        {#each $logs as { type, message, date }}
            <div class="block"
                 class:text-gray-300={type === 'debug'}
                 class:text-orange-400={type === 'warning'}
                 class:text-red-400={type === 'error'}>
                [{dateFormat.format(new Date(date))}]
                {message}
            </div>
        {/each}
    </div>

{/if}
