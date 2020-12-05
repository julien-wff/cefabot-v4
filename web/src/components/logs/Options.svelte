<script>

    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';

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
        const res = await fetch('/api/logs', {
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
    <div class="flex flex-wrap">
        <button on:click={() => showOptions = !showOptions}
                class="cursor-pointer py-2 px-4 bg-blue-400 text-white rounded mr-4 mb-4"
                type="button">
            {showOptions ? 'Masquer' : 'Afficher'} les paramètres
        </button>
        <button type="button"
                class="cursor-pointer py-2 px-4 bg-blue-400 text-white rounded mr-4 mb-4"
                class:cursor-not-allowed={refreshingLogs}
                class:opacity-75={refreshingLogs}
                on:click={refreshLogs}>
            Rafraichir
        </button>
        <button type="button" class="cursor-pointer py-2 px-4 bg-blue-400 text-white rounded mr-4 mb-4"
                on:click={selectAllLogs}>
            Tout {$selectedLogs.length === $logs.length ? 'dé' : ''}sélectionner
        </button>
        <button type="button" class="cursor-pointer py-2 px-4 bg-blue-400 text-white rounded mr-4 mb-4"
                on:click={invertSelection}>
            Inverser la sélection
        </button>
        <button type="button" class="cursor-pointer py-2 px-4 bg-red-400 text-white rounded mb-4"
                class:cursor-not-allowed={deletingLogs}
                class:opacity-75={deletingLogs}
                on:click={deleteSelectedLogs}>
            Supprimer la sélection
        </button>
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
