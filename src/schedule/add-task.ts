import { BotInstance } from '../bot/botTypes';
import { MomentInput } from './schedule';
import ScheduleModel, { InputSchedule, Schedule } from '../models/ScheduleModel';
import convertMoment from './helper/convert-moment';
import execTask from './exec-task';


export default async function addTask(bot: BotInstance, moment: MomentInput, data: InputSchedule): Promise<boolean> {

    const dueTo = convertMoment(moment);
    if (!dueTo)
        return false;

    const schedule = new ScheduleModel({
        ...data,
        botID: bot.config._id,
        dueTo,
    } as Schedule);


    const task = await schedule.save();
    execTask(task, bot);

    return true;

}
