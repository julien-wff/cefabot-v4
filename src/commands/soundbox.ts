import { Command } from './commands';
import soundsList from './soundbox/sounds-list';
import playSound from './soundbox/play-sound';
import idleConnect from './soundbox/idle-connect';

// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'soundbox',
    description: 'Joue un son dans un salon.',
    triggers: [
        'soundbox',
        'sb',
    ],
    permission: 'SEND_MESSAGES',
    removable: true,
    paths: [
        {
            help: 'list',
            description: 'Obtenir la liste des sons disponibles.',
            args: [
                { argType: 'static', triggers: [ 'list', 'ls' ] },
            ],
            run: soundsList,
        },
        {
            help: 'idle',
            description: 'Se connecte à un salon et y reste.',
            args: [
                { argType: 'static', triggers: [ 'idle', 'connect' ] },
            ],
            run: idleConnect,
        },
        {
            help: 'play `<son>`',
            description: 'Jouer le son spécifier dans le salon vocal de la personne qui effectue la commande.',
            args: [
                { argType: 'static', triggers: [ 'play' ] },
                { argType: 'dynamic', valueName: 'sound', displayName: 'son', valueType: 'string' },
            ],
            run: playSound,
        },
    ],
};


export { properties };
