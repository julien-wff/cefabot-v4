import { Command } from '../commands';

/**
 * Filter a list of commands based on the command name or the triggers
 * @param commands The command list to filter
 * @param list A list of command names or triggers to keep
 */
export function parseCommandList(commands: Command[], list: string[]): Command[] {

    return commands.filter(cmd =>
        list.includes(cmd.name) // If the specified command list includes the command name
        || cmd.triggers.some(trigger => list.includes(trigger)),    // If the specified command list includes one of the commands trigger
    );

}
