<script>
    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import DataValue from './data/DataValue.svelte';
    import AddData from './data/AddData.svelte';

    let dataStorage = getContext('data-storage');
    const getBotData = getContext('get-bot-data');

    function showKey(index) {
        const data = $dataStorage[index];
        Swal.fire({
            title: data.key,
            html: `
                Type : ${data.type}<br>
                Valeur : ${data.value}<br>
                ID : ${data.id}<br>
                GuildID : ${data.guildID}
            `,
        });
    }

    async function deleteData(id, key) {
        await Swal.fire({
            title: `Supprimer la donnée ${key}`,
            text: 'Êtes-vous sur de vouloir supprimer cette donnée ?',
            confirmButtonText: 'Supprimer',
            confirmButtonColor: '#f56565',
            showCancelButton: true,
            cancelButtonText: 'Retour',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => fetch(`/api/data/${id}`, {
                method: 'DELETE'
            })
        })
                .then(async res => {
                    const resData = await res.value.json();
                    if (res.value.status !== 200) {
                        throw new Error(resData.error);
                    }
                    $dataStorage = $dataStorage.filter(d => d.id !== id);
                    return true;
                })
                .catch(error => {
                    Swal.fire({ title: `Erreur lors de la requête : ${error.message || error}`, icon: 'error' });
                })
                .then(res => res && Swal.fire({
                    title: 'Donnée supprimée !',
                    icon: 'success',
                }));
        getBotData();
    }

</script>


<h3 class="font-semibold text-xl pl-2 mt-2">
    Données ({$dataStorage.length} clés)
</h3>

{#each $dataStorage as {key, value, guildID, type, id}, ind}
    <div class="hover:bg-gray-600 rounded flex flex-row justify-between">
        <div class="px-4 py-2 cursor-pointer flex-1" on:click={() => showKey(ind)}>
            <pre class="font-semibold inline">{key}</pre> :
            <DataValue data={$dataStorage[ind]}/>
        </div>
        <button
                class="float-right cursor-pointer duration-200 px-2 py-1 font-semibold rounded text-red-500 hover:bg-red-500 hover:text-white"
                on:click={() => deleteData(id, key)}>
            Supprimer
        </button>
    </div>
{/each}

<AddData/>
