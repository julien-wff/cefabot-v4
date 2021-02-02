import { Message } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import logger from '../logs/logger';
import { Command, PathRun } from './commands';
import getUsers, { ScoreType } from './scoreboard/get-users';
import createScoreboard, { FormattedUser } from '../canvas/create-scoreboard';
import deleteFile from '../canvas/helper/delete-file';


const genAndSendScoreboard = async (message: Message, users: FormattedUser[], bot: BotInstance) => {

    message.channel.startTyping();

    try {
        const imgURI = await createScoreboard(users);

        await message.channel.send({
            files: [ {
                attachment: imgURI,
            } ],
        });

        deleteFile(imgURI);
    } catch (e) {
        logger.bot.error(e, { data: e, botID: bot.config._id, location: 'scoreboard.ts' });
    } finally {
        message.channel.stopTyping();
    }

};


const runWithoutArgs: PathRun = async (message, params, bot) => {
    const users = await getUsers('messages', message, bot);
    await genAndSendScoreboard(message, users, bot);
};


// TODO: fix the command parser to use that
// const runWithCount: PathRun<{ count?: number }> = async (message, params, bot) => {
//     const users = await getUsers('messages', message, bot, params.count);
//     await genAndSendScoreboard(message, users, bot);
// };


const runWithStat: PathRun<{ stat: string, count?: number }> = async (message, params, bot) => {
    let stat: ScoreType | undefined;
    if (params.stat.match(/msg|messages?/))
        stat = 'messages';
    else if (params.stat.match(/cmd|commande?s?/))
        stat = 'commands';
    else if (params.stat === 'xp')
        stat = 'xp';

    if (!stat) {
        await message.channel?.send(`Paramètre \`${stat}\` invalide.`);
        return;
    }

    const users = await getUsers(stat, message, bot, params.count);
    await genAndSendScoreboard(message, users, bot);
};


const properties: Command = {
    name: 'scoreboard',
    description: 'Fait un tableau des scores de ceux qui ont le plus parlé',
    triggers: [ 'scoreboard' ],
    removable: true,
    channel: 'commands',
    rootPath: {
        help: '',
        description: '',
        args: [
            {
                argType: 'dynamic',
                valueType: 'int',
                valueName: 'count',
                displayName: 'nombre',
                optional: true,
            },
        ],
        run: runWithoutArgs,
    },
    paths: [
        // {
        //     help: '<nombre>',
        //     description: 'Inclus un certain nombre de personnes dans le tableau des scores',
        //     args: [
        //         { argType: 'dynamic', valueType: 'int', valueName: 'count', displayName: 'nombre' },
        //     ],
        //     run: runWithCount,
        // },
        {
            help: '<messages|commandes|xp|level> <nombre (optionel)>',
            description: 'Affiche le scoreboard en fonction d\'une certaine stat. Possibilité de spécifier le nombre de membres à inclure.',
            args: [
                { argType: 'dynamic', valueType: 'string', valueName: 'stat', displayName: 'stat' },
                { argType: 'dynamic', valueType: 'int', valueName: 'count', displayName: 'nombre', optional: true },
            ],
            run: runWithStat,
        },
    ],
};


export { properties };
