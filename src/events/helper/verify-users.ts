import { BotInstance } from '../../bot/botTypes';
import UserStatsModel from '../../models/UserStatsModel';

export default (bot: BotInstance) => Promise.all(bot.client.guilds.cache.map(guild =>
    Promise.all(guild.members.cache.map(async member => {
        const userStats = await UserStatsModel.findOne({
            userID: member.user.id,
            botID: bot.config._id,
            guildID: guild.id,
        });

        if (!userStats) {
            const newUser = new UserStatsModel({
                botID: bot.config._id,
                guildID: guild.id,
                userID: member.user.id,
                bot: member.user.bot || undefined,
            });

            await newUser.save();
        }
    })),
))