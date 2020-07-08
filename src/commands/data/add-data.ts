import { PathRun } from '../commands';
import DataModel, { DataStorage, DataType, dataTypes } from '../../models/DataModel';
import convertData from './convert-data';


interface PathProps {
    key: string,
    value: string[],
    secret?: boolean,
    type: string,
}


const addData: PathRun<PathProps> = async (message, params, bot) => {

    const existingData = await DataModel.findOne({
        botID: bot.config._id,
        guildID: message.guild!.id,
        key: params.key,
    });

    if (existingData)
        return message.reply(`une donnée à déjà été trouvée avec la clé \`${params.key}\`. Veuillez la supprimer ou la mettre à jour, ou bien utiliser une autre clé.`);

    if (!dataTypes.includes(params.type))
        return message.reply(`Type "${params.type}" invalide. Essayez un des types suivants : ${dataTypes.join(', ')}`);

    const convertedData = convertData(message, params.value, params.type as DataType);
    if (convertedData.error)
        return message.reply(convertedData.error);

    const data = new DataModel({
        botID: bot.config._id,
        guildID: message.guild!.id,
        key: params.key,
        value: convertedData.data,
        type: params.type,
        secret: params.secret,
    } as DataStorage);

    await data.save();

    return await message.reply(`Nouvelle donnée \`${params.key}\` stockée avec succès.`);
};


export default addData;
