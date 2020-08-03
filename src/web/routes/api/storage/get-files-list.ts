import { Request, Response } from 'express';
import { getFolderStructure } from '../../../../utils/get-files-recursively';
import verifyStoragePath from './verify-storage-path';

export default function getFilesList(req: Request, res: Response) {

    const filesPath = verifyStoragePath(req, res);

    if (!filesPath) return;

    const filesList = getFolderStructure(filesPath);

    res.json(filesList);

}
