import { BotInstance } from '../bot/botTypes';
import { DataType } from '../models/DataModel';

export interface BotEvent {
    name: string;
    run: EventRun;
    cancel: EventCancel;
    requiredDataKeys?: {
        key: string,
        type: DataType,
    }[];
}


/**
 * The function to run to start the event
 */
export type EventRun = (bot: BotInstance) => Promise<void | string>;


/**
 * The function to run to stop an event when disabled.
 * Can be useful to remove a timeout, for instance.
 */
export type EventCancel = (bot: BotInstance) => any | Promise<any>;
