import { Message } from 'discord.js';
import { BotInstance } from '../bot/botTypes';
import logger from '../logs/logger';
import DataModel from '../models/DataModel';
import { BotEvent, EventCancel, EventRun } from './events';
import replies from './stupied-replies/replies.json';


const DEFAULT_STUPID_REPLY_FREQUENCY = 0.1;
let SPECIFIED_STUPID_REPLY_FREQUENCY: number;
let bot: BotInstance;


function handleMessage(message: Message) {

    if (message.author.bot || message.content.startsWith(bot.config.commandStart))
        return;

    if (Math.random() > (SPECIFIED_STUPID_REPLY_FREQUENCY || DEFAULT_STUPID_REPLY_FREQUENCY))
        return;

    const cleanedMessage = message
        .content
        .toLowerCase()
        .replace(/[!?.^,;\/\\*=+()"']/g, '');

    for (let reply of replies) {
        switch (reply.type) {
            case 'ends_with':
                const ends_with_trigger = reply.triggers.find(tr => cleanedMessage.endsWith(tr));
                if (!ends_with_trigger)
                    break;

                message.channel.send(getReply(reply.reply, ends_with_trigger));
                break;

            case 'contains':
                const contains_trigger = reply.triggers.find(tr => cleanedMessage.match(new RegExp(`( |^)${tr}( |$)`)));
                if (!contains_trigger)
                    break;

                message.channel.send(getReply(reply.reply, contains_trigger));
                break;
        }
    }
}


const getReply = (propositions: string | string[], trigger: string) => (Array.isArray(propositions)
    ? propositions[Math.round(Math.random() * (propositions.length - 1))]
    : propositions)
    .replace(/%%TRIGGER%%/g, trigger);


const run: EventRun = async b => {
    bot = b;
    const specifiedReplyFrequency = await DataModel.findOne({
        botID: b.config._id,
        key: 'stupid-reply-frequency',
    });
    if (specifiedReplyFrequency) {
        if (specifiedReplyFrequency.type !== 'float') {
            logger.bot.warning(`Wrong data type for key 'stupid-reply-frequency'. float expected, got ${specifiedReplyFrequency.type}. Event will fallback on default frequency of ${DEFAULT_STUPID_REPLY_FREQUENCY}`);
        } else {
            SPECIFIED_STUPID_REPLY_FREQUENCY = specifiedReplyFrequency.value;
        }
    }
    b.client.on('message', handleMessage);
};


const cancel: EventCancel = async bot => {
    bot.client.off('message', handleMessage);
};


export const properties: BotEvent = {
    name: 'stupid-replies',
    run,
    cancel,
};
