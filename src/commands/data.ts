import { Command } from './commands';
import displayDataList from './data/display-data-list';
import addData from './data/add-data';
import removeData from './data/remove-data';


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'data',
    description: 'Gérer certaines données stockées dans la base de données',
    triggers: [
        'data',
        'storage',
    ],
    removable: false,
    permission: 'ADMINISTRATOR',
    channel: [ 'admin', 'commands' ],
    paths: [
        {
            help: 'list',
            description: 'Obtenir la liste des données stockées',
            args: [
                { argType: 'static', triggers: [ 'list', 'ls' ] },
            ],
            run: displayDataList,
        },
        {
            help: 'add <string | boolean | int | float | array | object | discord-role | discord-user | discord-channel> <clé> <valeur>',
            description: 'Ajouter une donnée dans la base',
            args: [
                { argType: 'static', triggers: [ 'add' ] },
                { argType: 'dynamic', valueType: 'string', displayName: 'type', valueName: 'type' },
                { argType: 'dynamic', valueType: 'string', displayName: 'clé', valueName: 'key' },
                { argType: 'dynamic', valueType: 'listUntilEnd', displayName: 'valeur', valueName: 'value' },
            ],
            flags: [
                {
                    help: '--secret',
                    description: 'Permet de dire qu\'une donnée stockée est sensible',
                    triggers: [ '--secret' ],
                    valueType: 'boolean',
                    name: 'secret',
                },
            ],
            run: addData,
        },
        {
            help: 'remove <clé>',
            description: 'Supprime un élément par sa clé',
            args: [
                { argType: 'static', triggers: [ 'remove', 'delete' ] },
                { argType: 'dynamic', valueType: 'string', displayName: 'clé', valueName: 'key' },
            ],
            run: removeData,
        },
    ],
};


export { properties };
