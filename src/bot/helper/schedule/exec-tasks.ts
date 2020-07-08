import { BotInstance } from '../../botTypes';
import ScheduleModel from '../../../models/ScheduleModel';
import execTask from '../../../schedule/exec-task';

export default async function execTasks(bot: BotInstance) {

    const tasks = await ScheduleModel.find({ botID: bot.config._id });

    if (!tasks || tasks.length === 0)
        return;

    tasks.forEach(task => execTask(task, bot));

}
