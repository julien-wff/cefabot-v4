import { PathRun } from '../commands';
import path from 'path';
import fs from 'fs';
import downloadFile from '../../utils/download-file';


const uploadFile: PathRun<{ path: string }> = async (message, params) => {
    // Path verifications
    if (/([<>:;"'\\|?*]|\.{2,}|\/{2,})/.test(params.path)) {
        await message.channel.send('Erreur : chemin spécifié invalide.');
        return;
    }
    const filePath = path.resolve(process.env.STORAGE_PATH!, params.path);
    if (!filePath.startsWith(process.env.STORAGE_PATH!)) {
        await message.channel.send('Erreur : chemin obtenu invalide.');
        return;
    }
    if (filePath.length > 320) {
        await message.channel.send('Erreur : chemin obtenu trop long.');
        return;
    }

    const pathData = path.parse(filePath);

    if (!fs.existsSync(pathData.dir))
        fs.mkdirSync(pathData.dir);

    // File verifications
    const files = message.attachments.array();
    if (files.length !== 1) {
        if (files.length === 0)
            await message.channel.send('Erreur : veuillez upload un fichier en effectuant cette commande.');
        else
            await message.channel.send('Erreur : veuillez n\'upload qu\'un seul fichier.');
        return;
    }
    const file = files[0];

    // File download
    try {
        await downloadFile(file.url, filePath);
    } catch (e) {
        await message.channel.send(`Erreur lors de l'écriture du fichier : ${e.message}`);
        return;
    }

    await message.channel.send(`Fichier ${pathData.base} sauvegardé.`);
};

export default uploadFile;
