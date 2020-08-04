import { Schema, model, Document } from 'mongoose';
import { LogLevel, LogType } from '../logs/logTypes';


const Log = new Schema({
    type: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    errorType: String,
    location: String,
    botId: Schema.Types.ObjectId,
    data: Schema.Types.Mixed,
    date: {
        type: Date,
        default: Date.now,
    },
});


export default model<Document & Log>('Log', Log);

export interface Log {
    /** The type of the log. Types: log (standard information), debug (for development purposes), error and warning. */
    type: LogType,

    /** The message of the log. */
    message: string,

    /** The part of the logg (bot or app). */
    level: LogLevel,

    /** The file where the log was emitted. */
    location?: string,

    /** The ID of the bot associated with the log. */
    botId?: any,

    /** Some additional data about the log. */
    data?: any,

    /** The date when the log was emitted. */
    date: Date,
}
