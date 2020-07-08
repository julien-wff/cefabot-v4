import UserStatsModel from '../models/UserStatsModel';
import { BotEvent, EventCancel, EventRun } from './events';
import { Message, VoiceChannel } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import getUser from './helper/get-user';


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


async function onMessage(message: Message) {

    if (!message.guild) return;

    const user = await getUser(botInstance.config._id, message.guild.id, message.author);

    // If there is some attachements
    if (message.attachments.size > 0) {
        await UserStatsModel.updateOne(
            { _id: user._id },
            {
                $inc: {
                    'xp.count': ATTACHEMENT_XP * message.attachments.size,
                },
            },
        );
        return;
    }

    // If there is no attachements
    const delaySinceLastMsg = Date.now() - user.xp.lastXPMessage.getTime();
    const xpGain = MESSAGE_XP.find(d => delaySinceLastMsg > d[0] && delaySinceLastMsg <= d[1]);

    if (!xpGain)
        return;

    await UserStatsModel.updateOne(
        { _id: user._id },
        {
            'xp.lastXPMessage': new Date(),
            $inc: {
                'xp.count': xpGain[2],
            },
        },
    );

}


async function onInterval() {
    botInstance.client.guilds.cache.forEach(guild => {

        // Give 1XP to all the connected members
        guild.members.cache.forEach(async member => {
            if (member.presence.status !== 'offline')
                await UserStatsModel.updateOne(
                    {
                        botID: botInstance.config._id,
                        guildID: guild.id,
                        userID: member.id,
                    },
                    {
                        $inc: {
                            'xp.count': ONLINE_XP,
                        },
                    },
                );
        });

        // Give 5XP to all members in a vocal channel
        guild.channels.cache.forEach(channel => {
            if (channel.type === 'voice') {
                (channel as VoiceChannel).members.forEach(async member => {
                    await UserStatsModel.updateOne(
                        {
                            botID: botInstance.config._id,
                            guildID: guild.id,
                            userID: member.id,
                        },
                        {
                            $inc: {
                                'xp.count': VOICE_XP,
                            },
                        },
                    );
                });
            }
        });
    });
}


const run: EventRun = async bot => {
    botInstance = bot;
    bot.client.on('message', onMessage);
    intervalID = bot.client.setInterval(onInterval, 5 * 60 * 1000);
};


const cancel: EventCancel = bot => {
    botInstance = bot;
    bot.client.off('message', onMessage);
    bot.client.clearInterval(intervalID);
};


// noinspection JSUnusedGlobalSymbols
export const properties: BotEvent = {
    name: 'xp',
    run,
    cancel,
};
