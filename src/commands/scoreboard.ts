import { Command, PathRun } from './commands';
import UserStatsModel from '../models/UserStatsModel';
import createScoreboard from '../canvas/create-scoreboard';
import deleteFile from '../canvas/helper/delete-file';

const run: PathRun<{ count?: number }> = async (message, params, bot) => {

    message.channel.startTyping();
    const count = params.count && params.count > 1 ? params.count : 5;

    const users = await UserStatsModel
        .find({
            botID: bot.config._id,
            guildID: message.guild!.id,
            onServer: true,
        })
        .sort({ messagesCount: 'desc' })
        .limit(count);

    const imgURI = await createScoreboard(users, message.guild!);

    await message.channel.send({
        files: [ {
            attachment: imgURI,
        } ],
    });

    deleteFile(imgURI);

    await message.channel.stopTyping();

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
