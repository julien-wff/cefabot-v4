import { Command } from '../commands';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import loadCommand from '../../bot/helper/commands/load-command';


/**
 * Get the list of all the available commands by searching in the command directory
 * @param botID Used to log a loading error
 */
export default function getAvailableCommands(botID?: any): Command[] {

    let availableCommands: Command[] = [];


    readdirSync(resolve(__dirname, '../')).forEach(name => {

        const command = loadCommand(name, false, botID);
        if (command)
            availableCommands.push(command);

    });


    return availableCommands;
}
