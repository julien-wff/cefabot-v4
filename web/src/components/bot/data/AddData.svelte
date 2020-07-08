<script>
    import { getContext } from 'svelte';
    import Swal from 'sweetalert2/dist/sweetalert2';
    import { dataTypes } from '../../../functions/convert-data-type';

    let dataStorage = getContext('data-storage');
    let guilds = getContext('guilds');
    let data = getContext('data');
    let getBotData = getContext('get-bot-data');

    async function addKey() {
        const multiGuilds = $guilds.length > 1;

        const alertBox = Swal.mixin({
            title: 'Ajouter une donnée',
            progressSteps: multiGuilds ? [1, 2, 3, 4] : [1, 2, 3],
            showCancelButton: true,
        });

        const { value: key } = await alertBox.fire({
            text: 'Nom de la donnée',
            currentProgressStep: 0,
            input: 'text',
            inputValidator: v => !v.match(/^[a-z-]{4,30}$/) && 'Nom invalide (requis : 4 à 30 lettres minuscules et tirets)',
        });
        if (!key) return;

        const { value: type } = await alertBox.fire({
            text: 'Type de donnée',
            currentProgressStep: 1,
            input: 'select',
            inputOptions: dataTypes
        });
        if (!type) return;

        let guildID;
        if (multiGuilds) {
            const res = await alertBox.fire({
                text: 'Guilde',
                currentProgressStep: 2,
                input: 'select',
                inputOptions: $guilds.reduce((prev, val) => ({ ...prev, [val.guild.id]: val.guild.name }), {}),
            });
            guildID = res.value;
        } else {
            guildID = $guilds[0].guild.id;
        }
        if (!guildID) return;
        const selectedGuild = $guilds.find(g => g.guild.id === guildID);

        const inputType = type === 'string' || type === 'int' || type === 'float' ? 'text'
                : type === 'array' || type === 'object' ? 'textarea'
                        : 'select';
        const inputOptions = type === 'boolean' ? { true: 'Vrai', false: 'Faux' }
                : type === 'discord-role' ? selectedGuild.roles.reduce((prev, val) => ({
                            ...prev,
                            [val.id]: val.name
                        }), {})
                        : type === 'discord-user' ? selectedGuild.members.reduce((prev, val) => ({
                                    ...prev,
                                    [val.id]: val.name
                                }), {})
                                : type === 'discord-channel' ? selectedGuild.channels.reduce((prev, val) => ({
                                            ...prev,
                                            [val.id]: `${val.name} - ${val.type}`
                                        }), {})
                                        : undefined;
        const inputValidator = v => {
            if ((type === 'int' && isNaN(parseInt(v))) || (type === 'float' && isNaN(parseFloat(v))))
                return 'Nombre invalide';
            if (type === 'array' || type === 'object')
                try {
                    const o = JSON.parse(v);
                    if (type === 'array' && !Array.isArray(o)) {
                        return 'Liste invalide';
                    }
                } catch (e) {
                    if (type === 'array')
                        return 'Liste invalide';
                    else
                        return 'Objet invalide';
                }
        };

        await alertBox.fire({
            text: 'Valeur',
            currentProgressStep: 2 + +multiGuilds,
            input: inputType,
            inputOptions,
            inputValidator,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: value => {
                if (type === 'boolean')
                    value = value === 'true';
                if (type === 'int')
                    value = parseInt(value);
                if (type === 'float')
                    value = parseFloat(value);
                if (type === 'array' || type === 'object')
                    value = JSON.parse(value);

                return fetch(`/api/data`, {
                    method: 'POST',
                    body: JSON.stringify({ key, type, guildID, value, botID: $data.id }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
            }
        })
                .then(async res => {
                    const resData = await res.value.json();
                    if (res.value.status !== 200) {
                        throw new Error(resData.error);
                    }
                    $dataStorage = [...$dataStorage, resData];
                    return true;
                })
                .catch(error => {
                    Swal.fire({
                        title: `Erreur lors de la requête : ${error.message || error}`,
                        icon: 'error'
                    });
                })
                .then(res => res && Swal.fire({
                    title: `Clé ${key} ajoutée !`,
                    icon: 'success',
                }));

        getBotData();
    }
</script>


<div class="hover:bg-gray-600 rounded px-4 py-2 cursor-pointer font-bold" on:click={addKey}>
    Ajouter une donnée ➕
</div>
