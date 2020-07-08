import { BotEvent } from '../../../events/events';
import loadEvent from './load-event';

export default function loadAllEvents(eventsList: string[]) {

    let events: BotEvent[] = [];

    eventsList.forEach(name => {
        const event = loadEvent(name, true);
        if (event)
            events.push(event);
    });

    return events;

}
