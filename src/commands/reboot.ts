import { Command, PathRun } from './commands';
import { BotPacket } from '../bot/botTypes';
import addTask from '../schedule/add-task';

const reboot: PathRun = async (message, params, bot) => {

    await message.delete();
    const rebootMsg = await message.channel.send('*:red_circle: Redémarrage en cours...*');
    await addTask(bot, '3s', {
        type: 'REBOOT_PACKET',
        guildID: message.guild!.id,
        channelID: message.channel.id,
        messageID: rebootMsg.id,
    });
    process.send?.({ type: 'reboot' } as BotPacket);

};


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'reboot',
    description: 'Redémarre le bot',
    permission: 'ADMINISTRATOR',
    rootPath: {
        help: '',
        description: '',
        args: [],
        run: reboot,
    },
    triggers: [
        'reboot',
        'restart',
    ],
    removable: false,
    channel: [ 'admin', 'commands' ],
};


export { properties };
