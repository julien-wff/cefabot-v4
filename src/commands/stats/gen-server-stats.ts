import { Message } from 'discord.js';
import { BotInstance } from '../../bot/botTypes';
import UserStatsModel from '../../models/UserStatsModel';
import createStats, { Stats } from '../../canvas/create-stats';

export default async function genServerStats(message: Message, bot: BotInstance): Promise<string> {

    const usersStats = await UserStatsModel.find({
        botID: bot.config._id,
        guildID: message.guild!.id,
        onServer: true,
    });

    let serverStats: Stats = {
        name: message.guild!.name,
        avatarURL: message.guild!.iconURL({ size: 128, format: 'png' }) || undefined,
        members: message.guild!.memberCount,
        messages: usersStats.reduce((previous, current) => previous + current.messagesCount, 0),
        commands: usersStats.reduce((previous, current) => previous + current.commandsCount, 0),
        xp: usersStats.reduce((previous, current) => previous + current.xp.count, 0),
    };

    return await createStats(serverStats, bot.localeService);

}
