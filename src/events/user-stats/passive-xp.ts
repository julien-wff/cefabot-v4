import { BotInstance } from '../../bot/botTypes';
import logger from '../../logs/logger';
import UserStatsModel from '../../models/UserStatsModel';
import { ONLINE_XP, VOICE_XP } from './xp-gains';


export const passiveXP = (botInstance: BotInstance) => botInstance.client.guilds.cache.forEach(async guild => {

    const members = await guild.members.fetch({ withPresences: true, force: true })
        .catch(err => logger.bot.error(err, {
            botID: botInstance.config._id,
            data: err,
            location: 'user-stats.ts',
        }));
    if (!members || members.size === 0)
        return;

    await Promise.all(members.map(async member => {
        let memberNewXP = 0;

        // Give 1XP to all the connected members
        if (member.presence.status !== 'offline')
            memberNewXP += ONLINE_XP;

        // Give 5XP to all members in a vocal channel
        if (member.voice.channelID)
            memberNewXP += VOICE_XP;

        if (memberNewXP > 0)
            //TODO: bulk update
            await UserStatsModel.updateOne(
                {
                    botID: botInstance.config._id,
                    guildID: guild.id,
                    userID: member.id,
                },
                {
                    $inc: {
                        'xp.count': memberNewXP,
                    },
                },
            );
    }));

});

