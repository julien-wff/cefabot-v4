import { Command } from './commands';
import uploadFile from './storage/upload-file';
import storageList from './storage/storage-list';


// noinspection JSUnusedGlobalSymbols
const properties: Command = {
    name: 'storage',
    description: 'Gérer l\'espace de stockage privé du bot',
    triggers: [
        'storage',
        'stg',
    ],
    permission: 'MANAGE_GUILD',
    removable: false,
    channel: [ 'admin', 'commands' ],
    paths: [
        {
            help: 'list',
            description: 'Obtenir la liste des fichiers de ce bot',
            args: [
                { argType: 'static', triggers: [ 'list', 'ls' ] },
            ],
            run: storageList,
        },
        {
            help: 'upload <chemin>',
            description: 'Uploader un fichier dans le stockage du bot',
            args: [
                { argType: 'static', triggers: [ 'upload', 'add' ] },
                { argType: 'dynamic', valueName: 'path', displayName: 'chemin', valueType: 'string' },
            ],
            run: uploadFile,
        },
    ],
};


export { properties };
