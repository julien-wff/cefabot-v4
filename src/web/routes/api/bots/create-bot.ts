import { Request, Response } from 'express';
import { Bot } from '../../../../bot/botTypes';
import { isBotName, isClientID, isClientToken } from '../helper/isID';
import BotModel from '../../../../models/BotModel';
import getAvailableCommands from '../../../../commands/command/get-available-commands';

export default async function createBot(req: Request, res: Response) {

    const { body } = req;

    if (!body || typeof body !== 'object') {
        res.status(400).json({ error: 'Please provide a json object' });
        return;
    }

    const botData: Partial<Bot> = {};

    if (!body.token || typeof body.token !== 'string' || !isClientToken(body.token)) {
        res.status(400).json({ error: 'Invalid token' });
        return;
    }
    botData.token = body.token;

    if (await BotModel.findOne({ token: botData.token })) {
        res.status(400).json({ error: 'A bot already exists with this token' });
        return;
    }

    if (!body.clientID || typeof body.clientID !== 'string' || !isClientID(body.clientID)) {
        res.status(400).json({ error: 'Invalid client ID' });
        return;
    }
    botData.clientID = body.clientID;

    if (await BotModel.findOne({ clientID: botData.clientID })) {
        res.status(400).json({ error: 'A bot already exists with this client ID' });
        return;
    }

    if (!body.name || typeof body.name !== 'string' || !isBotName(body.name)) {
        res.status(400).json({ error: 'Invalid bot name' });
        return;
    }
    botData.name = body.name;

    if (await BotModel.findOne({ name: botData.name })) {
        res.status(400).json({ error: 'A bot already exists with this name' });
        return;
    }

    //TODO : check other bots with the same data

    if (!body.commandStart || typeof body.commandStart !== 'string' || !body.commandStart.match(/^.{1,10}$/)) {
        res.status(400).json({ error: 'Invalid command start' });
        return;
    }
    botData.commandStart = body.commandStart;

    botData.commands = getAvailableCommands().filter(c => !c.removable).map(c => c.name);

    const createdBot = new BotModel(botData);
    await createdBot.save();

    res.json({ id: createdBot._id });

}
