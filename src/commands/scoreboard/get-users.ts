import { DiscordAPIError, Message } from 'discord.js';
import { BotInstance } from '../../bot/botTypes';
import { FormattedUser } from '../../canvas/create-scoreboard';
import UserStatsModel from '../../models/UserStatsModel';

type ScoreType = 'messages' | 'commands' | 'level' | 'xp';

export default async function getUsers(scoreType: ScoreType, message: Message, bot: BotInstance, count = 5) {

    const users = await UserStatsModel
        .find({
            botID: bot.config._id,
            guildID: message.guild!.id,
            onServer: true,
        })
        .sort({ messagesCount: 'desc' })
        .limit(count);

    // Get and organize stats about members
    return Promise.all(users.map(async (user, ind) => {
        let member;

        try {
            member = await message.guild?.members.fetch({ user: user.userID, force: true });
        } catch (e) {
            if (!(e instanceof DiscordAPIError) || !e.message.match(/^unknown (user|member)$/i))
                throw e;
            await user.updateOne({
                onServer: false,
            });
            return null;
        }

        return {
            name: member?.displayName || user.userID,
            count: user.messagesCount,
            position: ind + 1,
            avatarURL: member?.user.displayAvatarURL({ size: 128, format: 'png' }),
            percentage: user.messagesCount / users[0].messagesCount * 100,
        } as FormattedUser;
    }))
        .then(l => l.filter(u => u)) as Promise<FormattedUser[]>;
}