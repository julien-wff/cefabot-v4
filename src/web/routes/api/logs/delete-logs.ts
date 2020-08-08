import { Request, Response } from 'express';
import { Types, isValidObjectId } from 'mongoose';
import LogModel from '../../../../models/LogModel';

export default async function deleteLogs(req: Request, res: Response) {

    if (!Array.isArray(req.body)) {
        res.status(400).json({ error: 'Invalid request. Must be an array of IDs.' });
        return;
    }

    const IDs = req.body
        .filter(id => isValidObjectId(id))
        .map(id => Types.ObjectId(id));

    await LogModel.deleteMany({ _id: { $in: IDs } });

    res.sendStatus(200);

}
