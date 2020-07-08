import { PathRun } from '../commands';
import getAvailableEvents from './get-available-events';

/**
 * Send the list of enabled and disabled commands in the channel
 */
const sendEventsList: PathRun = async (message, params, bot) => {

    const events = getAvailableEvents();

    const eventsStr = events
        .map(evt =>
            `${
                bot.config.events.find(botEvt => botEvt === evt.name)
                    ? ':green_circle:'
                    : ':red_circle:'
            } ${evt.name}`,
        )
        .join('\n');

    await message.channel.send(
        `**Liste des commandes disponibles (${bot.config.events.length}/${events.length} activées) :**\n${eventsStr}`,
    );

};


export default sendEventsList;
