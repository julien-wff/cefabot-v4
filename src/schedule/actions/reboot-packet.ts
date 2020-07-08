import { BotInstance } from '../../bot/botTypes';
import ScheduleModel, { ScheduleDoc } from '../../models/ScheduleModel';
import addTask from '../add-task';
import findChanel from '../helper/find-channel';

export default async function rebootPacketAction(action: ScheduleDoc, bot: BotInstance) {

    if (!action || !action.channelID || !action.messageID)
        return;

    bot.client.setTimeout(async () => {

        const channel = findChanel(bot, action.guildID!, action.channelID!);
        if (!channel) {
            await ScheduleModel.findByIdAndDelete(action._id);
            return;
        }

        const message = await channel.messages.fetch(action.messageID!);

        if (message && message.editable)
            await message.edit(':green_circle: Redémarrage terminé !');

        await addTask(bot, '5s', {
            type: 'DELETE_MSG',
            guildID: action.guildID,
            channelID: action.channelID,
            messageID: action.messageID,
        });

        await ScheduleModel.findByIdAndDelete(action._id);

    }, action.dueTo.getTime() - Date.now());

}
