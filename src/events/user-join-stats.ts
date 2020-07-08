import UserStatsModel from '../models/UserStatsModel';
import { BotEvent, EventCancel, EventRun } from './events';
import { GuildMember, PartialGuildMember } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import getUser from './helper/get-user';


let botInstance: BotInstance | undefined = undefined;


async function registerUser(member: GuildMember | PartialGuildMember) {

    const user = await getUser(botInstance!.config._id, member.guild.id, member.user!);

    await UserStatsModel.updateOne(
        { _id: user.id },
        {
            $set: {
                onServer: true,
            },
        },
    );

}


const run: EventRun = async bot => {
    botInstance = bot;
    bot.client.on('guildMemberAdd', registerUser);
};


const cancel: EventCancel = bot => {
    botInstance = bot;
    bot.client.off('guildMemberAdd', registerUser);
};


// noinspection JSUnusedGlobalSymbols
export const properties: BotEvent = {
    name: 'user-join-stats',
    run,
    cancel,
};
