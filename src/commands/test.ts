import { Command, PathRun } from './commands';

const test: PathRun<Test> = async (message, _params, _bot) => {

    console.log('Hello world!');

};

interface Test {
}


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'test',
    description: 'Qui pour une partie de TESTS INTENSIFS ?',
    triggers: [
        'test',
        't',
    ],
    requiredDataKey: [
        { type: 'string', key: 'wsh' },
        { type: 'string', key: 'lol' },
    ],
    rootPath: {
        help: '',
        description: '',
        args: [],
        run: test,
    },
    removable: true,
};


export { properties };
