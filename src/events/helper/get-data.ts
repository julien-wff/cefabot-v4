import { BotInstance } from '../../bot/botTypes';
import DataModel, { DataStorage } from '../../models/DataModel';
import { BotEvent } from '../events';

export default async function getData(bot: BotInstance, properties: BotEvent): Promise<Result> {

    const { name, requiredDataKeys: dataKeys } = properties;

    const data = await DataModel.find({
        botID: bot.config._id,
        key: { $in: dataKeys?.map(value => value.key) },
    });

    //TODO: type verification
    //TODO: separate in its own file
    const missingKeys = dataKeys!.filter(keyValue => !data.find(dataValue => dataValue.key === keyValue.key));

    return {
        data,
        error: missingKeys.length > 0
            ? `erreur lors de l'activation de l'évènement \`${name}\` : ` +
            `clé${missingKeys.length > 1 ? 's' : ''} manquante${missingKeys.length > 1 ? 's' : ''} dans la base de données : \`${missingKeys.map(k => k.key).join('`, `')}\`. ` +
            `Veuillez ${missingKeys.length > 1 ? 'les ' : 'l\''}ajouter.`
            : undefined,
    };

}


interface Result {
    error?: string,
    data: DataStorage[];
}
