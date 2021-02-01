import logger from '../logs/logger';
import { Command, PathRun } from './commands';
import getUsers from './scoreboard/get-users';
import createScoreboard from '../canvas/create-scoreboard';
import deleteFile from '../canvas/helper/delete-file';

const run: PathRun<{ count?: number }> = async (message, params, bot) => {

    message.channel.startTyping();

    try {
        const users = await getUsers('messages', message, bot, params.count);
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

const properties: Command = {
    name: 'scoreboard',
    description: 'Fait un tableau des scores de ceux qui ont le plus parlé',
    triggers: [ 'scoreboard' ],
    removable: true,
    channel: 'commands',
    rootPath: {
        help: '<compte (optionnel)>',
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
        run,
    },
    paths: [
        {
            help: '<nombre>',
            description: 'Inclus un certain nombre de personnes dans le tableau des scores',
            args: [
                { argType: 'dynamic', valueType: 'int', valueName: 'count', displayName: 'nombre' },
            ],
            run,
        },
    ],
};


export { properties };
