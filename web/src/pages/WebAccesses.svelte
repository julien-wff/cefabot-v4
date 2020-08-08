<script>
    import Swal from 'sweetalert2/dist/sweetalert2';

    let webAccesses = [];

    async function getWebAccesses() {
        try {
            const wa = await fetch('/api/web-accesses');
            if (wa.status !== 200) throw new Error(wa.statusMessage);
            const waJson = await wa.json();
            if (waJson.error) throw new Error(waJson.error);

            webAccesses = waJson;
        } catch (e) {
            Swal.fire({
                title: 'Erreur lors de la requête',
                text: e.message || e,
                icon: 'error',
            });
        }
    }

    getWebAccesses();

    const intlOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };

</script>

<div class="md:mx-10 md:mt-10 sm:mx-4 sm:mt-4 m-2 p-4 bg-gray-700 rounded">

    <div class="flex sm:flex-row flex-col-reverse justify-between mb-2">
        <h1 class="font-bold text-2xl">Accès web</h1>
        <div>
            <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded" on:click={getWebAccesses}>Rafraichir</button>
        </div>
    </div>

    {#each webAccesses as access}
        <div class="flex flex-col cursor-pointer hover:bg-gray-600 rounded p-2">
            <div title={access.userID}>{access.username}</div>
            <div>{new Intl.DateTimeFormat('FR', intlOptions).format(new Date(access.created))}</div>
            <div>Utilisé : {access.connected ? 'oui' : 'non'}</div>
            <div>Déconnecté : {!access.active ? 'oui' : 'non'}</div>
            <div>IP :
                <pre class="inline">{access.ip}</pre>
            </div>
        </div>
    {/each}

</div>
