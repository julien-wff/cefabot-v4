import { Message } from 'discord.js';
import { BotInstance } from '../../bot/botTypes';
import { extractUserIDFromTag } from '../../utils/extract-guild-data-from-tag';
import UserStatsModel from '../../models/UserStatsModel';
import createStats, { Stats } from '../../canvas/create-stats';

export default async function genUserStats(message: Message, member: string, bot: BotInstance): Promise<string | false> {

    const userID = extractUserIDFromTag(message, member);
    if (!userID)
        return false;

    const user = await UserStatsModel.findOne({
        botID: bot.config._id,
        guildID: message.guild!.id,
        userID,
    });
    if (!user)
        return false;

    const guildMember = message.guild!.member(user.userID)!;

    const userStats: Stats = {
        name: guildMember.displayName,
        avatarURL: guildMember.user.displayAvatarURL({ format: 'png', size: 128 }),
        memberFor: (guildMember.joinedTimestamp || 0) - Date.now(),
        messages: user.messagesCount,
        commands: user.commandsCount,
        xp: user.xp.count,
    };

    //TODO: position
    // const users = await UserStatsModel
    //     .find({
    //         botID: bot.config._id,
    //         guildID: message.guild!.id,
    //         onServer: true,
    //     })
    //     .sort({ messagesCount: 'desc' })
    //     .limit(count);

    return await createStats(userStats, bot.localeService);

}
