import { DataStorage, DataType } from '../../models/DataModel';
import { Bot, BotInstance } from '../../bot/botTypes';

export default abstract class baseEvent {

    // Event props
    abstract readonly name: string;
    readonly requiredDataKeys: RequiredDataKey[];

    //
    abstract bot: BotInstance;
    data: DataStorage[];

    abstract onMount(bot: BotInstance): void;

    onDismount?(): void;

}

export interface RequiredDataKey {
    key: string,
    type: DataType,
}

export interface BotEvent {
    name: string,
    requiredDataKeys?: RequiredDataKey[];
}
