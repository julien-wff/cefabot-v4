import { Message } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import { countMessage } from './user-stats/count-message';
import { BotEvent, EventCancel, EventRun } from './events';
import verifyUsers from './helper/verify-users';
import { passiveXP } from './user-stats/passive-xp';


let botInstance: BotInstance;
let intervalID: NodeJS.Timer;


const countMessageHandler = (msg: Message) => countMessage(msg, botInstance);


const run: EventRun = async bot => {
    botInstance = bot;
    await verifyUsers(bot);
    bot.client.on('message', countMessageHandler);
    intervalID = bot.client.setInterval(() => passiveXP(botInstance), 10 * 60 * 1000);
};


const cancel: EventCancel = bot => {
    botInstance = bot;
    bot.client.off('message', countMessageHandler);
    bot.client.clearInterval(intervalID);
};


// noinspection JSUnusedGlobalSymbols
export const properties: BotEvent = {
    name: 'user-stats',
    run,
    cancel,
};
