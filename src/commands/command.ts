import { Command } from './commands';
import sendAvailableCommands from './command/send-available-commands';
import toggleCommandList from './command/toggle-command-list';


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'command',
    description: 'Gérer les commandes',
    triggers: [
        'command',
        'cmd',
    ],
    permission: 'ADMINISTRATOR',
    removable: false,
    channel: [ 'admin', 'commands' ],
    paths: [
        {
            help: 'list',
            description: 'Renvoie la liste des commandes activées ou non',
            args: [
                { argType: 'static', triggers: [ 'list', 'liste', 'ls' ] },
            ],
            run: sendAvailableCommands,
        },
        {
            help: 'toggle <commande 1> <commande 2> <commande *N*>',
            description: 'Interchange l\'état d\'une ou plusieurs commandes',
            args: [
                { argType: 'static', triggers: [ 'toggle', 'tg' ] },
                { argType: 'dynamic', valueType: 'listUntilEnd', valueName: 'commands', displayName: 'commands' },
            ],
            run: toggleCommandList,
        },
    ],
};


export { properties };
