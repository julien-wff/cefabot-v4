import { Message } from 'discord.js';
import { BotInstance } from '../../bot/botTypes';
import UserStatsModel from '../../models/UserStatsModel';
import getUser from '../helper/get-user';
import { ATTACHEMENT_XP, MESSAGE_XP } from './xp-gains';


export async function countMessage(msg: Message, botInstance: BotInstance) {

    if (!msg.guild) return;

    const user = await getUser(botInstance.config._id, msg.guild.id, msg.author);

    let messageType = 'messagesCount';
    if (msg.content.startsWith(botInstance.config.commandStart))
        messageType = 'commandsCount';

    let xpGain: number, gainViaAttachment = false;
    if (msg.attachments.size > 0) {
        xpGain = ATTACHEMENT_XP * msg.attachments.size;
        gainViaAttachment = true;
    } else {
        const delaySinceLastMsg = Date.now() - user.xp.lastXPMessage.getTime();
        xpGain = (MESSAGE_XP.find(d =>
            delaySinceLastMsg > d[0] && delaySinceLastMsg <= d[1],
        ) || [ 0, 0, 0 ])[2];
    }

    await UserStatsModel.updateOne(
        { _id: user._id },
        {
            $inc: {
                [messageType]: 1,
                'xp.count': xpGain,
            },
            ...(!gainViaAttachment && xpGain > 0
                    ? { 'xp.lastXPMessage': new Date() }
                    : {}
            ),
        },
    );

}