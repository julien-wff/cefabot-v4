import { Request, Response } from 'express';
import BotModel from '../../../../models/BotModel';
import { Bot } from '../../../../bot/botTypes';
import { isMongooseID } from './isID';

export default async function getBotData(req: Request, res: Response, reqBody = true) {

    const id = req.params?.id;
    if (!id) {
        res.status(400).json({ error: 'Please supply an ID' });
        return false;
    }

    if (!isMongooseID(id)) {
        res.status(400).json({ error: 'Invalid ID' });
        return false;
    }

    const bot = await BotModel.findById(id);
    if (!bot) {
        res.status(404).json({ error: `Unable to find a bot with the ID "${id}"` });
        return false;
    }

    const body = req.body as Partial<Bot>;

    if (reqBody && typeof body !== 'object') {
        res.status(404).json({ error: 'Invalid or missing body' });
        return false;
    }

    return { bot, body };

}
