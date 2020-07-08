import { Message } from 'discord.js';
import { MomentInput } from '../schedule/schedule';
import addTask from '../schedule/add-task';
import { BotInstance } from '../bot/botTypes';

export default async function tempMessage(initialMsg: Message, bot: BotInstance, content: any, duration: MomentInput, reply = false) {

    let tempMsg: Message;

    if (reply)
        tempMsg = await initialMsg.reply(content);
    else
        tempMsg = await initialMsg.channel.send(content);

    await addTask(
        bot,
        duration,
        {
            type: 'DELETE_MSG',
            guildID: initialMsg.guild!.id,
            channelID: initialMsg.channel.id,
            messageID: tempMsg.id,
        },
    );

}
