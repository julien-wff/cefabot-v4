import fs from 'fs';
import axios from 'axios';

export default async function downloadFile(url: string, path: string): Promise<void> {
    const writer = fs.createWriteStream(path);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}
