import { CommandFlag, Command } from './commands';
import clearByCount from './clear/clear-by-count';
import clearAll from './clear/clear-all';
import clearByDuration from './clear/clear-by-duration';


const reportFlag: CommandFlag = {
    help: '--report',
    name: 'report',
    description: 'Affiche en temps réel la progression de la suppression, mais la ralentit.',
    valueType: 'boolean',
    triggers: [ '--report', '-r' ],
};


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'clear',
    description: 'Supprime les x derniers messages dans un salon.',
    triggers: [
        'clear',
        'cls',
        'cl',
    ],
    removable: true,
    permission: 'MANAGE_MESSAGES',
    paths: [
        {
            help: 'last <nombre>',
            description: 'Supprime les x derniers messages.',
            args: [
                { argType: 'static', triggers: [ 'last', 'derniers', 'l' ] },
                { argType: 'dynamic', valueType: 'int', valueName: 'count', displayName: 'nombre' },
            ],
            flags: [ reportFlag ],
            run: clearByCount,
        },
        {
            help: 'all',
            description: 'Supprime tous les messages du salon.',
            args: [
                { argType: 'static', triggers: [ 'all', 'a', 'everything', 'tout' ] },
            ],
            flags: [ reportFlag ],
            run: clearAll,
        },
        {
            help: 'since <durée>',
            description: 'Supprime tous les messages depuis une certaine durée.',
            args: [
                { argType: 'static', triggers: [ 'since', 's', 'depuis' ] },
                { argType: 'dynamic', valueType: 'duration', valueName: 'duration', displayName: 'durée' },
            ],
            flags: [ reportFlag ],
            run: clearByDuration,
        },
    ],
};

export { properties };
