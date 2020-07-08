import { CommandPath } from '../../../../commands/commands';
import ms from 'ms';

const MAX_32_BITS_INT = 2 ** 31 - 1;

export default function getCommandArgs(path: CommandPath, commandArgs: string[]) {

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
                error = `argument ${arg.displayName} manquant`;
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
                    error = `${element} n'est pas un nombre entier valide`;
                else
                    result[arg.valueName] = intArg;
                break;

            case 'float':
                const floatArg = parseFloat(element);
                if (isNaN(floatArg))
                    error = `${element} n'est pas un nombre valide`;
                else
                    result[arg.valueName] = floatArg;
                break;

            case 'duration':
                const durationArg = ms(element);
                if (!durationArg)
                    error = `${element} n'est pas une durée valide`;
                if (arg.forTimer && durationArg >= MAX_32_BITS_INT)
                    error = `impossible de définir une durée de plus de 24 jours`;
                else
                    result[arg.valueName] = durationArg;
                break;

            case 'listUntilEnd':
                result[arg.valueName] = commandArgs.slice(ind);
                breakLoop = true;
                break;

            default:
                error = 'une erreur est survenue. Code : `ERR_UNKNOWN_ARG_TYPE`';
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
