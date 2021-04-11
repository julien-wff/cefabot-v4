<script>
    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';

    const API_ROOT = getContext('API_ROOT');

    let file;
    let stats;
    let bots;
    let loading = false, loading2 = false;

    let importedDBs = [];

    async function sendFile() {
        if (loading) return;
        loading = true;
        const data = new FormData();
        data.append('file', file);
        stats = await fetch(`${API_ROOT}/import-stats/convert-sql`, {
            method: 'POST',
            body: data,
        })
            .then(res => res.json())
            .then(e => {
                if (e.error)
                    throw new Error(e.error);
                return e;
            })
            .catch(e => {
                Swal.fire({
                    title: 'Erreur',
                    icon: 'error',
                    text: e instanceof Error ? e.message : e,
                });
                console.error(e);
            });
        bots = await fetch(`${API_ROOT}/bots`)
            .then(res => res.json());

        loading = false;
    }


    function toggleDB(name) {
        if (importedDBs.find(d => d.name === name))
            importedDBs = importedDBs.filter(d => d.name !== name);
        else
            importedDBs = [...importedDBs, { name, bot: null, guild: null }];
    }


    function submitResults() {
        if (loading2)
            return;
        loading2 = true;

        if (importedDBs.length === 0)
            return Swal.fire({
                title: 'Veuillez activer au moins une base',
                icon: 'error',
            });

        const importStats = importedDBs.map(d => ({ ...d, stats: stats[d.name] }));

        fetch(`${API_ROOT}/import-stats/add-stats`, {
            method: 'POST',
            body: JSON.stringify(importStats),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error)
                    throw new Error(res.error);
                importedDBs = [];
                stats = null;
                bots = null;
                Swal.fire({
                    title: 'Stats importées',
                    icon: 'success'
                });
            })
            .catch(err => {
                console.error(err);
                Swal.fire({
                    title: 'Erreur lors de l\'importation',
                    icon: 'error',
                    text: err instanceof Error ? err.message : err,
                });
            })
            .finally(() => loading2 = false);
    }
</script>


<div class="md:mx-10 md:mt-10 sm:mx-4 sm:mt-4 m-2 p-4 bg-gray-700 rounded">
    <h1 class="font-bold text-2xl">Importer des stats</h1>

    <form on:submit|preventDefault={sendFile}>
        <input type="file" on:change={e => file = e.target.files[0]} accept=".sqlite,.db">
        <button class="bg-blue-500 px-4 py-2 rounded mt-2 ml-4 {loading ? 'cursor-not-allowed opacity-75' : ''}">
            Envoyer le fichier
        </button>
    </form>

    {#if stats}
        <h2 class="font-bold text-xl mt-4 mb-2">Bases à importer</h2>
        {#each Object.keys(stats) as key (key + !!importedDBs.find(d => d.name === key))}
            <button class="{importedDBs.find(d => d.name === key) ? 'bg-blue-500' : 'bg-blue-200 text-black'} px-4 py-2 rounded mt-2 ml-4"
                    on:click={() => toggleDB(key)}>
                {key}
            </button>
        {/each}

        <form on:submit|preventDefault={submitResults}>
            {#each importedDBs as { name: key, bot }, i (key + bot)}
                <h3 class="font-bold mt-4 mb-2">{key} ({stats[key].length} utilisateurs)</h3>
                <p class="mt-2 ml-2 inline-block">
                    <label>
                        Bot :
                        <select class="text-black" bind:value={importedDBs[i].bot} required>
                            <option disabled selected value></option>
                            {#each bots as { id, name }}
                                <option value={id}>{name}</option>
                            {/each}
                        </select>
                    </label>
                </p>
                {#if importedDBs[i].bot}
                    <p class="my-2 ml-2 block">
                        <label>
                            Guilde :
                            <select class="text-black" bind:value={importedDBs[i].guild} required>
                                <option disabled selected value></option>
                                {#each bots.find(b => b.id === importedDBs[i].bot).guildsID as id}
                                    <option value={id}>{id}</option>
                                {/each}
                            </select>
                        </label>
                    </p>
                {/if}
            {/each}

            <button class="bg-blue-500 px-4 py-2 rounded mt-6 ml-4 block {loading2 ? 'cursor-not-allowed opacity-75' : ''}">
                Importer
            </button>

        </form>
    {/if}
</div>
