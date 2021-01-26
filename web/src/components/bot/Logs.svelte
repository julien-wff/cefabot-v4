<script>
    import { getContext, onDestroy, onMount } from 'svelte';
    import { Link } from 'svelte-routing';
    import { createWebSocket } from '../../actions/createWebStocket';
    import { dateFormat } from '../../functions/date-format';

    const API_ROOT = getContext('API_ROOT');
    const BASE_ROOT = getContext('BASE_ROOT');
    let logs = getContext('logs');
    let bot = getContext('bot');

    let socket;

    onMount(() => {
        socket = createWebSocket(BASE_ROOT);
        socket.addEventListener('message', msg => {
            if (msg.data === 'new-log')
                refreshLogs();
        });
    });

    onDestroy(() => {
        socket.close();
    });

    async function refreshLogs() {
        const res = await fetch(`${API_ROOT}/logs?bots=${$bot.id}&app=false&limit=10&sort=desc`);
        const l = await res.json();
        $logs = l.reverse();
    }

</script>

{#if $logs.length > 0}

    <div class="pl-2 mt-2 flex justify-between">
        <h3 class="font-semibold text-xl">
            Logs du bot{$logs.length > 1 ? ` (${$logs.length} dernières lignes)` : ''}
        </h3>
        <Link to="./logs?bots={$bot.id}">
            <button class="bg-blue-500 px-4 py-2 rounded ml-2">
                Détails
            </button>
        </Link>
    </div>

    <div class="p-2 ml-2">
        {#each $logs as { type, message, date }}
            <div class="block break-words overflow-y-hidden"
                 class:text-gray-300={type === 'debug'}
                 class:text-orange-400={type === 'warning'}
                 class:text-red-400={type === 'error'}>
                [{dateFormat.format(new Date(date))}]
                {message}
            </div>
        {/each}
    </div>

{/if}
