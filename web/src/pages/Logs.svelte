<script>
    import { getContext, onDestroy, onMount, setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { createWebSocket } from '../actions/createWebStocket';
    import LogLine from '../components/logs/LogLine.svelte';
    import Options from '../components/logs/Options.svelte';

    const API_ROOT = getContext('API_ROOT');
    const BASE_ROOT = getContext('BASE_ROOT');

    let socket;

    onMount(() => {
        socket = createWebSocket(BASE_ROOT);
        socket.addEventListener('message', msg => {
            if (msg.data === 'new-log') {
                getBots().then(getLogs);
            }
        });
    });

    onDestroy(() => {
        socket.close();
    });


    // Load prism.js if not already
    onMount(() => {
        if (document.getElementById('prismjs'))
            return;

        const js = document.createElement('script');
        js.async = true;
        js.src = `${BASE_ROOT}/prism.min.js`;
        js.id = 'prismjs';
        js.addEventListener('load', () => {
            Prism.manual = true;
        });
        document.body.append(js);

        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = `${BASE_ROOT}/prism.min.css`;
        document.head.append(css);
    });


    let logs = writable([]);
    let bots = writable([]);
    let filters = writable({
        limit: 100,
        offset: 0,
        bots: null,
        app: true,
        sort: 'asc',
        stack: true,
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
        const req = await fetch(`${API_ROOT}/bots`);
        $bots = await req.json();
    }

    async function getLogs() {
        const params = new URLSearchParams($filters);
        if (Array.isArray($filters.bots) && $filters.bots.length > 0)
            params.set('bots', $filters.bots.join(','));
        else
            params.delete('bots');
        const res = await fetch(`${API_ROOT}/logs?${params.toString()}`);
        $logs = await res.json();
    }

    function updateURLSearchParams() {
        let params = '?';
        if ($filters.app)
            params += 'app';
        if (Array.isArray($filters.bots) && $filters.bots.length > 0) {
            if (params !== '?')
                params += '&';
            params += `bots=${$filters.bots.join(',')}`;
        }
        window.history.replaceState(null, null, params);
    }

    const filterBotsArray = arr => {
        // Only keep the IDs that are valid (= linked to an existing bot)
        let newArr = arr.filter(b => $bots.find(existingBot => existingBot.id === b));
        // Remove duplicated IDs
        return [...new Set(newArr)];
    };


    onMount(async () => {
        await getBots();

        const URLFilters = new URLSearchParams(window.location.search || 'app');
        $filters.app = URLFilters.get('app') !== null;
        const bots = URLFilters.get('bots');
        if (typeof bots === 'string' && bots.match(/^[0-9a-fA-F]{24}(,[0-9a-fA-F]{24})*$/)) {
            let botsArray = bots.split(/,/g);
            botsArray = filterBotsArray(botsArray);
            $filters.bots = botsArray;
        }

        filters.subscribe(updateURLSearchParams);
        await getLogs();
    });
</script>

<div class="md:mx-10 md:mt-10 sm:mx-4 sm:mt-4 m-2 p-4 bg-gray-700 rounded">

    <Options/>

    {#each $logs as log}
        <div class="block">
            <LogLine {...log}/>
        </div>
    {/each}
</div>
