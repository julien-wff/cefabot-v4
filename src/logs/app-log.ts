import mongoose from 'mongoose';
import AppLogModel, { AppLog } from '../models/AppLogModel';
import { LogType } from '../models/logTypes';

export default async function appLog(type: LogType, message: string, data?: AdditionalData) {

    if (mongoose.connection.readyState === 1 && process.env.NODE_ENV === 'prod') {

        const appLog = new AppLogModel({
            type,
            message,
            ...data,
        } as AppLog);
        await appLog.save();

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
