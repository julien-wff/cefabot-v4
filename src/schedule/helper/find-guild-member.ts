import { GuildMember } from 'discord.js';
import { BotInstance } from '../../bot/botTypes';

export default function findGuildMember(bot: BotInstance, guildID: string, userID: string): GuildMember | false {

    const guild = bot
        .client
        .guilds
        .resolve(guildID);

    if (!guild)
        return false;

    const member = guild
        .member(userID);

    if (!member || member.deleted) {
        return false;
    }

    return member;
}
