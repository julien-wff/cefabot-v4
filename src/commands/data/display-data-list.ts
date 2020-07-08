import { PathRun } from '../commands';
import DataModel from '../../models/DataModel';


const displayDataList: PathRun = async (message, params, bot) => {

    const data = await DataModel.find({
        botID: bot.config._id,
        guildID: message.guild!.id,
    });

    const displayData = data.map(value =>
        `(${value.type}) \`${value.key}\` : ${value.secret ? '[secret]' : `\`${value.value}\``}`,
    ).join('\n');

    await message.channel.send(`${data.length} élément${data.length > 1 ? 's' : ''} stockés dans la base de données :\n${displayData}`);

};


export default displayDataList;
