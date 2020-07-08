import { BotInstance } from '../../bot/botTypes';
import ScheduleModel, { ScheduleDoc } from '../../models/ScheduleModel';
import findChanel from '../helper/find-channel';

export default async function editMessageAction(action: ScheduleDoc, bot: BotInstance) {

    if (!action || !action.channelID)
        return;

    bot.client.setTimeout(async () => {

        const channel = findChanel(bot, action.guildID!, action.channelID!);
        if (!channel) {
            await ScheduleModel.findByIdAndDelete(action._id);
            return;
        }

        const message = await channel.messages.fetch(action.messageID!);
        if (message && message.editable)
            await message.edit(action.content);


        await ScheduleModel.findByIdAndDelete(action._id);

    }, action.dueTo.getTime() - Date.now());

}
