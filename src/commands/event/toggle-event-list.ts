import { PathRun } from '../commands';
import getAvailableEvents from './get-available-events';
import toggleBotEvent from './toggle-bot-event';
import sendEventsList from './send-events-list';
import saveEvents from './save-events';

interface ToggleEventListProps {
    events: string[];
}

const toggleEventList: PathRun<ToggleEventListProps> = async (message, params, bot) => {

    const availableEvents = getAvailableEvents();
    const eventsToToggle = availableEvents.filter(evt => params.events.includes(evt.name));

    const evtToggleTasks = eventsToToggle.map(evt =>
        toggleBotEvent(bot, evt)
            .then(err => err ? message.reply(err) : void 0),
    );

    await Promise.all(evtToggleTasks);

    await saveEvents(bot);

    await sendEventsList(message, {}, bot);

};


export default toggleEventList;
