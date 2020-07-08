<!--suppress JSUnresolvedVariable -->
<script>
    import { getContext } from 'svelte';
    import equal from 'deep-equal';
    import Swal from 'sweetalert2/dist/sweetalert2';

    export let applyChanges;

    let bot = getContext('bot');
    let initialData = getContext('initial-data');
    let getBotData = getContext('get-bot-data')

    $: sameData = equal($bot, $initialData);

    async function changeBotName() {
        const { value } = await Swal.fire({
            title: `Renommer ${$bot.name}`,
            input: 'text',
            inputValue: $bot.name,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value)
                    return 'Veuillez entrer un nom';
                if (!value.match(/^[a-z-]{5,30}$/))
                    return 'Nom invalide : les seuls caractères autorisés sont les lettres minuscules et les tirets';
            }
        });
        if (typeof value === 'string')
            $bot = { ...$bot, name: value };
    }

</script>


<div class="flex sm:flex-row flex-col-reverse justify-between sm:h-16">
    <h2 class="text-2xl p-2 font-bold hover:bg-gray-600 rounded inline-block cursor-pointer"
        on:click={changeBotName}>Bot : {$bot.name}</h2>
    <br/>
    <div class="pl-2">
        {#if !sameData}
            <button class="bg-red-500 px-4 py-2 rounded" on:click={applyChanges}>Appliquer les changements
            </button>
        {/if}
        <button class="bg-blue-500 px-4 py-2 rounded"
                on:click={getBotData}>{sameData ? 'Rafraichir' : 'Réinitialiser'}</button>
    </div>
</div>
