import { BotInstance } from '../../bot/botTypes';
import BotModel from '../../models/BotModel';


/**
 * Write the actual command list in the config of the bot and in the db
 * @param bot The bot instance
 */
export default async function saveChanges(bot: BotInstance) {

    const commandList = bot.commands.map(cmd => cmd.name);

    bot.config.commands = commandList;

    await BotModel.updateOne(
        { _id: bot.config._id },
        {
            $set: {
                commands: commandList,
            },
        },
    );

}
