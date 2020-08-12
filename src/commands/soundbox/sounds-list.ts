import { PathRun } from '../commands';
import fs from 'fs';
import path from 'path';

const soundsList: PathRun = message => {
    const sounds = fs
        .readdirSync(path.resolve(process.env.STORAGE_PATH!, 'soundbox'))
        .filter(file => [ 'mp3', 'ogg', 'wav' ].includes(file.slice(file.lastIndexOf('.') + 1)));
    message.channel.send(`Sons disponibles : \`${sounds.join('`, `')}\``);
};

export default soundsList;
