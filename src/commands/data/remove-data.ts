import { PathRun } from '../commands';
import DataModel from '../../models/DataModel';


interface PathProps {
    key: string,
}


const removeData: PathRun<PathProps> = async (message, { key }, bot) => {

    const result = await DataModel.findOneAndDelete({
        botID: bot.config._id,
        guildID: message.guild!.id,
        key,
    });

    if (!result)
        await message.reply(`aucune donnée correspondante n'a été trouvée avec la clé \`${key}\``);
    else
        await message.reply(`Donnée \`${key}\` supprimée avec succès.`);
};


export default removeData;
