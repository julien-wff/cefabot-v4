import { Command } from './commands';
import sendEventsList from './event/send-events-list';
import toggleEventList from './event/toggle-event-list';


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'event',
    description: 'Gérer les évènements',
    triggers: [
        'event',
        'evt',
    ],
    permission: 'ADMINISTRATOR',
    removable: false,
    channel: [ 'admin', 'commands' ],
    paths: [
        {
            help: 'list',
            description: 'Renvoie la liste des évènements activées ou non',
            args: [
                { argType: 'static', triggers: [ 'list', 'liste', 'ls' ] },
            ],
            run: sendEventsList,
        },
        {
            help: 'toggle <commande 1> <commande 2> <commande *N*>',
            description: 'Interchange l\'état d\'un ou plusieurs évènements',
            args: [
                { argType: 'static', triggers: [ 'toggle', 'tg' ] },
                { argType: 'dynamic', valueType: 'listUntilEnd', valueName: 'events', displayName: 'events' },
            ],
            run: toggleEventList,
        },
    ],
};


export { properties };
