import { BotEvent } from '../../events/events';
import { BotInstance } from '../../bot/botTypes';

export default async function toggleBotEvent(bot: BotInstance, event: BotEvent): Promise<void | string> {

    if (bot.config.events.includes(event.name)) {

        event.cancel?.(bot);
        const evtIndex = bot.config.events.findIndex(evtName => evtName === event.name);
        bot.config.events.splice(evtIndex, 1);

    } else {

        const error = await event.run(bot);
        if (error)
            return error;
        else
            bot.config.events.push(event.name);

    }

}
