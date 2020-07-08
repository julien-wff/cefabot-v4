import { Command } from '../commands';


/**
 * Toggle the state of one command in the bot commands list
 * @param botCommands The list of commands from the bot
 * @param command The command to toggle
 */
export default function toggleBotCommand(botCommands: Command[], command: Command) {

    if (botCommands.includes(command)) {

        if (!command.removable) return;

        const cmdIndex = botCommands.findIndex(botCmd => botCmd === command);
        botCommands.splice(cmdIndex, 1);

    } else {

        botCommands.push(command);

    }

}
