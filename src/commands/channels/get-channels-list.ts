import { PathRun } from '../commands';
import Channel from '../../models/Channel';

const getChannelsList: PathRun = async (message, params, bot) => {

    const channels = await Channel.find({
        botID: bot.config._id,
        guildID: message.guild!.id,
    });

    await message.channel.send(
        `**Liste des ${channels.length} channels sauvegardés : **\n${channels.map(c => `- ${c.channelType} : <#${c.channelID}>`).join('\n')}`,
    );

};

export default getChannelsList;
