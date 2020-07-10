import { CommandFlag, RealValueType } from '../../../../commands/commands';
import { BotInstance } from '../../../botTypes';

export default function getCommandFlag(flagData: CommandFlag, content: string, bot: BotInstance): ParseFlagResult {

    let result: ParseFlagResult | undefined;

    const { triggers, valueType, help, required, name } = flagData;

    // Select the right trigger
    const [ flag, duplicatedFlag ] = triggers.filter(tg => content.match(new RegExp(`${tg}( +|$)`, 'i')));

    if (!flag)  // If the flag is not found
        if (required)
            return { error: bot.localeService.translate('error.missing flag', { flag: help }) };
        else
            return {};

    if (duplicatedFlag) // If there is more than one trigger it means that it's duplicated
        return {
            error: bot.localeService.translate('error.flag present under multiple versions', { flag: help }) + ` (${help}, ${duplicatedFlag})`,
        };

    const flagRegex = new RegExp(`${flag}( +|$)`, 'i');

    // Extracting different getMultipleData

    if (valueType === 'boolean') {
        const boolValue = extractNextValue(flag, false)?.toLowerCase();
        if (boolValue === 'false') {
            result = {
                data: { name, value: false },
            };
            extractNextValue(flag);
        } else {
            result = {
                data: { name, value: true },
            };
        }
        return result;
    }


    if (valueType === 'string') {
        if (content.match(new RegExp(`${flag} +"[^"]+"`, 'i'))) {

            result = {
                data: { name, value: extractNextSentence(flag) },
            };

        } else if (content.match(new RegExp(`${flag} +[^ "]+( |$)`, 'i'))) {

            result = {
                data: { name, value: extractNextValue(flag) },
            };

        } else {

            return { error: bot.localeService.translate('error.the flag is invalid', { flag }) };

        }
    }


    if (valueType === 'int') {
        if (content.match(new RegExp(`${flag} +\\d+( |$)`, 'i'))) {

            const value = extractNextValue(flag);
            const intValue = parseInt(value);
            if (isNaN(intValue))
                return { error: bot.localeService.translate('error.invalid integer', { number: value }) };
            else
                result = { data: { name, value: intValue } };

        } else {

            return { error: bot.localeService.translate('error.the flag is invalid', { flag }) };

        }
    }


    if (valueType === 'float') {
        if (content.match(new RegExp(`${flag} +(\\d+|(\\d*\.\\d+))( |$)`, 'i'))) {

            const value = extractNextValue(flag);
            const floatValue = parseFloat(value);
            if (isNaN(floatValue))
                return { error: bot.localeService.translate('error.not a valid number', { number: value }) };
            else
                result = { data: { name, value: floatValue } };

        } else {

            return { error: bot.localeService.translate('error.the flag is invalid', { flag }) };

        }
    }


    if (result && content.match(flagRegex)) // If the deleted flag is still present in the content
        result = {
            ...result,
            error: bot.localeService.translate('error.flag present under multiple versions', { flag }),
        };

    // Return the result. If there is no result, return an error.
    if (result)
        return result;
    else
        return { error: bot.localeService.translate('error.something went wrong', { code: 'ERR_NO_FLAG_RESULT' }) };


    // The extracting functions

    function extractNextValue(flag: string, replace: boolean = true) {
        const value = content
            .split(new RegExp(`.*${flag} +`, 'i'))[1]
            ?.split(/ /)[0];
        if (value && replace) content = content
            .replace(new RegExp(`${flag} +${value} ?`, 'i'), '');
        return value?.trim();
    }


    function extractNextSentence(flag: string, replace: boolean = true) {
        const value = content
            .split(new RegExp(`${flag} +"`))[1]
            ?.split(/"/)[0];
        if (value && replace) content = content
            .replace(new RegExp(`${flag} +"${value}" ?`, 'i'), '');
        return value?.trim();
    }

}


interface ParseFlagResult {
    data?: {
        name: string,
        value: RealValueType,
    };
    error?: string;
}
