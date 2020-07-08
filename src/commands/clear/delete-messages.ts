import { Snowflake, ChannelLogsQueryOptions, Message } from 'discord.js';

export default async function deleteMessages(arg: number | Snowflake, message: Message, report: boolean) {

    let channelQueryOption: ChannelLogsQueryOptions;

    if (typeof arg === 'number') {

        channelQueryOption = {
            limit: arg,
        };

    } else {

        channelQueryOption = {
            after: arg,
        };

    }


    // Querying messages
    const channelMsg = (await message.channel.messages.fetch(channelQueryOption, false)).array();
    let msgCount = channelMsg.length;

    // Sending an information message
    const alertMsg = await message.channel.send(deletingMsg(msgCount));

    // Starting the messages deleting
    if (report) {   // With report (slower)

        for (let i = 0; i < msgCount; i++) {
            await channelMsg[i].delete({ reason: `${msgCount} messages deleted by ${message.author.username}` });
            await alertMsg.edit(deletingMsg(msgCount - i));
        }

    } else {    // Without report (faster)

        const deleteQueue = channelMsg.map(delMsg =>
            delMsg.delete({ reason: `${channelMsg.length} messages deleted by ${message.author.username}` }),
        );

        // Waiting for all the messages to be deleted
        await Promise.all(deleteQueue);

    }

    // Deleting the information message
    await alertMsg.delete();

}


const deletingMsg = (count: number) => `**Suppression de ${count - 1} messages...**`;
