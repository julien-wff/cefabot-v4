import { Command, PathRun } from './commands';

const ping: PathRun = async (msg) => {

    await msg.channel.send('Pong');

};


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'ping',
    description: 'Qui pour une partie de ping pong ?',
    triggers: [
        'ping',
    ],
    removable: true,
    channel: 'commands',
    rootPath: {
        help: '',
        description: '',
        args: [],
        run: ping,
    },
};


export { properties };
