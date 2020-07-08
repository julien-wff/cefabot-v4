import { TextChannel } from 'discord.js';
import { BotInstance } from '../../bot/botTypes';

export default function findChanel(bot: BotInstance, guildID: string, channelID: string): TextChannel | false {

    const channel = bot
        .client
        .guilds
        .cache
        .get(guildID)!
        .channels
        .cache
        .get(channelID as string)! as TextChannel;

    if (!channel || channel.deleted) {
        return false;
    }

    return channel;
}
