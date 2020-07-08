import { Schema, model } from 'mongoose';
import { LogType } from './logTypes';


const BotLog = new Schema({
    type: {
        type: String,
        required: true,
    },
    message: String,
    errorType: String,
    location: String,
    botId: Schema.Types.ObjectId,
    data: Schema.Types.Mixed,
    date: {
        type: Date,
        default: Date.now,
    },
});


export default model('BotLog', BotLog);

export interface BotLog {
    type: LogType;
    message?: string;
    errorType?: string;
    location?: string;
    botId?: any;
    data?: any;
    date: Date;
}
