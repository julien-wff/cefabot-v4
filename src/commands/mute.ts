import { Command, PathRun } from './commands';
import moment from 'moment';
import { GuildMember } from 'discord.js';
import { extractUserIDFromTag } from '../utils/extract-guild-data-from-tag';
import addTask from '../schedule/add-task';

moment.locale('FR');

interface MuteParams {
    person: string,
    duration: number,
    'mute-role': string;
    reason?: string[],
}

const mute: PathRun<MuteParams> = async (msg, params, bot) => {

    console.log(params);
    const muteUserID = extractUserIDFromTag(msg, params.person);
    if (!muteUserID)
        if (params.person.match(/<@&\d{18}>/))
            return msg.reply(`impossible de mute un bot`);
        else
            return msg.reply(`"${params.person}" n'est pas un utilisateur valide. Essayez de le mentionner avec @.`);

    let muteUser: GuildMember;
    try {
        muteUser = await msg.guild!.members.fetch(muteUserID);
    } catch (e) {
        return msg.reply(`impossible de trouver l'utilisateur ${params.person}`);
    }

    if (muteUser.roles.cache.get(params['mute-role']))
        return msg.reply(`${muteUser.displayName} est déjà muté`);

    await muteUser.roles.add(params['mute-role']);

    await addTask(bot, params.duration, {
        type: 'REMOVE_ROLE',
        guildID: msg.guild!.id,
        userID: muteUser.id,
        roleID: params['mute-role'],
    });

    return msg.channel.send(
        `${params.person} a été mute par <@${msg.author.id}> pendant ${moment.duration(params.duration).humanize()}`
        + (params.reason
        ? ` pour la raison : ${params.reason.join(' ')}.`
        : '.'),
    );

};


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'mute',
    description: 'Permet de rendre temporairement muet une personne',
    triggers: [ 'mute' ],
    removable: true,
    permission: 'MUTE_MEMBERS',
    requiredDataKey: [
        { key: 'mute-role', type: 'discord-role' },
    ],
    paths: [
        {
            help: '<@personne> <durée> <raison (optionnel)>',
            description: 'Mute la personne mentionnée',
            args: [
                { argType: 'dynamic', displayName: 'personne', valueName: 'person', valueType: 'string' },
                {
                    argType: 'dynamic',
                    displayName: 'durée',
                    valueName: 'duration',
                    valueType: 'duration',
                    forTimer: true,
                },
                {
                    argType: 'dynamic',
                    displayName: 'raison',
                    valueName: 'reason',
                    valueType: 'listUntilEnd',
                    optional: true,
                },
            ],
            run: mute,
        },
    ],
};


export { properties };
