import { isMongooseID } from '../helper/isID';
import path from "path";
import fs from "fs";
import { Request, Response } from 'express';

export default function verifyStoragePath(req: Request, res: Response): string | null {
    if (typeof req.params?.botID !== 'string') {
        res.status(400).json({ error: 'Please provide the botID in the params' });
        return null;
    }

    const { botID } = req.params;

    if (!isMongooseID(botID)) {
        res.status(400).json({ error: `"${botID}" is not a valid bot ID` });
        return null;
    }

    const filesPath = path.resolve(process.env.STORAGE_PATH!, botID);

    if (!fs.existsSync(filesPath)) {
        res.status(400).json({ error: `Unable to find files for bot ${botID}` });
        return null;
    }

    return filesPath;
}
