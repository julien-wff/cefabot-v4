import { Command, ParsedResult } from '../../../../commands/commands';
import getCommandPath from './get-command-path';
import getCommandArgs from './get-command-args';
import getCommandFlag from './get-command-flag';
import DataModel from '../../../../models/DataModel';
import { Message } from 'discord.js';
import { BotInstance } from '../../../botTypes';

export default async function parseCommand(content: string, cmdProps: Command, message: Message, bot: BotInstance)
    : Promise<ParsedResult> {

    const { paths, rootPath, requiredDataKey } = cmdProps;
    content = content.replace(/^[^ ]+( |$)/, '');
    let result: any = {
        params: {},
    };

    if (requiredDataKey) {

        const storedData = await DataModel.find({
            botID: bot.config._id,
            guildID: message.guild!.id,
            key: {
                $in: requiredDataKey.map(d => d.key),
            },
        });

        const missingKeys = requiredDataKey.filter(keyValue => !storedData.find(dataValue => dataValue.key === keyValue.key));

        if (missingKeys.length > 0) {
            result.error = bot.localeService.translate('error.missing key in db', {
                count: missingKeys.length,
                key: missingKeys.map(k => k.key).join('`, `'),
            });
            return result;
        }
        storedData.forEach(d => result.params[d.key] = d.value);

    }

    // If the command has no paths or if we can trigger the root and there are no arguments
    if (!paths || rootPath && !content.trim()) {
        result.path = rootPath;
        return result;
    }

    // Get the arguments array
    const argsArray = content
        .split(/ /g)
        .filter(val => val)
        .map(val => val.trim());

    const path = getCommandPath(paths, argsArray);

    // If no paths found return an error
    if (!path) {
        result.error = bot.localeService.translate(
            'error.unknown path',
            { arg: content.replace(/`/g, ''), command: cmdProps.name },
        );
        return result;
    }

    result.path = path;

    // Get dynamic arguments
    const dynamicArgs = getCommandArgs(path, argsArray, bot);

    if (dynamicArgs.error) {
        result.error = dynamicArgs.error;
        return result;
    }

    result.params = dynamicArgs;

    // Get the flags
    path.flags?.forEach(flag => {

        const parsedFlag = getCommandFlag(flag, content, bot);

        if (parsedFlag.error)
            result.error = parsedFlag.error;
        if (parsedFlag.data)
            result.params[parsedFlag.data.name] = parsedFlag.data.value;

    });

    // Get the getMultipleData keys
    return result;

}


