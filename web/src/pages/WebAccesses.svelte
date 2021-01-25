<script>
    import { getContext, onDestroy } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import dayjs from 'dayjs';
    import CreationDisplay from '../components/web-accesses/CreationDisplay.svelte';
    import UsageDisplay from '../components/web-accesses/UsageDisplay.svelte';
    import IPDisplay from '../components/web-accesses/IPDisplay.svelte';
    import WebAccessesHeader from '../components/web-accesses/WebAccessesHeader.svelte';

    const API_ROOT = getContext('API_ROOT');

    let tempWebAccesses = [];
    let permanentWebAccesses = [];
    let currentAccess;
    let displayTimeout;

    async function getWebAccesses() {
        try {
            const wa = await fetch(`${API_ROOT}/web-accesses`);
            if (wa.status !== 200) throw new Error(wa.statusMessage);
            const waJson = await wa.json();
            if (waJson.error) throw new Error(waJson.error);

            const currentAccessIndex = waJson.findIndex(a => a.current);
            currentAccess = waJson.splice(currentAccessIndex, 1)[0];
            tempWebAccesses = waJson.filter(access => !access.permanent);
            permanentWebAccesses = waJson.filter(access => access.permanent);
            if (!displayTimeout && !currentAccess.permanent) {
                setRemainingTime();
                displayTimeout = setInterval(setRemainingTime, 1000);
            }
        } catch (e) {
            Swal.fire({
                title: 'Erreur lors de la requête',
                text: e.message || e,
                icon: 'error',
            });
        }
    }

    getWebAccesses();

    onDestroy(() => {
        if (displayTimeout)
            clearInterval(displayTimeout);
    });

    let remainingTime;

    function setRemainingTime() {
        if (!currentAccess)
            return;
        remainingTime = dayjs(currentAccess.created + window.TOKEN_EXPIRE_DURATION).fromNow(true);
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


</script>

<div class="md:mx-10 md:mt-10 sm:mx-4 sm:mt-4 m-2 p-4 bg-gray-700 rounded">

    <WebAccessesHeader on:refresh={getWebAccesses}/>

    {#if currentAccess}
        <div class="my-2">
            Accès actuel créé par {currentAccess.username}.<br/>
            {#if currentAccess.permanent}
                Type d'accès : permanent
            {:else}
                Disponible pendant {remainingTime}
            {/if}
        </div>
    {/if}


    {#if permanentWebAccesses.length > 0}
        <h2 class="font-bold text-xl mt-4">Accès permanents</h2>
    {/if}

    {#each permanentWebAccesses as access}
        <div class="flex flex-col cursor-pointer hover:bg-gray-600 rounded p-2">
            <CreationDisplay
                    userID={access.userID}
                    username={access.username}
                    createdAt={access.created}
                    on:copy={() => copyInformations(access.userID, 'ID utilisateur copié')}/>
            <span>Nom : {access.sessionName}</span>
            <UsageDisplay active={access.active} connected={access.connected}/>
            <IPDisplay ip={access.ip} on:copy={() => copyInformations(access.ip, 'IP copiée')}/>
        </div>
    {/each}


    {#if tempWebAccesses.length > 0}
        <h2 class="font-bold text-xl mt-4">Accès temporaires</h2>
    {/if}

    {#each tempWebAccesses as access}
        <div class="flex flex-col cursor-pointer hover:bg-gray-600 rounded p-2">
            <CreationDisplay
                    userID={access.userID}
                    username={access.username}
                    createdAt={access.created}
                    on:copy={() => copyInformations(access.userID, 'ID utilisateur copié')}/>
            <UsageDisplay active={access.active} connected={access.connected}/>
            <IPDisplay ip={access.ip} on:copy={() => copyInformations(access.ip, 'IP copiée')}/>
        </div>
    {/each}

</div>
