import { BotInstance } from '../../bot/botTypes';
import ScheduleModel, { ScheduleDoc } from '../../models/ScheduleModel';
import findGuildMember from '../helper/find-guild-member';

export default async function removeRoleAction(action: ScheduleDoc, bot: BotInstance) {

    if (!action || !action.userID || !action.roleID)
        return;

    bot.client.setTimeout(async () => {

        const member = findGuildMember(bot, action.guildID!, action.userID!);
        if (!member) {
            await ScheduleModel.findByIdAndDelete(action._id);
            return;
        }

        await member.roles.remove(action.roleID!);

        await ScheduleModel.findByIdAndDelete(action._id);

    }, action.dueTo.getTime() - Date.now());

}
