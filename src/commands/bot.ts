import { Command } from './commands';
import sendMessage from './bot/send-message';
import changeUsername from './bot/change-username';
import changePresence from './bot/change-presence';


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'bot',
    description: 'Gérer les propriétés du bot',
    triggers: [ 'bot' ],
    removable: true,
    permission: [ 'MANAGE_NICKNAMES', 'MANAGE_GUILD' ],
    channel: [ 'admin', 'commands' ],
    paths: [
        {
            help: 'send <message>',
            description: 'Envoyer un message avec le compte du bot dans le salon',
            args: [
                { argType: 'static', triggers: [ 'send', 'msg', 'message' ] },
                { argType: 'dynamic', valueType: 'listUntilEnd', valueName: 'message', displayName: 'message' },
            ],
            run: sendMessage,
        },
        {
            help: 'username <nom>',
            description: 'Changer le nom du bot',
            args: [
                { argType: 'static', triggers: [ 'username', 'name' ] },
                { argType: 'dynamic', valueType: 'listUntilEnd', valueName: 'name', displayName: 'nom' },
            ],
            run: changeUsername,
        },
        {
            help: 'presence',
            description: 'Changer la présence du bot',
            args: [
                { argType: 'static', triggers: [ 'presence', 'pr' ] },
            ],
            flags: [
                {
                    help: '--afk',
                    description: 'Défini si le bot est afk',
                    name: 'afk',
                    triggers: [ '--afk' ],
                    valueType: 'boolean',
                },
                {
                    help: '--status <online|idle|invisible|dnd>',
                    description: 'Défini le status du bot',
                    name: 'status',
                    triggers: [ '--status', '-s' ],
                    valueType: 'string',
                },
                {
                    help: '--activity-name <nom>',
                    description: 'Défini le nom de l\'application',
                    name: 'activityName',
                    triggers: [ '--activity-name', '-an' ],
                    valueType: 'string',
                },
                {
                    help: '--activity-type <PLAYING|STREAMING|LISTENING|WATCHING>',
                    description: 'Défini le type de l\'application',
                    name: 'activityType',
                    triggers: [ '--activity-type', '-at' ],
                    valueType: 'string',
                },
                {
                    help: '--activity-url <url>',
                    description: 'Défini le type de l\'application',
                    name: 'activityUrl',
                    triggers: [ '--activity-url', '-au' ],
                    valueType: 'string',
                },
                {
                    help: '--remove-activity',
                    description: 'Enlève l\'activité en cours',
                    name: 'removeActivity',
                    triggers: [ '--remove-activity', '-ra' ],
                    valueType: 'boolean',
                },
                {
                    help: '--save',
                    description: 'Sauvegarder les changements dans la base de données afin de les restaurer au démarrage du bot',
                    name: 'save',
                    triggers: [ '--save' ],
                    valueType: 'boolean',
                },
            ],
            run: changePresence,
        },
    ],
};


export { properties };
