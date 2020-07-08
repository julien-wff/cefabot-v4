import UserStatsModel from '../models/UserStatsModel';
import { BotEvent, EventCancel, EventRun } from './events';
import { GuildMember, PartialGuildMember } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import getUser from './helper/get-user';


let botInstance: BotInstance | undefined = undefined;


async function quitUser(member: GuildMember | PartialGuildMember) {

    const user = await getUser(botInstance!.config._id, member.guild.id, member.user!);

    await UserStatsModel.updateOne(
        { _id: user._id },
        {
            $set: {
                onServer: false,
                quitDate: new Date(),
            },
        },
    );

}


const run: EventRun = async bot => {
    botInstance = bot;
    bot.client.on('guildMemberRemove', quitUser);
};


const cancel: EventCancel = bot => {
    botInstance = bot;
    bot.client.off('guildMemberRemove', quitUser);
};


// noinspection JSUnusedGlobalSymbols
export const properties: BotEvent = {
    name: 'user-quit',
    run,
    cancel,
};
