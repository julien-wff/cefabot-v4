import UserStatsModel, { UserStats, UserStatsDoc } from '../../models/UserStatsModel';
import { User } from 'discord.js';

/**
 * Gets a user in the DB.
 * If the user doesn't exist, create it.
 */
export default async function getUser(botID: any, guildID: string, user: User): Promise<UserStatsDoc> {

    const existingUser = await UserStatsModel.findOne({ botID, guildID, userID: user.id });

    if (existingUser)
        return existingUser;

    const newUser = new UserStatsModel({
        botID,
        guildID,
        userID: user.id,
        isBot: user.bot ? true : undefined,
    } as Partial<UserStats>);
    return await newUser.save();

}
