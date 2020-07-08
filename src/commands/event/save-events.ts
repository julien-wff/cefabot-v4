import { BotInstance } from '../../bot/botTypes';
import BotModel from '../../models/BotModel';

export default async function saveEvents(bot: BotInstance) {

    await BotModel.updateOne(
        { _id: bot.config._id },
        {
            $set: {
                events: bot.config.events,
            },
        },
    );

}
