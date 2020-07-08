import { Request, Response } from 'express';
import BotModel from '../../../models/BotModel';

export default async function bots(_: Request, res: Response) {

    const bots = await BotModel.find();

    const response = bots.map(b => ({
        id: b._id,
        name: b.name,
        enabled: b.enabled,
        guildsID: b.guildsID,
        commands: b.commands,
        events: b.events,
        commandStart: b.commandStart,
        presence: b.presence,
    }));

    res.json(response);

}
