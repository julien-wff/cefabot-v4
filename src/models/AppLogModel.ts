import { Schema, model } from 'mongoose';
import { LogType } from './logTypes';


const AppLog = new Schema({
    type: {
        type: String,
        required: true,
    },
    message: String,
    errorType: String,
    location: String,
    data: Schema.Types.Mixed,
    date: {
        type: Date,
        default: Date.now,
    },
});


export default model('AppLog', AppLog);

export interface AppLog {
    type: LogType;
    message?: string;
    errorType?: string;
    location?: string;
    data?: any;
    date: Date;
}
