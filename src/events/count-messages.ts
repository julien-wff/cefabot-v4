import UserStatsModel from '../models/UserStatsModel';
import { BotEvent, EventCancel, EventRun } from './events';
import { Message } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import getUser from './helper/get-user';


let botInstance: BotInstance | undefined = undefined;


async function countMessage(msg: Message) {

    if (!msg.guild) return;

    const user = await getUser(botInstance!.config._id, msg.guild.id, msg.author);

    let changingValue = 'messagesCount';
    if (msg.content.startsWith(botInstance!.config.commandStart))
        changingValue = 'commandsCount';

    await UserStatsModel.updateOne(
        { _id: user._id },
        {
            $inc: {
                [changingValue]: 1,
            },
        },
    );

}


const run: EventRun = async bot => {
    botInstance = bot;
    bot.client.on('message', countMessage);
};


const cancel: EventCancel = bot => {
    botInstance = bot;
    bot.client.off('message', countMessage);
};


// noinspection JSUnusedGlobalSymbols
export const properties: BotEvent = {
    name: 'count-messages',
    run,
    cancel,
};
