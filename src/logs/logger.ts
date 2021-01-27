import { LogLevel, LogType } from './logTypes';
import LogModel, { Log } from '../models/LogModel';
import mongoose from 'mongoose';
import { BotPacket } from '../bot/botTypes';
import StackTracey from 'stacktracey';


/**
 * Dispatches the new log event depending on the status of the logger (in main or in a fork)
 */
export function alertLog() {
    if (!process.env.FORK) {
        // @ts-ignore
        process.emit('log');
    } else {
        process.send!({ type: 'log' } as BotPacket);
    }
}

// Used to transmit the log type (2nd param) and all the params
const logType = (level: LogLevel, type: LogType) =>
    (message: string, data?: AdditionalData) =>
        log(level, type, message, data);

// Used to transmit the log level (1st param) and set the type
const logLevel = (level: LogLevel) => ({
    debug: logType(level, 'debug'),
    error: logType(level, 'error'),
    log: logType(level, 'log'),
    warning: logType(level, 'warning'),
});

// Set the log level (1st param)
const logger = {
    bot: logLevel('bot'),
    app: logLevel('app'),
};

export default logger;

/**
 * Function to emit a log.
 * If the DB is available, and the bot is in production mode,
 * the log is saved in the DB, otherwise it goes in the stdout.
 * @param level The part of the logg (bot or app).
 * @param type The type of the log. Types: log (standard information), debug (for development purposes), error and warning.
 * @param message The message of the log.
 * @param data Some additional data to save.
 */
function log(level: LogLevel, type: LogType, message: string, data?: AdditionalData) {

    // If the message is empty, mongoose will throw an error
    if (!message) return;

    if (mongoose.connection.readyState === 1 && process.env.NODE_ENV === 'prod') {

        const stackTrace = new StackTracey()
            .clean()
            .filter(e => !e.fileName.match(/logger\.[jt]s/))   // Remove this trace
            .items;

        new LogModel({
            level,
            type,
            message,
            stackTrace,
            ...data,
        } as Log)
            .save()
            .catch(err => console.error(`Error when attempting to save a log. \nError:`, err, '\nLog message:', message))
            .finally(() => alertLog());

    } else {

        if (type === 'error')
            console.error(message);
        else
            console.log(message);
        alertLog();

    }
}

interface AdditionalData {
    data?: any,
    location?: string,
    botID?: any,
    date?: Date,
}
