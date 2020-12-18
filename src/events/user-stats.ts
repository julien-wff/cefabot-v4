import logger from '../logs/logger';
import UserStatsModel from '../models/UserStatsModel';
import { BotEvent, EventCancel, EventRun } from './events';
import { Message, VoiceChannel } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import getUser from './helper/get-user';
import verifyUsers from './helper/verify-users';


let botInstance: BotInstance;
let intervalID: NodeJS.Timer;


const MESSAGE_XP: [ number, number, number ][] = [
    [ 30 * 1000, 60 * 1000, 1 ],                            // 30s - 1min
    [ 60 * 1000, 5 * 60 * 1000, 2 ],                        // 1min - 5min
    [ 5 * 60 * 1000, 15 * 60 * 1000, 3 ],                   // 5min - 15min
    [ 15 * 60 * 1000, 60 * 60 * 1000, 4 ],                  // 15min - 1h
    [ 60 * 60 * 1000, 12 * 60 * 60 * 1000, 5 ],             // 1h - 12h
    [ 12 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 8 ],        // 12h - 1d
    [ 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000, 15 ],  // 1d - 30d
    [ 30 * 24 * 60 * 60 * 1000, Infinity, 25 ],             // More than 30d
];
const ATTACHEMENT_XP = 10;
const ONLINE_XP = 1;
const VOICE_XP = 5;


async function countMessage(msg: Message) {

    if (!msg.guild) return;

    const user = await getUser(botInstance!.config._id, msg.guild.id, msg.author);

    let messageType = 'messagesCount';
    if (msg.content.startsWith(botInstance!.config.commandStart))
        messageType = 'commandsCount';

    let xpGain: number, gainViaAttachment = false;
    if (msg.attachments.size > 0) {
        xpGain = ATTACHEMENT_XP * msg.attachments.size;
        gainViaAttachment = true;
    } else {
        const delaySinceLastMsg = Date.now() - user.xp.lastXPMessage.getTime();
        xpGain = (MESSAGE_XP.find(d =>
            delaySinceLastMsg > d[0] && delaySinceLastMsg <= d[1],
        ) || [ 0, 0, 0 ])[2];
    }

    await UserStatsModel.updateOne(
        { _id: user._id },
        {
            $inc: {
                [messageType]: 1,
                'xp.count': xpGain,
            },
            ...(!gainViaAttachment && xpGain > 0
                    ? { 'xp.lastXPMessage': new Date() }
                    : {}
            ),
        },
    );

}


const passiveXP = () => botInstance.client.guilds.cache.forEach(async guild => {

    const members = await guild.members.fetch({ withPresences: true, force: true })
        .catch(err => logger.bot.error(err, {
            botID: botInstance.config._id,
            data: err,
            location: 'user-stats.ts',
        }));
    if (!members || members.size === 0)
        return;

    await Promise.all(members.map(async member => {
        let memberNewXP = 0;

        // Give 1XP to all the connected members
        if (member.presence.status !== 'offline')
            memberNewXP += ONLINE_XP;

        // Give 5XP to all members in a vocal channel
        if (member.voice.channelID)
            memberNewXP += VOICE_XP;

        if (memberNewXP > 0)
            //TODO: bulk update
            await UserStatsModel.updateOne(
                {
                    botID: botInstance.config._id,
                    guildID: guild.id,
                    userID: member.id,
                },
                {
                    $inc: {
                        'xp.count': memberNewXP,
                    },
                },
            );
    }));

});


const run: EventRun = async bot => {
    botInstance = bot;
    await verifyUsers(bot);
    bot.client.on('message', countMessage);
    intervalID = bot.client.setInterval(passiveXP, 10 * 60 * 1000);
};


const cancel: EventCancel = bot => {
    botInstance = bot;
    bot.client.off('message', countMessage);
    bot.client.clearInterval(intervalID);
};


// noinspection JSUnusedGlobalSymbols
export const properties: BotEvent = {
    name: 'user-stats',
    run,
    cancel,
};
