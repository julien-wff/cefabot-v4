import { BotInstance } from '../bot/botTypes';
import { Message, PermissionString } from 'discord.js';
import { ChannelType } from '../models/Channel';
import { DataType } from '../models/DataModel';


/**
 * The function which is executed when the path is triggered
 */
export type PathRun<P = {}> = (
    /**
     * The message which triggered the command
     */
    message: Message,
    /**
     * The dynamic paths values, the flags values and the required getMultipleData
     */
    params: P,
    /**
     * The bot object
     */
    bot: BotInstance,
) => any | Promise<any>;


/**
 * The properties of the command
 */
export interface Command {
    /**
     * The name of the command
     */
    name: string;

    /**
     * A short description of the command
     */
    description: string;

    /**
     * The different triggers of the command
     */
    triggers: string[];

    /**
     * The different paths of the command
     */
    paths?: CommandPath[];

    /**
     * Define if the command can be disabled by the user
     */
    removable: boolean;

    /**
     * Define if the root of the command (=no args) can be triggered
     */
    rootPath?: CommandPath;

    /**
     * The needed permission to run the command
     */
    permission?: PermissionString | PermissionString[];

    /**
     * The channel where the command must be executed,
     * by default a command can be executed everywhere
     */
    channel?: ChannelType | ChannelType[];

    /**
     * The getMultipleData keys required to run the command
     */
    requiredDataKey?: { key: string, type: DataType }[];
}


/**
 * The different types of flags
 * to write in an object
 */
export type DeclarativeValueType = 'boolean' | 'string' | 'int' | 'float' | 'duration' | 'listUntilEnd';


/**
 * The different types of values that a flag, or an argument can have
 */
export type RealValueType = boolean | string | number;


/**
 * A flag of a command
 */
export interface CommandFlag {
    /**
     * The displayed text in the help message
     */
    help: string;

    /**
     * The name of the flag used in the props object
     */
    name: string;

    /**
     * The description of the flag
     */
    description: string;

    /**
     * The type of the flag value
     */
    valueType: DeclarativeValueType;

    /**
     * The different triggers / aliases of the flag
     */
    triggers: string[];

    /**
     * Defines if the flag it's required to specify the flag
     */
    required?: true;
}


/**
 * The different actions of the command
 */
export interface CommandPath {
    /**
     * The displayed text in the help message
     */
    help: string;

    /**
     * The description of the path
     */
    description: string;

    /**
     * The function to run at the path execution
     */
    run: PathRun<any>;

    /**
     * The arguments of the command
     * Each array element represent an alias
     */
    args: (StaticCommandPathArg | DynamicCommandPathArg)[];

    /**
     * The flags which can be used in this path
     */
    flags?: CommandFlag[];

    /**
     * If true, the command will be executed despite the error
     */
    continueOnError?: true;
}


/**
 * A static argument path
 */
export interface StaticCommandPathArg {
    /**
     * The type of the arg
     */
    argType: 'static';

    /**
     * The triggers used to validate the path
     */
    triggers: string[];
}


/**
 * A dynamic argument path (= a value)
 */
export interface DynamicCommandPathArg {
    /**
     * The type of the arg
     */
    argType: 'dynamic';

    /**
     * The display name of the argument
     */
    displayName: string;

    /**
     * The type of the value
     */
    valueType: DeclarativeValueType;

    /**
     * The name of the value in the parsed object
     */
    valueName: Exclude<string, 'error'>;

    /**
     * Define is the argument is optional
     */
    optional?: true;

    /**
     * If true and valueType set to duration, fires an error
     * when the duration is greater than 24 days (limit of a JS timeout/interval)
     */
    forTimer?: boolean;
}


/**
 * The result of parsing a command string
 */
export interface ParsedResult {
    /**
     * The parameters (arguments and flags) extracted from the command
     */
    params: { [key: string]: unknown };

    /**
     * The path of the command
     */
    path: CommandPath;

    /**
     * The parsing error message of the command
     */
    error?: string;
}
