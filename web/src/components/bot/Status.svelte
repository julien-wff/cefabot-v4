<script>
    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import StatusIndicator from './StatusIndicator.svelte';

    let bot = getContext('bot');

    function toggleBotStatus() {
        $bot = { ...$bot, enabled: !$bot.enabled };
    }

    async function rebootBot() {
        Swal.fire({
            title: `Redémarrer ${$bot.name}`,
            text: 'Êtes-vous sur de vouloir redémarrer le bot ?',
            confirmButtonText: 'Redémarrer',
            showCancelButton: true,
            cancelButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: () => fetch(`/api/bots/${$bot.id}/reboot`)
                    .then(async res => {
                        const data = await res.json();
                        if (res.status !== 200) {
                            throw new Error(data.error).message;
                        }
                        return true;
                    })
                    .catch(error => {
                        Swal.showValidationMessage(`Erreur lors de la requête : ${error}`);
                    })
        })
                .then(res => res && res.value && Swal.fire({
                    title: 'Redémarrage effectué !',
                    icon: 'success',
                }));
    }

</script>

<h3 class="font-semibold text-xl pl-2">Status</h3>
<div class="py-2 px-4 hover:bg-gray-600 rounded inline-block cursor-pointer block"
     on:click={toggleBotStatus}>
    <StatusIndicator enabled={$bot.enabled}/>
    {$bot.enabled ? 'En ligne' : 'Désactivé'}
</div>
<button class="hover:bg-gray-600 rounded py-2 px-4 block" on:click={rebootBot}>Redémarrer</button>
