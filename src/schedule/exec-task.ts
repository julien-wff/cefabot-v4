import { ScheduleDoc } from '../models/ScheduleModel';
import sendMessageAction from './actions/send-message';
import { BotInstance } from '../bot/botTypes';
import deleteMessageAction from './actions/delete-message';
import rebootPacketAction from './actions/reboot-packet';
import botLog from '../logs/bot-log';
import editMessageAction from './actions/edit-message';
import removeRoleAction from './actions/remove-role';
import deletePrivateMessageAction from './actions/delete-private-message';

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
            botLog('error', `Cannot find task with type ${task.type}`, bot.config._id, { location: 'exec-task.ts' });
    }


    function exec(fn: (action: ScheduleDoc, bot: BotInstance) => Promise<any>) {
        fn(task, bot)
            .catch(err => botLog('error', err, bot.config._id, { location: 'exec-task.ts' }));
    }

}
