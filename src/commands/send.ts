import { Command, PathRun } from './commands';

const sendMessage: PathRun<{ message: string[] }> = async (message, params) => {
    await message.delete();
    await message.channel.send(params.message.join(' '));
};

export const properties: Command = {
    name: 'send',
    triggers: [
        'send',
        'message',
        'envoyer',
    ],
    removable: true,
    description: 'Envoyer un message avec le compte du bot',
    permission: 'MANAGE_MESSAGES',
    rootPath: {
        help: '<message>',
        description: 'Envoyer un message',
        args: [
            { argType: 'dynamic', displayName: 'message', valueName: 'message', valueType: 'listUntilEnd' },
        ],
        run: sendMessage,
    },
};