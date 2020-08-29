<script>
    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';

    export let channelName;
    export let channelType;
    export let guild;

    const channels = getContext('channels');
    const bot = getContext('bot');
    let getBotData = getContext('get-bot-data');

    let actualChannel;
    $: actualChannel = ($channels.find(c => c.channelType === channelType) || { channel: {} }).channel;


    async function setGuildChannel() {

        const inputOptions = guild
            .channels
            .reduce((prev, value) =>
                    value.type !== 'category'
                        ? ({ ...prev, [value.id]: `${value.name} - ${value.type}` })
                        : prev,
                {});

        await Swal.fire({
            title: `Changer l'association au salon ${channelName}`,
            showCancelButton: true,
            input: 'select',
            inputOptions,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: value => fetch('/api/channels', {
                method: actualChannel.id ? 'PATCH' : 'POST',
                body: JSON.stringify({
                    bot: $bot.id,
                    guild: guild.guild.id,
                    channel: value,
                    type: channelType
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        })
            .then(res => {
                return res && res.value && Swal.fire({
                    title: `Salon ajouté !`,
                    icon: 'success',
                });
            })
            .catch(error => {
                Swal.fire({
                    title: `Erreur lors de la requête : ${error.message || error}`,
                    icon: 'error'
                });
            });

        getBotData();
    }


    async function deleteGuildChannel() {

        await Swal.fire({
            title: `Supprimer l'association au salon ${channelName}`,
            showCancelButton: true,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => fetch('/api/channels', {
                method: 'DELETE',
                body: JSON.stringify({
                    bot: $bot.id,
                    guild: guild.guild.id,
                    channel: actualChannel.id,
                    type: channelType
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        })
            .then(res => res && res.value && Swal.fire({
                title: `Salon supprimé !`,
                icon: 'success',
            }))
            .catch(error => {
                Swal.fire({
                    title: `Erreur lors de la requête : ${error.message || error}`,
                    icon: 'error'
                });
            });

        getBotData();
    }
</script>

<div class="hover:bg-gray-600 rounded cursor-pointer flex justify-between">

    <div class="p-1 flex-1" on:click={setGuildChannel}>
        {channelName} :
        {#if actualChannel.name}
            {#if actualChannel.deleted}
                <span class="line-through">#{actualChannel.name}</span>
            {:else}
                #{actualChannel.name}
            {/if}
        {:else}
            {'<non défini>'}
        {/if}
    </div>

    {#if actualChannel.name}
        <button
                type="button"
                class="duration-200 px-2 py-1 font-semibold rounded text-red-500 hover:bg-red-500 hover:text-white"
                on:click={deleteGuildChannel}>
            Supprimer
        </button>
    {/if}

</div>
