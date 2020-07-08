import { DataType } from '../../models/DataModel';
import { Message } from 'discord.js';
import {
    extractChannelIDFromTag,
    extractRoleIDFromTag,
    extractUserIDFromTag,
} from '../../utils/extract-guild-data-from-tag';

export default function convertData(message: Message, data: string[], type: DataType): ConversionResult {

    const value = data.join(' ');

    switch (type) {

        case 'string':
            return { data: value };

        case 'boolean':
            if (![ 'vrai', 'true', '1', 'faux', 'false', '0' ].includes(value))
                return { error: `"${value}" n'est pas un booléan valide`, data: value };
            return { data: [ 'vrai', 'true', '1' ].includes(value) };

        case 'int':
            const intData = parseInt(value);
            if (isNaN(intData))
                return { error: `"${value}" n'est pas un nombre entier valide`, data: value };
            return { data: intData };

        case 'float':
            const floatData = parseFloat(value);
            if (isNaN(floatData))
                return { error: `"${value}" n'est pas un nombre valide`, data: value };
            return { data: floatData };

        case 'array':
            const JSONArray = toJSON(value);
            if (!JSONArray || !value.match(/^\[.*]$/))
                return { error: `"${value}" n'est pas une array valide`, data: value };
            return { data: JSONArray };

        case 'object':
            const JSONObject = toJSON(value);
            if (!JSONObject || !value.match(/^{.*}$/))
                return { error: `"${value}" n'est pas un objet valide`, data: value };
            return { data: JSONObject };

        case 'discord-role':
            const roleID = extractRoleIDFromTag(message, value);
            if (!roleID)
                return { error: `rôle "${value}" non trouvé. Essayez de le citer avec @.`, data: value };
            return { data: roleID };

        case 'discord-channel':
            const channelID = extractChannelIDFromTag(message, value);
            if (!channelID)
                return { error: `salon "${value}" non trouvé. Essayez de le citer avec #.`, data: value };
            return { data: channelID };

        case 'discord-user':
            const userID = extractUserIDFromTag(message, value);
            if (!userID)
                return { error: `utilisateur "${value}" non trouvé. Essayez de le citer avec @.`, data: value };
            return { data: userID };

        default:
            return { error: 'type inconnu', data: value };
    }

}

function toJSON(data: any) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return false;
    }
}


interface ConversionResult {
    error?: string,
    data: any,
}
