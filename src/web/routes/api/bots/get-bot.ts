import { Request, Response } from 'express';
import getBotData from '../helper/getBotData';

export default async function getBot(req: Request, res: Response) {

    const result = await getBotData(req, res);
    if (!result) return;
    const { bot } = result;

    res.json({
        id: bot._id,
        name: bot.name,
        clientID: bot.clientID,
        enabled: bot.enabled,
        guildsID: bot.guildsID,
        commands: bot.commands,
        events: bot.events,
        commandStart: bot.commandStart,
        presence: bot.presence,
    });

}
