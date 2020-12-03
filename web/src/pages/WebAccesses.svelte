<script>
    import { onDestroy, onMount } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';

    let webAccesses = [];
    let currentAccess;

    async function getWebAccesses() {
        try {
            const wa = await fetch('/api/web-accesses');
            if (wa.status !== 200) throw new Error(wa.statusMessage);
            const waJson = await wa.json();
            if (waJson.error) throw new Error(waJson.error);

            const currentAccessIndex = waJson.findIndex(a => a.current);
            currentAccess = waJson.splice(currentAccessIndex, 1)[0];
            webAccesses = waJson;
            if (!remainingTime)
                setRemainingTime();
        } catch (e) {
            Swal.fire({
                title: 'Erreur lors de la requête',
                text: e.message || e,
                icon: 'error',
            });
        }
    }

    getWebAccesses();

    let displayTimeout;
    onMount(() => {
        displayTimeout = setInterval(setRemainingTime, 1000);
    });
    onDestroy(() => {
        clearInterval(displayTimeout);
    });

    const TOKEN_VALIDITY = 3600 * 1000;
    let remainingTime;

    function setRemainingTime() {
        if (!currentAccess)
            return;
        const timeDelta = ((currentAccess.created + TOKEN_VALIDITY) - Date.now()) / 1000;
        if (timeDelta > 60) {
            const mins = Math.floor(timeDelta / 60);
            const secs = Math.floor(timeDelta - mins * 60);
            remainingTime = `${mins} minute${mins > 1 ? 's' : ''} ${secs} seconde${secs > 1 ? 's' : ''}`;
        } else {
            const secs = Math.floor(timeDelta);
            remainingTime = `${secs} seconde${secs > 1 ? 's' : ''}`;
        }
    }

    async function copyInformations(info, message) {
        await navigator.clipboard.writeText(info);
        Swal.fire({
            title: message,
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
        });
    }

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
            <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded" on:click={getWebAccesses}>
                Rafraichir
            </button>
        </div>
    </div>

    {#if currentAccess}
        <div class="my-2">
            Accès actuel créé par {currentAccess.username}.<br/>
            Disponible pendant {remainingTime}
        </div>
    {/if}

    <h2 class="font-bold text-xl mt-4">Anciens accès</h2>

    {#each webAccesses as access}
        <div class="flex flex-col cursor-pointer hover:bg-gray-600 rounded p-2">
            <h3 on:click={() => copyInformations(access.userID, 'ID utilisateur copié')}>
                Par <span title={access.userID}>{access.username}</span>,
                créé le {new Intl.DateTimeFormat('FR', intlOptions).format(new Date(access.created))}
            </h3>
            <div>
                <span class="{access.connected ? 'text-orange-500' : 'text-green-500'}">
                    {access.connected ? 'Utilisé' : 'Non utilisé'},
                </span>
                <span class="{access.active ? 'text-orange-500' : 'text-red-500'}">
                    {access.active ? 'actif' : 'inactif'}
                </span>
            </div>
            {#if access.ip}
                <div on:click={() => copyInformations(access.ip, 'IP copiée')}>
                    IP :
                    <pre class="inline">{access.ip}</pre>
                </div>
            {/if}
        </div>
    {/each}

</div>
