import { DiscordAPIError, Message } from 'discord.js';
import { BotInstance } from '../../bot/botTypes';
import { FormattedUser } from '../../canvas/create-scoreboard';
import UserStatsModel, { UserStatsDoc } from '../../models/UserStatsModel';


export type ScoreType = 'messages' | 'commands' | 'level' | 'xp';
type DBProperty = 'messagesCount' | 'commandsCount' | 'xp.count'


//TODO: support the level param
export default async function getUsers(scoreType: ScoreType, message: Message, bot: BotInstance, count = 5) {

    let property: DBProperty;

    switch (scoreType) {
        case 'messages':
            property = 'messagesCount';
            break;
        case 'commands':
            property = 'commandsCount';
            break;
        case 'xp':
        case 'level':
            property = 'xp.count';
            break;
    }

    const users = await UserStatsModel
        .find({
            botID: bot.config._id,
            guildID: message.guild!.id,
            onServer: true,
        })
        .sort({ [property]: 'desc' })
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

        const count = getStat(user, scoreType);

        return {
            name: member?.displayName || user.userID,
            count,
            position: ind + 1,
            avatarURL: member?.user.displayAvatarURL({ size: 128, format: 'png' }),
            percentage: count / getStat(users[0], scoreType) * 100,
        } as FormattedUser;
    }))
        .then(l => l.filter(u => u)) as Promise<FormattedUser[]>;
}


function getStat(user: UserStatsDoc, property: ScoreType): number {
    switch (property) {
        case 'messages':
            return user.messagesCount;
        case 'commands':
            return user.commandsCount;
        case 'xp':
        case 'level':
            return user.xp.count;
    }
}