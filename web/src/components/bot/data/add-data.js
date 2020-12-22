import Swal from 'sweetalert2/dist/sweetalert2';
import { dataTypes } from '../../../functions/convert-data-type';


/**
 * @param mixin {Swal}
 * @param currentStep {number}
 * @return {Promise<string | undefined>}
 */
export async function getKey(mixin, currentStep) {
    const { value } = await mixin.fire({
        text: 'Nom de la donnée',
        currentProgressStep: currentStep,
        input: 'text',
        inputValidator: v => !v.match(/^[a-z-]{4,30}$/) && 'Nom invalide (requis : 4 à 30 lettres minuscules et tirets)',
    });
    return value;
}


/**
 * @param mixin {Swal}
 * @param currentStep {number}
 * @return {Promise<string | undefined>}
 */
export async function getType(mixin, currentStep) {
    const { value } = await mixin.fire({
        text: 'Type de donnée',
        currentProgressStep: currentStep,
        input: 'select',
        inputOptions: dataTypes
    });
    return value;
}


/**
 * @param mixin {Swal}
 * @param currentStep {number}
 * @return {Promise<boolean>}
 */
export async function getSecret(mixin, currentStep) {
    const { value: secret } = await mixin.fire({
        text: 'La valeur est-elle secrete ?',
        currentProgressStep: currentStep,
        confirmButtonText: 'Oui',
        confirmButtonColor: '#48bb78',
        cancelButtonText: 'Non',
        cancelButtonColor: '#f56565',
        reverseButtons: true,
        focusCancel: true,
    });

    return !!secret;
}


/**
 * @param mixin {Swal}
 * @param currentStep {number}
 * @param guilds {*[]}
 * @return {Promise<*>}
 */
export async function getGuild(mixin, currentStep, guilds) {

    const multiGuilds = guilds.length > 1;

    let guildID;
    if (multiGuilds) {
        const res = await mixin.fire({
            text: 'Guilde associée à la donnée',
            currentProgressStep: 3,
            input: 'select',
            inputOptions: guilds.reduce((prev, val) => ({ ...prev, [val.guild.id]: val.guild.name }), {}),
        });
        guildID = res.value;
    } else {
        guildID = guilds[0].guild.id;
    }

    if (!guildID) return;
    return guilds.find(g => g.guild.id === guildID);
}

export const inputType = type =>
    type === 'string' || type === 'int' || type === 'float'
        ? 'text'
        : type === 'array' || type === 'object'
        ? 'textarea'
        : 'select';

export const inputOptions = (type, guild) => type === 'boolean' ? { true: 'Vrai', false: 'Faux' }
    : type === 'discord-role' ? guild.roles.reduce((prev, val) => ({
            ...prev,
            [val.id]: val.name
        }), {})
        : type === 'discord-user' ? guild.members.reduce((prev, val) => ({
                ...prev,
                [val.id]: val.name
            }), {})
            : type === 'discord-channel' ? guild.channels.reduce((prev, val) => ({
                    ...prev,
                    [val.id]: `${val.name} - ${val.type}`
                }), {})
                : undefined;

export const valueValidator = (value, type) => {
    if ((type === 'int' && isNaN(parseInt(value))) || (type === 'float' && isNaN(parseFloat(value))))
        return 'Nombre invalide';
    if (type === 'array' || type === 'object')
        try {
            const o = JSON.parse(value);
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


/**
 * @param mixin {Swal}
 * @param currentStep {number}
 * @param data {{key: string, type: string, secret: Boolean, guild: *, botID: string}}
 * @param API_ROOT {string}
 * @return {Promise<void>}
 */
export async function getDataAndSend(mixin, currentStep, data, API_ROOT) {

    await mixin.fire({
        text: 'Valeur',
        currentProgressStep: currentStep,
        input: inputType(data.type),
        inputOptions: inputOptions(data.type, data.guild),
        inputValidator: v => valueValidator(v, data.type),
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: value => {
            if (value === undefined)
                return;

            if (data.type === 'boolean')
                value = value === 'true';
            if (data.type === 'int')
                value = parseInt(value);
            if (data.type === 'float')
                value = parseFloat(value);
            if (data.type === 'array' || data.type === 'object')
                value = JSON.parse(value);

            return fetch(`${API_ROOT}/data`, {
                method: 'POST',
                body: JSON.stringify({
                    key: data.key,
                    type: data.type,
                    secret: data.secret,
                    guildID: data.guild.guild.id,
                    value,
                    botID: data.botID
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
        }
    })
        .then(async res => {
            if (!res || !res.value)
                return;

            const resData = await res.value.json();
            if (res.value.status !== 200) {
                throw new Error(resData.error);
            }
            // $dataStorage = [...$dataStorage, resData];
            return true;
        })
        .catch(error => {
            Swal.fire({
                title: `Erreur lors de la requête : ${error.message || error}`,
                icon: 'error'
            });
        })
        .then(res => res && Swal.fire({
            title: `Clé ${data.key} ajoutée !`,
            icon: 'success',
        }));
}
