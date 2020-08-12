import fs from 'fs';
import path from 'path';

export default function setupStorage(botID: string) {
    const storagePath = path.resolve(process.env.STORATE_PATH!, botID);
    if (!fs.existsSync(storagePath))
        fs.mkdirSync(storagePath);
    process.env.STORATE_PATH = storagePath;
}
