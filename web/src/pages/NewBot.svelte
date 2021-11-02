<!--suppress CheckEmptyScriptTag -->
<script>
    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import { navigate } from 'svelte-routing';

    const API_ROOT = getContext('API_ROOT');

    let token = '';
    let clientID = '';
    let name = '';
    let commandStart = '!';

    async function handleSubmit() {
        let botID;
        await Swal.fire({
            title: 'Créer un bot',
            text: `Êtes-vous sur de vouloir créer le bot ${name} ?`,
            confirmButtonText: 'Créer',
            showCancelButton: true,
            cancelButtonText: 'Retour',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => fetch(`${API_ROOT}/bots`, {
                method: 'POST',
                body: JSON.stringify({ token, clientID, name, commandStart }),
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
                        botID = resData.id;
                        return true;
                    })
                    .catch(error => {
                        Swal.fire({
                            title: `Erreur lors de la requête : ${error.message}`,
                            icon: 'error'
                        });
                    })
                    .then(res => res && res.value && Swal.fire({
                        title: 'Bot créé !',
                        confirmButtonText: 'Voir',
                        icon: 'success',
                    }))
        });

        if (botID)
            navigate(`./${botID}`);
    }
</script>


<style>
    input:invalid {
        border-color: #f56565;
    }
</style>


<form class="md:mx-10 md:mt-10 sm:mx-4 sm:mt-4 m-2 p-4 bg-gray-700 rounded" on:submit|preventDefault={handleSubmit}>
    <h1 class="font-bold text-2xl">Ajouter un bot</h1>
    <div class="my-3">
        <label>
            <span class="text-sm mb-2 inline-block">Token</span>
            <input
                    class="shadow appearance-none bg-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    bind:value={token}
                    pattern={"^[M-Q][A-Za-z\\d]{23}\\.[\\w-]{6}\\.[\\w-]{27}$"}
                    required/>
        </label>
    </div>
    <div class="my-3">
        <label>
            <span class="text-sm mb-2 inline-block">Client ID</span>
            <input
                    class="shadow appearance-none bg-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    bind:value={clientID}
                    pattern={"^\\d{17,18}$"}
                    required/>
        </label>
    </div>
    <div class="my-3">
        <label>
            <span class="text-sm mb-2 inline-block">Nom</span>
            <input
                    class="shadow appearance-none bg-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    bind:value={name}
                    pattern={"^[a-z-]{5,30}$"}
                    maxlength="30"
                    required/>
        </label>
    </div>
    <div class="my-3">
        <label>
            <span class="text-sm mb-2 inline-block">Déclencheur de commande</span>
            <input
                    class="shadow appearance-none bg-gray-600 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    bind:value={commandStart}
                    minlength="1"
                    maxlength="10"
                    required/>
        </label>
    </div>
    <button class="block py-2 px-4 mt-3 inline-block bg-blue-500 rounded">Valider</button>
</form>
