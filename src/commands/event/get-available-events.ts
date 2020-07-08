import { readdirSync } from 'fs';
import { resolve } from 'path';
import loadEvent from '../../bot/helper/events/load-event';
import { BotEvent } from '../../events/events';


/**
 * Get the list of all the available events by searching in the events directory
 */
export default function getAvailableEvents(): BotEvent[] {

    let availableEvents: BotEvent[] = [];


    readdirSync(resolve(__dirname, '../../events')).forEach(evtName => {

        const event = loadEvent(evtName, false);
        if (event)
            availableEvents.push(event);

    });


    return availableEvents;
}
