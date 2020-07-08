import path from 'path';

export default function setEnvVars() {

    // Determining the file extensions
    const ext = __filename.slice(-2);
    if (!ext.match(/^[tj]s$/))
        throw new Error(`The file extension ".${ext}" is invalid.`);
    process.env.FILES_EXT = ext;

    // Determining the folder relative to the project root
    const folder = __dirname.split(path.sep).slice(-2)[0];
    if (folder !== 'src' && folder !== 'dist')
        throw new Error(`The folder "${folder}" is invalid.`);
    process.env.FILES_FOLDER = folder;

    console.log(`Starting bots with file extension ".${process.env.FILES_EXT}" and folder "${process.env.FILES_FOLDER}".`);

}
