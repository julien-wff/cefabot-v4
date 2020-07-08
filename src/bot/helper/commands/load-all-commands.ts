import { Command } from '../../../commands/commands';
import loadCommand from './load-command';

export default async function loadAllCommands(commandsList: string[], botID: any) {

    let commands: Command[] = [];
    commandsList.forEach(name => {
        const command = loadCommand(name, true, botID);
        if (command)
            commands.push(command);
    });

    return commands;

}
