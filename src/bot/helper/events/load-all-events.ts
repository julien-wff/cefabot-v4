import { BotEvent } from '../../../events/events';
import loadEvent from './load-event';

export default function loadAllEvents(eventsList: string[], botID?: any) {

    let events: BotEvent[] = [];

    eventsList.forEach(name => {
        const event = loadEvent(name, true, botID);
        if (event)
            events.push(event);
    });

    return events;

}
