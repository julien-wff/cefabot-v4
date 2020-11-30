import { resolve } from 'path';
import { existsSync } from 'fs';
import { BotEvent } from '../../../events/events';
import logger from '../../../logs/logger';

export default function loadEvent(name: string, addExt = false, botID?: any): BotEvent | false {

    const eventPath = resolve(
        __dirname,
        `../../../events/${name}${addExt ? `.${process.env.FILES_EXT}` : ''}`,
    );

    if (existsSync(eventPath) && eventPath.match(/\.[tj]s$/) && !eventPath.endsWith('.d.ts')) {

        try {
            const event: { properties: BotEvent } = require(eventPath);
            if (event && event.properties)
                return event.properties;
        } catch (e) {
            if (botID) logger.bot.error(`Unable to load the event ${name} : ${e.message}`, {
                location: 'load-event.ts',
                data: e,
                botID,
            });
        }

    }

    return false;

}
