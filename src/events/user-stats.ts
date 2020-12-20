import { GuildMember, Message, PartialGuildMember } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import { countMessage } from './user-stats/count-message';
import { BotEvent, EventCancel, EventRun } from './events';
import verifyUsers from './helper/verify-users';
import { passiveXP } from './user-stats/passive-xp';
import { userJoin } from './user-stats/user-join';
import { userQuit } from './user-stats/user-quit';


let botInstance: BotInstance;
let intervalID: NodeJS.Timer;


const countMessageHandler = (msg: Message) => countMessage(msg, botInstance);
const userJoinHandler = (member: GuildMember | PartialGuildMember) => userJoin(member, botInstance);
const userQuitHandler = (member: GuildMember | PartialGuildMember) => userQuit(member, botInstance);


const run: EventRun = async bot => {
    botInstance = bot;
    await verifyUsers(bot);
    bot.client.on('message', countMessageHandler);
    bot.client.on('guildMemberAdd', userJoinHandler);
    bot.client.on('guildMemberRemove', userQuitHandler);
    intervalID = bot.client.setInterval(() => passiveXP(botInstance), 10 * 60 * 1000);
};


const cancel: EventCancel = bot => {
    botInstance = bot;
    bot.client.off('message', countMessageHandler);
    bot.client.off('guildMemberAdd', userJoinHandler);
    bot.client.off('guildMemberRemove', userQuitHandler);
    bot.client.clearInterval(intervalID);
};


// noinspection JSUnusedGlobalSymbols
export const properties: BotEvent = {
    name: 'user-stats',
    run,
    cancel,
};
