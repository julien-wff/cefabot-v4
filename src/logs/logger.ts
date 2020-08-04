import { LogLevel, LogType } from './logTypes';
import LogModel, { Log } from '../models/LogModel';
import mongoose from 'mongoose';

/**
 * Function to emit a log.
 * If the DB is available, and the bot is in production mode,
 * the log is saved in the DB, otherwise it goes in the stdout.
 * @param level The part of the logg (bot or app).
 * @param type The type of the log. Types: log (standard information), debug (for development purposes), error and warning.
 * @param message The message of the log.
 * @param data Some additional data to save.
 */
export default function logger(level: LogLevel, type: LogType, message: string, data?: AdditionalData) {

    if (mongoose.connection.readyState === 1 && process.env.NODE_ENV === 'prod') {

        new LogModel({
            level,
            type,
            message,
            ...data,
        } as Log)
            .save()
            .catch(err => console.error(`Error when attempting to save a log. \nError:`, err, '\nLog message:', message));

    } else {

        if (type === 'error')
            console.error(message);
        else
            console.log(message);

    }
}

interface AdditionalData {
    data?: any,
    location?: string,
    botID?: any,
    date?: Date,
}
