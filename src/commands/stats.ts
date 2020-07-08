import { Command, PathRun } from './commands';
import deleteFile from '../canvas/helper/delete-file';
import genUserStats from './stats/gen-user-stats';
import genServerStats from './stats/gen-server-stats';

const run: PathRun<{ member: string }> = async (message, params, bot) => {

    message.channel.startTyping();

    let imgURI: string;
    if (params.member.match(/^ *serveu?r *$/i)) {

        imgURI = await genServerStats(message, bot);

    } else {

        const userStatsURI = await genUserStats(message, params.member, bot);
        if (!userStatsURI)
            return message.reply(`impossible de trouver ${params.member}. Essayez de le mentionner avec @.`);
        else
            imgURI = userStatsURI;

    }


    await message.channel.send({
        files: [ {
            attachment: imgURI,
        } ],
    });

    deleteFile(imgURI);

    return message.channel.stopTyping();

};

const properties: Command = {
    name: 'stats',
    description: 'Permet d\'obtenir des statistiques sur un utilisateur du serveur',
    triggers: [ 'stats' ],
    removable: true,
    channel: 'commands',
    paths: [
        {
            help: '<@membre | serveur>',
            description: '',
            args: [
                { argType: 'dynamic', valueType: 'string', valueName: 'member', displayName: 'membre' },
            ],
            run,
        },
    ],
};


export { properties };
