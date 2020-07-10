import { CommandPath } from '../../../../commands/commands';
import ms from 'ms';
import { BotInstance } from '../../../botTypes';

const MAX_32_BITS_INT = 2 ** 31 - 1;

export default function getCommandArgs(path: CommandPath, commandArgs: string[], bot: BotInstance) {

    let result: any = {},
        error: string | undefined,
        breakLoop = false;

    path.args.forEach((arg, ind) => {

        if (breakLoop)
            return;

        if (arg.argType === 'static')
            return;

        const element = commandArgs[ind];

        if (!element) {
            if (!arg.optional)
                error = bot.localeService.translate('error.argument missing', { arg: arg.displayName });
            breakLoop = true;
            return;
        }

        switch (arg.valueType) {
            case 'boolean':
                result[arg.valueName] = true;
                break;

            case 'string':
                result[arg.valueName] = element;
                break;

            case 'int':
                const intArg = parseInt(element);
                if (isNaN(intArg))
                    error = bot.localeService.translate('error.not a valid integer', { number: element });
                else
                    result[arg.valueName] = intArg;
                break;

            case 'float':
                const floatArg = parseFloat(element);
                if (isNaN(floatArg))
                    error = bot.localeService.translate('error.not a valid number', { number: element });
                else
                    result[arg.valueName] = floatArg;
                break;

            case 'duration':
                const durationArg = ms(element);
                if (!durationArg)
                    error = bot.localeService.translate('error.not a valid duration', { duration: element });
                if (arg.forTimer && durationArg >= MAX_32_BITS_INT)
                    error = bot.localeService.translate('error.cannot define a duration greater than 24 days');
                else
                    result[arg.valueName] = durationArg;
                break;

            case 'listUntilEnd':
                result[arg.valueName] = commandArgs.slice(ind);
                breakLoop = true;
                break;

            default:
                error = bot.localeService.translate('error.something went wrong', { code: 'ERR_UNKNOWN_ARG_TYPE' });
        }

    });

    if (error)
        return {
            ...result,
            error,
        };
    else
        return result;


}
