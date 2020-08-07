<script>
    import Options from '../components/logs/Options.svelte';
    import { setContext } from 'svelte';
    import LogLine from '../components/logs/LogLine.svelte';
    import { writable } from 'svelte/store';

    let logs = writable([]);
    let bots = writable([]);
    let filters = writable({
        limit: 20,
        offset: 0,
        bots: null,
        app: true,
        sort: 'asc',
    });

    let options = writable({
        showTime: true,
        showCheckboxes: false
    });

    let selectedLogs = writable([]);

    setContext('logs', logs);
    setContext('selected-logs', selectedLogs);
    setContext('update-logs', getLogs);
    setContext('filters', filters);
    setContext('bots', bots);
    setContext('options', options);

    async function getBots() {
        const req = await fetch('/api/bots');
        $bots = await req.json();
        return $bots;
    }

    async function getLogs() {
        const params = new URLSearchParams($filters);
        params.set('bots', $filters.bots.join(','));
        const res = await fetch(`/api/logs?${params.toString()}`);
        $logs = await res.json();
    }

    async function refresh() {
        const bots = await getBots();
        $filters = { ...$filters, bots: bots.map(b => b.id) };
        await getLogs();
    }

    refresh();
</script>

<div class="md:mx-10 md:mt-10 sm:mx-4 sm:mt-4 m-2 p-4 bg-gray-700 rounded">

    <Options/>

    {#each $logs as log}
        <div class="block">
            <LogLine {...log}/>
        </div>
    {/each}
</div>
