import { PathRun } from '../commands';
import { parseCommandList } from './parse-command-list';
import toggleBotCommand from './toggle-bot-command';
import saveChanges from './save-changes';
import sendAvailableCommands from './send-available-commands';
import getAvailableCommands from './get-available-commands';


interface ToggleCommandListProps {
    commands: string[];
}

/**
 * Toggle a specified list of commands and save the changes
 */
const toggleCommandList: PathRun<ToggleCommandListProps> = async (message, params, bot) => {

    const commands = getAvailableCommands(bot.config._id);
    const parsedCommands = parseCommandList(commands, params.commands);

    parsedCommands.forEach(cmd => toggleBotCommand(bot.commands, cmd));

    await saveChanges(bot);

    return await sendAvailableCommands(message, {}, bot);

};


export default toggleCommandList;
