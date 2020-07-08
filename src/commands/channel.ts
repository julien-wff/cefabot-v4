import { Command } from './commands';
import getChannelsList from './channels/get-channels-list';
import addChannel from './channels/add-channel';

// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'channel',
    description: 'Sert à gérer le stockage des salons d\'un serveur',
    triggers: [
        'channel',
    ],
    removable: false,
    permission: 'ADMINISTRATOR',
    channel: [ 'commands', 'admin' ],
    paths: [
        {
            help: 'ls',
            description: 'Obtenir la liste des salons enregistrés',
            args: [
                { argType: 'static', triggers: [ 'ls', 'list' ] },
            ],
            run: getChannelsList,
        },
        {
            help: 'add <nom> <salon>',
            description: 'Ajouter un salon à la liste. Le salon doit être tag.',
            args: [
                { argType: 'static', triggers: [ 'add' ] },
                { argType: 'dynamic', valueName: 'name', displayName: 'nom', valueType: 'string' },
                { argType: 'dynamic', valueName: 'channel', displayName: 'salon', valueType: 'string' },
            ],
            run: addChannel,
        },
    ],
};

export { properties };
