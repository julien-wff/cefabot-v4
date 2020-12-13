import sqlite from 'sqlite3';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { formatSQLError, sqlAll } from '../helper/SQLUtils';


export default async function convertSQL(req: Request, res: Response) {

    if (!req.files || !req.files.file) {
        res.status(400).json({ error: 'Please provide the DB file' });
        return;
    }

    const file = req.files.file as UploadedFile;

    const filename = `${uuid()}.${file.name.split(/\./g).pop()}`;
    const filePath = path.resolve(__dirname, `../../../../../tmp/${filename}`);

    await file.mv(filePath);

    const db = new sqlite.Database(filePath);

    let tables: string[];
    try {
        tables = await sqlAll(db, 'SELECT name FROM sqlite_master WHERE type =\'table\' AND name NOT LIKE \'sqlite_%\';')
            .then((t: { name: string }[]) => t.map(r => r.name));
    } catch (e: unknown) {
        res.status(500).send({ error: formatSQLError(e) });
        return;
    }

    let result: any[][];
    try {
        result = await Promise.all(
            tables.map(t => sqlAll(db, `SELECT * FROM \`${t}\``)),
        );
    } catch (e: unknown) {
        res.status(500).send({ error: formatSQLError(e) });
        return;
    }
    const stats = result.reduce((prev, cur, ind) => ({ ...prev, [tables[ind]]: result[ind] }), {});

    db.close(() => {
        fs.unlinkSync(filePath);
    });

    res.send(stats);
}
