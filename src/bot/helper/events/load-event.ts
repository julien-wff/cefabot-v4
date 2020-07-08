import { resolve } from "path";
import { existsSync } from "fs";
import { BotEvent } from '../../../events/events';

export default function loadEvent(name: string, addExt = false): BotEvent | false {

    const eventPath = resolve(
        __dirname,
        `../../../events/${name}${addExt ? `.${process.env.FILES_EXT}` : ''}`,
    );

    if (existsSync(eventPath) && eventPath.match(/\.[tj]s$/)) {

        try {
            const event: { properties: BotEvent } = require(eventPath);
            if (event && event.properties)
                return event.properties;
        } catch (e) {}

    }

    return false;

}
