import genCommandList from './gen-command-list';
import getAvailableCommands from './get-available-commands';
import { PathRun } from '../commands';


/**
 * Send the list of enabled and disabled commands in the channel
 */
const sendAvailableCommands: PathRun = async (message, params, bot) => {

    const commands = getAvailableCommands(bot.config._id);

    const commandList = genCommandList(commands, bot.commands);
    return await message.channel.send(
        `**Liste des commandes disponibles (${bot.commands.length}/${commands.length} activées) :**\n${commandList}`,
    );

};

export default sendAvailableCommands;
