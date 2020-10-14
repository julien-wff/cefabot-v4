<script>
    import { createEventDispatcher } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';

    export let id = '';
    export let name = '';

    const dispatch = createEventDispatcher();

    async function deleteUser() {
        await Swal.fire({
            title: 'Supprimer un accès',
            text: `Êtes-vous sur de vouloir supprimer l'accès de ${name} ?`,
            confirmButtonText: 'Supprimer',
            confirmButtonColor: '#f56565',
            showCancelButton: true,
            cancelButtonText: 'Retour',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => fetch(`/api/trusted-accounts`, {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        })
            .then(async res => {
                if (!res || !res.value)
                    return false;

                const resData = await res.value.json();
                if (res.value.status !== 200) {
                    throw new Error(resData.error);
                }
                dispatch('userdeleted');
                return true;
            })
            .catch(error => {
                Swal.fire({ title: `Erreur lors de la requête : ${error.message || error}`, icon: 'error' });
            })
            .then(res => res && Swal.fire({
                title: 'Accès supprimé !',
                icon: 'success',
            }));
    }
</script>


<div class="hover:bg-gray-600 rounded flex flex-row justify-between">
    <div class="px-4 py-2 flex-1">
        {name} ({id})
    </div>
    <button
            class="float-right cursor-pointer duration-200 px-2 py-1 font-semibold rounded text-red-500 hover:bg-red-500 hover:text-white"
            on:click={deleteUser}>
        Supprimer
    </button>
</div>
