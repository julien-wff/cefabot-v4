<!--suppress UnnecessaryLabelJS, JSUnresolvedVariable -->
<script>
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import Nanobar from 'nanobar';
    import Loading from '../components/Loading.svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import Header from '../components/bot/Header.svelte';
    import Status from '../components/bot/Status.svelte';
    import Commands from '../components/bot/Commands.svelte';
    import Events from '../components/bot/Events.svelte';
    import DataStorage from '../components/bot/DataStorage.svelte';
    import Guilds from '../components/bot/Guilds.svelte';
    import Storage from '../components/bot/Storage.svelte';
    import Logs from '../components/bot/Logs.svelte';

    export let id;

    const progressBar = new Nanobar();
    let currentProgress = 0;
    const totalProgress = 8;

    function setProgressBar() {
        let progress = currentProgress / totalProgress * 100;
        if (progress > 100) progress = 100;
        progressBar.go(progress);
    }

    let bot = writable(null);
    setContext('bot', bot);
    let initialData = writable(null);
    setContext('initial-data', initialData);
    let commands = writable([]);
    setContext('commands', commands);
    let events = writable([]);
    setContext('events', events);
    let dataStorage = writable([]);
    setContext('data-storage', dataStorage);
    let guilds = writable([]);
    setContext('guilds', guilds);
    let files = writable([]);
    setContext('files', files);
    let channels = writable([]);
    setContext('channels', channels);
    let logs = writable([]);
    setContext('logs', logs);

    async function fetchData(url) {
        const res = await fetch(url);
        const data = res.json();
        if (data.error) {
            throw new Error(error);
        }
        currentProgress++;
        setProgressBar();
        return data;
    }

    async function getBotData() {
        currentProgress = 0;
        try {
            $bot = await fetchData(`/api/bots/${id}`);
            $initialData = $bot;
            fetchData('/api/commands').then(data => $commands = data);
            fetchData('/api/events').then(data => $events = data);
            fetchData(`/api/data?botID=${id}`).then(data => $dataStorage = data);
            fetchData(`/api/storage/${id}`).then(data => $files = data);
            fetchData(`/api/channels?bot=${id}`).then(data => $channels = data);
            fetchData(`/api/logs?bots=${id}&app=false&limit=10`).then(data => $logs = data);
            if ($bot.enabled)
                $guilds = await Promise.all(
                    $bot.guildsID.map(g => fetchData(`/api/bots/${id}/guild/${g}?iconsSize=64`))
                );
        } catch (e) {
            await Swal.fire({
                title: 'Erreur',
                icon: 'error',
                text: `Impossible d'obtenir les données : ${e.message}`
            });
        }
    }

    setContext('get-bot-data', getBotData);

    getBotData();

    function applyChanges() {
        Swal.fire({
            title: 'Appliquer les changements',
            text: 'Êtes-vous sur de vouloir appliquer les changements ?',
            confirmButtonText: 'Appliquer',
            showCancelButton: true,
            cancelButtonText: 'Retour',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => fetch(`/api/bots/${id}`, {
                method: 'PATCH',
                body: JSON.stringify($bot),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
                .then(async res => {
                    const resData = await res.json();
                    if (res.status !== 200) {
                        throw new Error(resData.error);
                    }
                    $bot = resData;
                    $initialData = resData;
                    return true;
                })
                .catch(error => {
                    Swal.showValidationMessage(`Erreur lors de la requête : ${error.message}`);
                })
                .then(res => res && res.value && Swal.fire({
                    title: 'Données modifiées !',
                    text: 'Note : certaines données ne seront effectives qu\'après un redémarrage.',
                    icon: 'success',
                }))
        });
    }
</script>

{#if !$bot || !$bot.name}
    <Loading/>
{:else}
    <div class="md:mx-10 md:mt-10 sm:mx-4 sm:mt-4 m-2 p-4 bg-gray-700 rounded">
        <Header {applyChanges}/>
        <Status/>
        <Commands/>
        <Events/>
        <DataStorage/>
        <Guilds/>
        <Storage/>
        <Logs/>
    </div>
{/if}
