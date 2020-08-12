import path from 'path';
import fs from 'fs';

export default function setEnvVars() {

    // Determining the file extensions
    const ext = __filename.slice(-2);
    if (!ext.match(/^[tj]s$/))
        throw new Error(`The file extension ".${ext}" is invalid.`);
    process.env.FILES_EXT = ext;

    // Determining the folder relative to the project root
    const folder = __dirname.split(path.sep).slice(-2)[0];
    if (folder !== 'src' && folder !== 'lib')
        throw new Error(`The folder "${folder}" is invalid.`);
    process.env.FILES_FOLDER = folder;

    // Setting the storage path
    const storagePath = path.resolve(process.env.STORAGE_PATH || './storage');
    if (!fs.existsSync(storagePath))
        fs.mkdirSync(storagePath, { recursive: true });
    process.env.STORAGE_PATH = storagePath;

}
