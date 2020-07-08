import { BotInstance } from '../../bot/botTypes';
import ScheduleModel, { ScheduleDoc } from '../../models/ScheduleModel';
import findChanel from '../helper/find-channel';

export default async function sendMessageAction(action: ScheduleDoc, bot: BotInstance) {

    if (!action || !action.channelID)
        return;

    bot.client.setTimeout(async () => {

        const channel = findChanel(bot, action.guildID!, action.channelID!);
        if (!channel) {
            await ScheduleModel.findByIdAndDelete(action._id);
            return;
        }

        await channel.send(action.content);

        await ScheduleModel.findByIdAndDelete(action._id);

    }, action.dueTo.getTime() - Date.now());

}
