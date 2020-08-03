import { resolve } from "path";
import { existsSync } from "fs";
import { BotEvent } from '../../../events/events';
import botLog from '../../../logs/bot-log';

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
            if (botID) botLog('error', `Unable to load the event ${name} : ${e.message}`, botID, {
                location: 'load-event.ts',
                data: e,
            });
        }

    }

    return false;

}
