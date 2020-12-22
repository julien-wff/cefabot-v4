<script>

    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';

    const API_ROOT = getContext('API_ROOT');
    const BASE_ROOT = getContext('BASE_ROOT');
    let options = getContext('options');
    let filters = getContext('filters');
    let logs = getContext('logs');
    let bots = getContext('bots');
    let selectedLogs = getContext('selected-logs');
    let updateLogs = getContext('update-logs');

    let showOptions = false;

    let refreshingLogs = false;
    logs.subscribe(() => refreshingLogs ? refreshingLogs = false : void 0);

    function toggleBot(id) {
        if (Array.isArray($filters.bots) && $filters.bots.includes(id))
            $filters = { ...$filters, bots: $filters.bots.filter(b => b !== id) };
        else
            $filters = { ...$filters, bots: [...($filters.bots || []), id] };
    }

    function refreshLogs() {
        if (refreshingLogs) return;
        refreshingLogs = true;
        updateLogs();
    }

    function selectAllLogs() {
        if (!$options.showCheckboxes)
            $options = { ...$options, showCheckboxes: true };
        if ($selectedLogs.length !== $logs.length) {
            $selectedLogs = $logs.map(l => l._id);
        } else {
            $selectedLogs = [];
        }
    }

    function invertSelection() {
        if (!$options.showCheckboxes)
            $options = { ...$options, showCheckboxes: true };
        $logs.forEach(l => {
            if ($selectedLogs.includes(l._id)) {
                $selectedLogs = $selectedLogs.filter(l1 => l1 !== l._id);
            } else {
                $selectedLogs = [...$selectedLogs, l._id];
            }
        });
    }

    let deletingLogs = false;

    async function deleteSelectedLogs() {
        deletingLogs = true;
        const res = await fetch(`${API_ROOT}/logs`, {
            method: 'DELETE',
            body: JSON.stringify($selectedLogs),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
        deletingLogs = false;
        refreshLogs();
        if (!res.ok) {
            let error = 'Erreur inconnue.';
            try {
                error = (await res.json()).error;
            } catch {
            }
            await Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error,
            });
        }
        $selectedLogs = [];
    }

</script>


<div class="p-1">

    <div class="flex mb-2">
        <div class="bg-blue-500 cursor-pointer rounded-l border-r border-gray-700 h-10 flex items-center justify-center flex-1"
             on:click={() => showOptions = !showOptions}>
            <img src="{BASE_ROOT}/icons/settings.svg" alt="Paramètres" class="h-6"/>
            <span class="hidden xl:block pl-1">{showOptions ? 'Masquer' : 'Afficher'} les paramètres</span>
        </div>
        <div class="bg-blue-500 cursor-pointer border-r border-gray-700 h-10 flex items-center justify-center flex-1 {refreshingLogs ? 'cursor-not-allowed opacity-75' : ''}"
             on:click={refreshLogs}>
            <img src="{BASE_ROOT}/icons/refresh.svg" alt="Rafraichir" class="h-6"/>
            <span class="hidden xl:block pl-1">Rafraichir</span>
        </div>
        <div class="bg-blue-500 cursor-pointer border-r border-gray-700 h-10 flex items-center justify-center flex-1"
             on:click={selectAllLogs}>
            <img src="{BASE_ROOT}/icons/select_all.svg" alt="Tout sélectionner" class="h-6"/>
            <span class="hidden xl:block pl-1">
                Tout {$selectedLogs.length === $logs.length ? 'dé' : ''}sélectionner
            </span>
        </div>
        <div class="bg-blue-500 cursor-pointer border-r border-gray-700 h-10 flex items-center justify-center flex-1"
             on:click={invertSelection}>
            <img src="{BASE_ROOT}/icons/find_replace.svg" alt="Inverser la sélection" class="h-6"/>
            <span class="hidden xl:block pl-1">Inverser la sélection</span>
        </div>
        <div class="bg-red-500 cursor-pointer rounded-r h-10 flex items-center justify-center flex-1 {deletingLogs ? 'cursor-not-allowed opacity-75' : ''}"
             on:click={deleteSelectedLogs}>
            <img src="{BASE_ROOT}/icons/delete.svg" alt="Supprimer" class="h-6"/>
            <span class="hidden xl:block pl-1">Supprimer la sélection</span>
        </div>
    </div>

    {#if showOptions}
        <div class="py-2 grid md:grid-cols-2">
            <div>
                <h3 class="font-bold">Filtres</h3>
                <label class="hover:bg-gray-600 p-1 duration-100 rounded cursor-pointer block">
                    <input type="checkbox" bind:checked={$filters.app}>
                    Afficher les logs d'application
                </label>
                {#each $bots as bot}
                    <label class="hover:bg-gray-600 p-1 duration-100 rounded cursor-pointer block">
                        <input type="checkbox"
                               checked={Array.isArray($filters.bots) && $filters.bots.includes(bot.id)}
                               on:click={() => toggleBot(bot.id)}>
                        Afficher les logs du bot {bot.name}
                    </label>
                {/each}
            </div>
            <div class="md:pl-2 md:border-l">
                <h3 class="font-bold">Options</h3>
                <label class="hover:bg-gray-600 p-1 duration-100 rounded cursor-pointer block">
                    <input type="checkbox" bind:checked={$options.showTime}>
                    Afficher l'heure
                </label>
                <label class="hover:bg-gray-600 p-1 duration-100 rounded cursor-pointer block">
                    <input type="checkbox" bind:checked={$options.showCheckboxes}>
                    Afficher les cases à cocher
                </label>
            </div>
        </div>
    {/if}

</div>
