import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import verifyStoragePath from './verify-storage-path';
import path from 'path';

export default async function uploadFile(req: Request, res: Response) {

    const storagePath = verifyStoragePath(req, res);
    if (!storagePath) return;

    let filePath = req.body.path as string | string[] | undefined;
    if (typeof filePath !== 'string') {
        res.status(400).json({ error: 'Invalid file path (type)' });
        return;
    }
    if (/([<>:;"'\\|?*]|\.{2,}|\/{2,})/.test(filePath)) {
        res.status(400).json({ error: 'Invalid file path (regex)' });
        return;
    }
    filePath = path.join(storagePath, filePath);
    if (!filePath.startsWith(storagePath)) {
        res.status(400).json({ error: 'Invalid file path (path)' });
        return;
    }
    if (filePath.length > 320) {
        res.status(400).json({ error: 'The file path is too long' });
        return;
    }

    try {

        if (!req.files) {
            res.status(400).json({ error: 'Please provide a file' });
            return;
        }

        let file = req.files.file as UploadedFile | undefined;

        if (!file) {
            res.status(400).json({ error: `Please provide the file under the 'file' field` });
            return;
        }

        await file.mv(path.join(filePath, file.name));

        res.send({
            name: file.name,
            mimetype: file.mimetype,
            size: file.size,
        });

    } catch (err) {
        res.status(500).json({ error: err.message || err });
    }
}
