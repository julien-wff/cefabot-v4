import { PathRun } from '../commands';
import Channel, { Channel as ChannelType, channelType } from '../../models/Channel';
import { extractChannelIDFromTag } from '../../utils/extract-guild-data-from-tag';

interface PathParams {
    channel: string,
    name: string,
}

const addChannel: PathRun<PathParams> = async (message, params, bot) => {

    // Verify the channel type
    if (!channelType.includes(params.name))
        return message.reply(
            `${params.name} n'est pas un nom de channel valide. `
            + `Essayez ${channelType.slice(0, -1).join(', ')} ou ${channelType.slice(-1)}.`,
        );

    //TODO: replace with function in utils

    const channelID = extractChannelIDFromTag(message, params.channel);

    // Verify the channel tag
    if (!channelID)
        return message.reply(`salon "${params.channel}" non trouvé. Essayez le citer avec #`);

    const channel = new Channel({
        botID: bot.config._id,
        guildID: message.guild!.id,
        channelID,
        channelType: params.name,
    } as ChannelType);

    await channel.save();

    // const channel = message.guild!.channels.cache.get(channelID);
    // console.log(channel);

    return message.channel.send(`Channel ${params.name} sauvegardé !`);
};

export default addChannel;
