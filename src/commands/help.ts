import { Command } from './commands';
import allCommands from './help/all-commands';
import uniqueCommand from './help/unique-command';


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'help',
    description: 'Obtenir des informations sur les différentes commandes.',
    rootPath: {
        help: '',
        description: '',
        args: [],
        run: allCommands,
    },
    triggers: [
        'help',
        'h',
    ],
    removable: false,
    channel: 'commands',
    paths: [
        {
            help: '<command>',
            description: 'Obtenir des informations détaillées sur une commande en particulier',
            args: [
                { argType: 'dynamic', valueType: 'string', valueName: 'command', displayName: 'commande' },
            ],
            run: uniqueCommand,
        },
    ],
};


export { properties };
