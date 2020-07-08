import mongoose from 'mongoose';
import BotLogModel, { BotLog } from '../models/BotLogModel';
import { LogType } from '../models/logTypes';

export default async function botLog(type: LogType, message: string, botId: any, data?: AdditionalData) {

    if (mongoose.connection.readyState === 1 && process.env.NODE_ENV === 'prod') {

        const botLog = new BotLogModel({
            type,
            message,
            botId,
            ...data,
        } as BotLog);
        await botLog.save();

    } else {

        if (type === 'error')
            console.error(message);
        else
            console.log(message);

    }

}

interface AdditionalData {
    data?: any;
    errorType?: string;
    location?: string;
}
