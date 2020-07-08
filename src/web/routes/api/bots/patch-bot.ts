import { Request, Response } from 'express';
import BotModel from '../../../../models/BotModel';
import { Bot, CorePacket } from '../../../../bot/botTypes';
import { ChildProcess } from 'child_process';
import equal from 'deep-equal';
import getBotData from '../helper/getBotData';
import getAvailableCommands from '../../../../commands/command/get-available-commands';
import { handleBotManagerCrash } from '../../../../app';
import getAvailableEvents from '../../../../commands/event/get-available-events';

export default async function patchBot(req: Request, res: Response) {

    // Verify getMultipleData
    const result = await getBotData(req, res);
    if (!result) return;
    const { body, bot } = result;

    // Initialise getMultipleData
    let newData: Partial<Bot> = {};
    let error: string | null = null;
    let actions = {
        changeBotStatus: false,
        updateCommands: false,
        updateEvents: false,
    };


    // Process getMultipleData
    if (typeof body.enabled === 'boolean' && bot.enabled !== body.enabled) {
        actions.changeBotStatus = true;
        newData.enabled = body.enabled;
    }

    if (typeof body.name === 'string' && body.name !== bot.name) {
        const actualBotWithName = await BotModel.findOne({ name: body.name });
        if (actualBotWithName) {
            error = `Impossible de renommer ${bot.name} en ${body.name}, ce nom est déjà pris`;
        } else {
            newData.name = body.name;
        }
    }

    if (Array.isArray(body.commands) && !equal(body.commands.sort(), bot.commands.sort())) {
        const availableCommands = getAvailableCommands();
        newData.commands = body.commands.filter(cmd => availableCommands.find(cmd2 => cmd2.name === cmd));
        actions.updateCommands = true;
    }

    if (Array.isArray(body.events) && !equal(body.events.sort(), bot.events.sort())) {
        const availableEvents = getAvailableEvents();
        newData.events = body.events.filter(evt => availableEvents.find(evt2 => evt2.name === evt));
        actions.updateEvents = true;
    }

    await bot.updateOne({ $set: newData });

    const newBot = await BotModel.findById(bot._id) as Bot;


    // Send responses
    if (error) {
        res.status(400).json({ error });
    } else {
        res.json({
            id: newBot._id,
            name: newBot.name,
            enabled: newBot.enabled,
            commands: newBot.commands,
            events: newBot.events,
            commandStart: newBot.commandStart,
            presence: newBot.presence,
        });
    }


    // Make actions

    const { botsProcess, startBot } = require('../../../../app');
    const botProcess = botsProcess[bot._id] as ChildProcess;

    if (actions.changeBotStatus) {
        if (newBot.enabled) {
            startBot(bot)
                .catch((err: any) => handleBotManagerCrash(bot, err));
        } else {
            botProcess.send({ type: 'shutdown' } as CorePacket);
        }
    }

    if (actions.updateCommands) {
        botProcess?.send({ type: 'reload-commands' } as CorePacket);
    }

    if (actions.updateEvents) {
        botProcess?.send({ type: 'reload-events' } as CorePacket);
    }

}
