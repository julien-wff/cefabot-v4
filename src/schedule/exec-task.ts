import { ScheduleDoc } from '../models/ScheduleModel';
import sendMessageAction from './actions/send-message';
import { BotInstance } from '../bot/botTypes';
import deleteMessageAction from './actions/delete-message';
import rebootPacketAction from './actions/reboot-packet';
import editMessageAction from './actions/edit-message';
import removeRoleAction from './actions/remove-role';
import deletePrivateMessageAction from './actions/delete-private-message';
import logger from '../logs/logger';

export default function execTask(task: ScheduleDoc, bot: BotInstance) {

    switch (task.type) {
        case 'SEND_MSG':
            exec(sendMessageAction);
            break;
        case 'EDIT_MSG':
            exec(editMessageAction);
            break;
        case 'DELETE_MSG':
            exec(deleteMessageAction);
            break;
        case 'REBOOT_PACKET':
            exec(rebootPacketAction);
            break;
        case 'REMOVE_ROLE':
            exec(removeRoleAction);
            break;
        case 'DELETE_PRIVATE_MSG':
            exec(deletePrivateMessageAction);
            break;
        default:
            logger('bot', 'error', `Cannot find task with type ${task.type}`, {
                location: 'exec-task.ts',
                botID: bot.config._id,
                data: task,
            });
    }


    function exec(fn: (action: ScheduleDoc, bot: BotInstance) => Promise<any>) {
        fn(task, bot)
            .catch(err => logger('bot', 'error', err, { location: 'exec-task.ts', botID: bot.config._id, data: task }));
    }

}
